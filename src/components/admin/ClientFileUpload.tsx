'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import SafeImage from '@/components/ui/safe-image'

interface ClientFileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  existingFiles?: File[]
}

const ClientFileUpload = ({
  onFilesChange,
  maxFiles = 20,
  maxFileSize = 5,
  acceptedTypes = ['image/*'],
  existingFiles = []
}: ClientFileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [tempFiles, setTempFiles] = useState<File[]>(existingFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const validateFile = (file: File): boolean => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      console.warn(`Invalid file type: ${file.type}`)
      return false
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      console.warn(`File too large: ${file.size} bytes`)
      return false
    }

    return true
  }

  const handleFiles = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter(validateFile)
    const newFiles = [...tempFiles, ...validFiles].slice(0, maxFiles)
    
    setTempFiles(newFiles)
    onFilesChange(newFiles)
  }, [tempFiles, maxFiles, maxFileSize, acceptedTypes, onFilesChange])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeFile = useCallback((index: number) => {
    const newFiles = tempFiles.filter((_, i) => i !== index)
    setTempFiles(newFiles)
    onFilesChange(newFiles)
  }, [tempFiles, onFilesChange])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const remainingSlots = maxFiles - tempFiles.length

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {remainingSlots > 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? 'Eliberează pentru a încărca' : 'Trage și eliberează fotografii aici'}
          </h3>
          <p className="text-muted-foreground mb-4">
            sau <button 
              type="button"
              onClick={openFileDialog}
              className="text-primary hover:underline font-medium"
            >
              selectează fișiere
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            Formate acceptate: JPG, PNG, WEBP. Dimensiune maximă: {maxFileSize}MB per fișier.
            {remainingSlots > 0 && ` Mai ai ${remainingSlots} sloturi disponibile.`}
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* File Previews */}
      {tempFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Imagini selectate ({tempFiles.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tempFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <SafeImage
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full"
                    fallbackIcon={<Upload className="h-6 w-6 text-muted-foreground" />}
                  />
                </div>
                
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Principală
                  </Badge>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientFileUpload
