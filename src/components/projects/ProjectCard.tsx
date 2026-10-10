import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { ProjectStatusBadge, PriorityBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { formatDate, getDaysRemaining } from '../../utils/dateUtils'
import { Calendar, Plus, Edit2, Trash2, Tag, AlertCircle } from 'lucide-react'
import type { ProjectWithStats } from '../../types/project'
import { useDevTrack } from '../../context/DevTrackContext'

export interface ProjectCardProps {
  project: ProjectWithStats
  onViewDetails?: (project: ProjectWithStats) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const { openEditProjectModal, deleteProject, openCreateTaskModal } = useDevTrack()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const daysLeft = getDaysRemaining(project.deadline)

  return (
    <>
      <Card className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group">
        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <h3
                  onClick={() => onViewDetails?.(project)}
                  className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-500 cursor-pointer transition-colors line-clamp-1"
                >
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <PriorityBadge priority={project.priority} size="sm" />
                <ProjectStatusBadge status={project.status} size="sm" />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>

          {/* Progress Section */}
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {project.completedTasks} of {project.totalTasks} tasks complete
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {project.progressPercentage}%
              </span>
            </div>
            <ProgressBar progress={project.progressPercentage} size="sm" />
          </div>

          {/* Timeline & Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(project.deadline)}</span>
            </div>

            {project.isOverdue ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            ) : daysLeft >= 0 ? (
              <span className="text-[11px] text-slate-400">
                {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
              </span>
            ) : null}
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreateTaskModal(project.id)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs h-7 px-2.5"
            >
              Add Task
            </Button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditProjectModal(project)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit project"
                aria-label="Edit project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete project"
                aria-label="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteProject(project.id)}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.name}"? This action will also remove all ${project.totalTasks} associated tasks to prevent orphaned data.`}
        confirmText="Delete Project & Tasks"
        variant="danger"
      />
    </>
  )
}
