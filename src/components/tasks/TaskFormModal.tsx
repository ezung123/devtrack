import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { useDevTrack } from '../../hooks/useDevTrack'
import { getFutureDateString, getTodayString } from '../../utils/dateUtils'
import type { Task, TaskPriority, TaskStatus } from '../../types/task'

interface TaskFormContentProps {
  initialTask: Task | null
  defaultProjectId?: string
  onClose: () => void
}

const TaskFormContent: React.FC<TaskFormContentProps> = ({
  initialTask,
  defaultProjectId,
  onClose,
}) => {
  const { createTask, updateTask, projects } = useDevTrack()

  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [projectId, setProjectId] = useState(
    initialTask?.projectId ?? defaultProjectId ?? (projects[0]?.id ?? '')
  )
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate ?? getFutureDateString(3)
  )
  const [estimatedHours, setEstimatedHours] = useState<string>(
    initialTask?.estimatedHours !== null && initialTask?.estimatedHours !== undefined
      ? String(initialTask.estimatedHours)
      : ''
  )
  const [tagsInput, setTagsInput] = useState(initialTask?.tags.join(', ') ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!title.trim() || title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters'
    }
    if (!projectId) {
      errs.projectId = 'Please select a project'
    }
    if (!dueDate) {
      errs.dueDate = 'Due date is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const hours = estimatedHours ? parseFloat(estimatedHours) : null

      if (initialTask) {
        updateTask(initialTask.id, {
          title: title.trim(),
          projectId,
          description: description.trim(),
          status,
          priority,
          dueDate,
          tags,
          estimatedHours: hours,
        })
      } else {
        createTask({
          title: title.trim(),
          projectId,
          description: description.trim(),
          status,
          priority,
          dueDate,
          tags,
          estimatedHours: hours,
        })
      }
      onClose()
    } catch {
      // Caught and surfaced via toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Task Title *"
        placeholder="e.g. Implement Kafka telemetry rebalancer"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      {/* Project Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Assigned Project *
        </label>
        <Select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          error={errors.projectId}
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Detailed task criteria, technical approach, or context..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Status & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </Select>

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </div>

      {/* Due Date & Estimated Hours Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Due Date *"
          value={dueDate}
          min={getTodayString()}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />

        <Input
          type="number"
          step="0.5"
          min="0"
          max="500"
          label="Estimated Hours"
          placeholder="e.g. 4.5"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(e.target.value)}
        />
      </div>

      {/* Tags */}
      <Input
        label="Tags (Comma separated)"
        placeholder="e.g. frontend, bug, auth, api"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        helperText="Add keywords for quick filtering and identification"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

export const TaskFormModal: React.FC = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    taskModalDefaultProjectId,
  } = useDevTrack()

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={editingTask ? 'Edit Task' : 'Create New Task'}
      description="Define task objectives, timeline, project assignment, and priority."
      maxWidth="lg"
    >
      {isTaskModalOpen && (
        <TaskFormContent
          key={editingTask ? editingTask.id : 'create_task'}
          initialTask={editingTask}
          defaultProjectId={taskModalDefaultProjectId}
          onClose={closeTaskModal}
        />
      )}
    </Modal>
  )
}
