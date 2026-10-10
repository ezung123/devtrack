import React from 'react'
import { KanbanBoard } from '../components/kanban/KanbanBoard'

export const KanbanPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize your workflow across stages. Drag & drop cards or use quick-action buttons to update task status.
          </p>
        </div>
      </div>

      {/* Board */}
      <KanbanBoard />
    </div>
  )
}
