import React from 'react'
import { cn } from '../../utils/cn'

export interface ProgressBarProps {
  progress: number // 0 to 100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  colorClass?: string
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  colorClass,
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)))

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const defaultColor =
    clamped === 100
      ? 'bg-emerald-500'
      : clamped >= 60
      ? 'bg-indigo-500'
      : clamped >= 30
      ? 'bg-sky-500'
      : 'bg-amber-500'

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-medium text-slate-600 dark:text-slate-400">Progress</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{clamped}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-all',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClass || defaultColor
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
