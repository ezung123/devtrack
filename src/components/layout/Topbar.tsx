import React from 'react'
import {
  Menu,
  Sun,
  Moon,
  Plus,
  Bell,
  Search,
} from 'lucide-react'
import { useDevTrack } from '../../context/DevTrackContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/Button'

export interface TopbarProps {
  onOpenMobileSidebar: () => void
  onToggleActivityDrawer: () => void
  activityCount: number
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileSidebar,
  onToggleActivityDrawer,
  activityCount,
}) => {
  const { searchQuery, setSearchQuery, openCreateTaskModal, openCreateProjectModal } =
    useDevTrack()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, or tags... (Ctrl+/)"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={openCreateProjectModal}
            className="hidden md:inline-flex"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Project
          </Button>

          <Button
            size="sm"
            onClick={() => openCreateTaskModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Task</span>
          </Button>
        </div>

        {/* Activity Feed Button */}
        <button
          onClick={onToggleActivityDrawer}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          title="Activity log"
          aria-label="View activity logs"
        >
          <Bell className="w-5 h-5" />
          {activityCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  )
}
