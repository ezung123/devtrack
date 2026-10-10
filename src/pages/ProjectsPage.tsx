import React, { useState, useMemo } from 'react'
import { useDevTrack } from '../hooks/useDevTrack'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectFilterBar } from '../components/projects/ProjectFilterBar'
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Plus, FolderKanban } from 'lucide-react'
import type { ProjectFilterState } from '../types/filter'
import type { ProjectPriority, ProjectWithStats } from '../types/project'

const DEFAULT_FILTER: ProjectFilterState = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

const PRIORITY_ORDER: Record<ProjectPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const ProjectsPage: React.FC = () => {
  const { projectsWithStats, openCreateProjectModal, searchQuery: globalSearch } = useDevTrack()
  const [filter, setFilter] = useState<ProjectFilterState>(DEFAULT_FILTER)
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null)

  const effectiveSearch = filter.searchQuery || globalSearch

  const filteredProjects = useMemo(() => {
    return projectsWithStats
      .filter((p: ProjectWithStats) => {
        if (filter.status !== 'all' && p.status !== filter.status) return false
        if (filter.priority !== 'all' && p.priority !== filter.priority) return false
        if (effectiveSearch.trim()) {
          const q = effectiveSearch.toLowerCase()
          const matchesName = p.name.toLowerCase().includes(q)
          const matchesDesc = p.description.toLowerCase().includes(q)
          const matchesTag = p.tags.some((t: string) => t.toLowerCase().includes(q))
          if (!matchesName && !matchesDesc && !matchesTag) return false
        }
        return true
      })
      .sort((a: ProjectWithStats, b: ProjectWithStats) => {
        let valA: string | number = a.createdAt
        let valB: string | number = b.createdAt

        if (filter.sortBy === 'name') {
          valA = a.name.toLowerCase()
          valB = b.name.toLowerCase()
        } else if (filter.sortBy === 'deadline') {
          valA = new Date(a.deadline).getTime()
          valB = new Date(b.deadline).getTime()
        } else if (filter.sortBy === 'progress') {
          valA = a.progressPercentage
          valB = b.progressPercentage
        } else if (filter.sortBy === 'priority') {
          valA = PRIORITY_ORDER[a.priority]
          valB = PRIORITY_ORDER[b.priority]
        }

        if (valA < valB) return filter.sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return filter.sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [projectsWithStats, filter, effectiveSearch])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            Projects
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProjects.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize architecture scopes, milestones, deadlines, and delivery progress.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreateProjectModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Filter Bar */}
      <ProjectFilterBar
        filter={{ ...filter, searchQuery: effectiveSearch }}
        onChange={setFilter}
        onReset={() => setFilter(DEFAULT_FILTER)}
      />

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-8 h-8 text-indigo-500" />}
          title="No projects match your filter"
          description="Try adjusting your search criteria, clear status filters, or start a new project."
          actionLabel="Create New Project"
          onAction={openCreateProjectModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p: ProjectWithStats) => (
            <ProjectCard
              key={p.id}
              project={p}
              onViewDetails={(target: ProjectWithStats) => setSelectedProject(target)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ProjectDetailModal
        isOpen={Boolean(selectedProject)}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
