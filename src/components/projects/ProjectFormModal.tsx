import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { useDevTrack } from '../../hooks/useDevTrack'
import { getFutureDateString, getTodayString } from '../../utils/dateUtils'
import type { Project, ProjectPriority, ProjectStatus } from '../../types/project'

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#ec4899', // Pink
]

interface ProjectFormContentProps {
  initialProject: Project | null
  onClose: () => void
}

const ProjectFormContent: React.FC<ProjectFormContentProps> = ({ initialProject, onClose }) => {
  const { createProject, updateProject } = useDevTrack()

  const [name, setName] = useState(initialProject?.name ?? '')
  const [description, setDescription] = useState(initialProject?.description ?? '')
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status ?? 'active')
  const [priority, setPriority] = useState<ProjectPriority>(initialProject?.priority ?? 'medium')
  const [startDate, setStartDate] = useState(initialProject?.startDate ?? getTodayString())
  const [deadline, setDeadline] = useState(
    initialProject?.deadline ?? getFutureDateString(14)
  )
  const [color, setColor] = useState(initialProject?.color ?? '#6366f1')
  const [tagsInput, setTagsInput] = useState(initialProject?.tags.join(', ') ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Project name must be at least 2 characters'
    }
    if (!startDate) {
      errs.startDate = 'Start date is required'
    }
    if (!deadline) {
      errs.deadline = 'Deadline is required'
    } else if (startDate && new Date(deadline) < new Date(startDate)) {
      errs.deadline = 'Deadline cannot be earlier than start date'
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

      if (initialProject) {
        updateProject(initialProject.id, {
          name: name.trim(),
          description: description.trim(),
          status,
          priority,
          startDate,
          deadline,
          color,
          tags,
        })
      } else {
        createProject({
          name: name.trim(),
          description: description.trim(),
          status,
          priority,
          startDate,
          deadline,
          color,
          tags,
        })
      }
      onClose()
    } catch {
      // Handled via toast in context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <Input
        label="Project Name *"
        placeholder="e.g. Distributed Event Bus & Kafka Gateway"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="High-level engineering objectives, architectural goals..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Status & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as ProjectPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </div>

      {/* Timeline Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date *"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={errors.startDate}
        />

        <Input
          type="date"
          label="Target Deadline *"
          value={deadline}
          min={startDate}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
        />
      </div>

      {/* Color Palette Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Accent Color
        </label>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              className={`w-7 h-7 rounded-full transition-transform focus:outline-none ${
                color === preset ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: preset }}
              aria-label={`Select color ${preset}`}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <Input
        label="Tags (Comma separated)"
        placeholder="e.g. backend, kubernetes, security"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        helperText="Categorize projects for filtered views"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialProject ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export const ProjectFormModal: React.FC = () => {
  const { isProjectModalOpen, closeProjectModal, editingProject } = useDevTrack()

  return (
    <Modal
      isOpen={isProjectModalOpen}
      onClose={closeProjectModal}
      title={editingProject ? 'Edit Project' : 'Create New Project'}
      description="Configure your project scope, roadmap dates, and delivery priority."
      maxWidth="lg"
    >
      {isProjectModalOpen && (
        <ProjectFormContent
          key={editingProject ? editingProject.id : 'create_project'}
          initialProject={editingProject}
          onClose={closeProjectModal}
        />
      )}
    </Modal>
  )
}
