import React from 'react'
import { Modal } from '../ui/Modal'
import { ProgressBar } from '../ui/ProgressBar'
import { ProjectStatusBadge, PriorityBadge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatDate } from '../../utils/dateUtils'
import { Plus, Check, Edit2 } from 'lucide-react'
import type { ProjectWithStats } from '../../types/project'
import { useDevTrack } from '../../context/DevTrackContext'

export interface ProjectDetailModalProps {
  project: ProjectWithStats | null
  isOpen: boolean
  onClose: () => void
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { tasks, updateTaskStatus, openCreateTaskModal, openEditProjectModal } = useDevTrack()

  if (!project) return null

  const projectTasks = tasks.filter((t) => t.projectId === project.id)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      description={`Project ID: ${project.id}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status & Priority Row */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <ProjectStatusBadge status={project.status} size="md" />
            <PriorityBadge priority={project.priority} size="md" />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onClose()
              openEditProjectModal(project)
            }}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit Project
          </Button>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Description
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Timeline & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 block">Start Date</span>
            <span className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
              {formatDate(project.startDate)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Target Deadline</span>
            <span className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
              {formatDate(project.deadline)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Completion</span>
            <span className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
              {project.progressPercentage}% ({project.completedTasks}/{project.totalTasks})
            </span>
          </div>
        </div>

        <ProgressBar progress={project.progressPercentage} size="md" showLabel />

        {/* Associated Tasks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Tasks ({projectTasks.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose()
                openCreateTaskModal(project.id)
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs h-7 px-2"
            >
              Add Task
            </Button>
          </div>

          {projectTasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">
              No tasks currently linked to this project.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() =>
                        updateTaskStatus(
                          task.id,
                          task.status === 'done' ? 'todo' : 'done'
                        )
                      }
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'done'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 text-transparent hover:border-emerald-500'
                      }`}
                      aria-label="Toggle task done"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <span
                      className={`truncate font-medium ${
                        task.status === 'done'
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={task.status} size="sm" />
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
