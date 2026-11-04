import { useState, useCallback } from 'react'

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  sizes,
}) {
  const [error, setError] = useState(false)
  const handleError = useCallback(() => setError(true), [])

  return (
    <span
      className={`image-with-fallback ${className}`.trim()}
      style={{ width, height, display: 'inline-block', position: 'relative' }}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          sizes={sizes}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={handleError}
        />
      )}
      {error && (
        <span
          className={`image-fallback ${fallbackClassName}`.trim()}
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            background: '#e7e0d4',
            color: '#9a8b6c',
            fontSize: 11,
            letterSpacing: 0.12,
            fontFamily: 'var(--serif)',
          }}
        >
          {alt || 'Image'}
        </span>
      )}
    </span>
  )
}
