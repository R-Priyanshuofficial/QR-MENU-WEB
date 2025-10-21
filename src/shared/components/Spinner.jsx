import { Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'

export const Spinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <Loader2
      className={cn('animate-spin text-primary-600', sizes[size], className)}
    />
  )
}

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Spinner size="lg" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}

export const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        'skeleton rounded-lg bg-gray-200',
        className
      )}
    />
  )
}
