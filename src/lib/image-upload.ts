import { supabase } from './supabase'

export const runtime = "nodejs"

export interface UploadResult {
  success: boolean
  data?: {
    id: number
    car_id: number
    image_url: string
    image_name: string
    is_primary: boolean
    order_index: number
  }[]
  error?: string
}

export interface UploadImageData {
  carId: number
  files: File[]
  bucketName?: string
}

/**
 * Server action equivalent for uploading images to Supabase Storage
 * Handles FormData, uploads to bucket, and saves to database
 */
export async function uploadCarImages({
  carId,
  files,
  bucketName = 'car-images'
}: UploadImageData): Promise<UploadResult> {
  try {
    if (!files || files.length === 0) {
      return {
        success: false,
        error: 'Nu au fost furnizate fișiere pentru upload'
      }
    }

    const uploadedImages = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: `Fișierul ${file.name} nu este o imagine validă`
        }
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return {
          success: false,
          error: `Fișierul ${file.name} depășește limita de 10MB`
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${carId}_${Date.now()}_${i}.${fileExt}`
      const filePath = `cars/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return {
          success: false,
          error: `Eroare la upload-ul fișierului ${file.name}: ${uploadError.message}`
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      // Prepare image data for database
      const imageData = {
        car_id: carId,
        image_url: urlData.publicUrl,
        image_name: file.name,
        is_primary: i === 0, // First image is primary
        order_index: i
      }

      uploadedImages.push(imageData)
    }

    // Insert all images into database
    const { data: dbImages, error: dbError } = await supabase
      .from('car_images')
      .insert(uploadedImages)
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: `Eroare la salvarea în baza de date: ${dbError.message}`
      }
    }

    return {
      success: true,
      data: dbImages || []
    }

  } catch (error) {
    console.error('Upload images error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare neașteptată la upload'
    }
  }
}

/**
 * Delete an image from both storage and database
 */
export async function deleteCarImage(imageId: number, bucketName = 'car-images'): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the image data to find the file path
    const { data: imageData, error: fetchError } = await supabase
      .from('car_images')
      .select('image_url, image_name')
      .eq('id', imageId)
      .single()

    if (fetchError) {
      return {
        success: false,
        error: `Eroare la găsirea imaginii: ${fetchError.message}`
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('car_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      return {
        success: false,
        error: `Eroare la ștergerea din baza de date: ${dbError.message}`
      }
    }

    // Try to delete from storage (optional - we might want to keep files)
    if (imageData.image_name) {
      try {
        await supabase.storage
          .from(bucketName)
          .remove([imageData.image_name])
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError)
        // Don't fail the operation if storage deletion fails
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Delete image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare neașteptată la ștergere'
    }
  }
}

/**
 * Set primary image for a car
 */
export async function setPrimaryImage(carId: number, imageId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Reset all images to non-primary
    const { error: resetError } = await supabase
      .from('car_images')
      .update({ is_primary: false })
      .eq('car_id', carId)

    if (resetError) {
      return {
        success: false,
        error: `Eroare la resetarea imaginilor: ${resetError.message}`
      }
    }

    // Set the selected image as primary
    const { error: setError } = await supabase
      .from('car_images')
      .update({ is_primary: true })
      .eq('id', imageId)

    if (setError) {
      return {
        success: false,
        error: `Eroare la setarea imaginii principale: ${setError.message}`
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Set primary image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare neașteptată'
    }
  }
}
