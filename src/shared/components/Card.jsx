import { cn } from '../utils/cn'

export const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }) => {
  return (
    <div className={cn('p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}

export const CardContent = ({ children, className }) => {
  return <div className={cn('p-4 sm:p-6', className)}>{children}</div>
}

export const CardFooter = ({ children, className }) => {
  return (
    <div className={cn('p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50', className)}>
      {children}
    </div>
  )
}
