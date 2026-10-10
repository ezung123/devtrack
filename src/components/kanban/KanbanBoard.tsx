import React, { useState } from 'react'
import { KanbanColumn } from './KanbanColumn'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Plus, Filter } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import { useDevTrack } from '../../context/DevTrackContext'

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    projects,
    updateTaskStatus,
    openCreateTaskModal,
    deleteTask,
    searchQuery,
  } = useDevTrack()

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  // Filter tasks based on selected project and global search query
  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = t.title.toLowerCase().includes(q)
      const matchesTag = t.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchesTitle || matchesTag
    }
    return true
  })

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'todo', title: 'To Do', color: '#94a3b8' },
    { status: 'in_progress', title: 'In Progress', color: '#38bdf8' },
    { status: 'in_review', title: 'In Review', color: '#fbbf24' },
    { status: 'done', title: 'Done', color: '#34d399' },
  ]

  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    updateTaskStatus(taskId, targetStatus)
  }

  const handleAddTask = (_status: TaskStatus) => {
    openCreateTaskModal(selectedProjectId !== 'all' ? selectedProjectId : undefined)
  }

  return (
    <div className="space-y-6">
      {/* Kanban Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Project Scope:
          </span>
          <div className="w-56">
            <Select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="py-1.5 text-xs"
            >
              <option value="all">All Projects ({tasks.length} tasks)</option>
              {projects.map((p) => {
                const count = tasks.filter((t) => t.projectId === p.id).length
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} ({count})
                  </option>
                )
              })}
            </Select>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() =>
            openCreateTaskModal(
              selectedProjectId !== 'all' ? selectedProjectId : undefined
            )
          }
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* 4 Columns Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status)
          return (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              color={col.color}
              tasks={colTasks}
              projects={projects}
              onDropTask={handleDropTask}
              onAddTask={handleAddTask}
              onDeleteRequest={(task) => setDeletingTask(task)}
            />
          )
        })}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) {
            deleteTask(deletingTask.id)
            setDeletingTask(null)
          }
        }}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deletingTask?.title}" from the board?`}
        confirmText="Delete Task"
        variant="danger"
      />
    </div>
  )
}
