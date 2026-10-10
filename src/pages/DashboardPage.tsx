import { useDevTrack } from '../hooks/useDevTrack'
import { MetricCard } from '../components/dashboard/MetricCard'
import { ProductivityChart } from '../components/dashboard/ProductivityChart'
import { StatusDistributionChart } from '../components/dashboard/StatusDistributionChart'
import { RecentProjectsList } from '../components/dashboard/RecentProjectsList'
import { UpcomingDeadlinesList } from '../components/dashboard/UpcomingDeadlinesList'
import { QuickActions } from '../components/dashboard/QuickActions'
import { EmptyState } from '../components/ui/EmptyState'
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Percent,
  ListTodo,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const {
    metrics,
    weeklyProductivity,
    statusDistribution,
    projectsWithStats,
    tasks,
    projects,
    resetData,
  } = useDevTrack()
  const navigate = useNavigate()

  const hasData = projects.length > 0 || tasks.length > 0

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Engineering Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery telemetry, project milestones, and workflow velocity.
          </p>
        </div>

        <QuickActions />
      </div>

      {!hasData ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-indigo-500" />}
          title="Welcome to DevTrack"
          description="Your workspace currently has no active projects or tasks. You can quickly seed realistic engineering demo data to preview all charts and features."
          actionLabel="Load Demo Projects & Tasks"
          onAction={() => resetData(true)}
        />
      ) : (
        <>
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <MetricCard
              title="Projects"
              value={metrics.totalProjects}
              subtext={`${metrics.activeProjects} active`}
              icon={<FolderKanban className="w-4 h-4" />}
              color="indigo"
              onClick={() => navigate('/projects')}
            />

            <MetricCard
              title="Total Tasks"
              value={metrics.totalTasks}
              subtext="all workflows"
              icon={<ListTodo className="w-4 h-4" />}
              color="sky"
              onClick={() => navigate('/tasks')}
            />

            <MetricCard
              title="Completed"
              value={metrics.completedTasks}
              subtext="shipped tasks"
              icon={<CheckCircle2 className="w-4 h-4" />}
              color="emerald"
              onClick={() => navigate('/tasks')}
            />

            <MetricCard
              title="Pending"
              value={metrics.pendingTasks}
              subtext="in pipeline"
              icon={<Clock className="w-4 h-4" />}
              color="amber"
              onClick={() => navigate('/kanban')}
            />

            <MetricCard
              title="Overdue"
              value={metrics.overdueTasks}
              subtext="requires attention"
              icon={<AlertTriangle className="w-4 h-4" />}
              color="rose"
              onClick={() => navigate('/tasks')}
            />

            <MetricCard
              title="Completion Rate"
              value={`${metrics.completionPercentage}%`}
              subtext="overall delivery"
              icon={<Percent className="w-4 h-4" />}
              color="indigo"
              onClick={() => navigate('/analytics')}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductivityChart data={weeklyProductivity} />
            </div>
            <div>
              <StatusDistributionChart data={statusDistribution} />
            </div>
          </div>

          {/* Bottom Lists Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentProjectsList projects={projectsWithStats} />
            <UpcomingDeadlinesList tasks={tasks} projects={projects} />
          </div>
        </>
      )}
    </div>
  )
}
