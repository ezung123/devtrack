import React from 'react'
import { X, Clock, Trash2, CheckCircle2, Folder, Layers } from 'lucide-react'
import { useDevTrack } from '../../context/DevTrackContext'
import { formatRelativeTime } from '../../utils/dateUtils'
import { Button } from '../ui/Button'
import type { ActivityAction } from '../../types/activity'

export interface ActivityDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({ isOpen, onClose }) => {
  const { activities, clearActivities } = useDevTrack()

  if (!isOpen) return null

  const getActionIcon = (action: ActivityAction) => {
    if (action.includes('task')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    }
    if (action.includes('project')) {
      return <Folder className="w-4 h-4 text-indigo-400" />
    }
    return <Layers className="w-4 h-4 text-sky-400" />
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Activity Audit Log
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {activities.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearActivities}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Clear
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close activity drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Activities */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 text-xs"
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex-shrink-0">
                    {getActionIcon(act.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {act.entityTitle}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {act.details}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] text-slate-400 font-mono">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
