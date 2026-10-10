import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'

export interface MetricCardProps {
  title: string
  value: string | number
  subtext?: string
  icon: React.ReactNode
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky'
  className?: string
  onClick?: () => void
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  color = 'indigo',
  className,
  onClick,
}) => {
  const colorStyles = {
    indigo:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div
            className={cn(
              'p-2.5 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110',
              colorStyles[color]
            )}
          >
            {icon}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtext}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
