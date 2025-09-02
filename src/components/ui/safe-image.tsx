import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface SafeImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackIcon?: React.ReactNode
  fallbackClassName?: string
}

const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon,
  fallbackClassName = ''
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Don't render if src is falsy
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className} ${fallbackClassName}`}>
        {fallbackIcon || <ImageIcon className="h-6 w-6 text-muted-foreground" />}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-6 w-6 text-muted-foreground animate-pulse" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}

export default SafeImage
