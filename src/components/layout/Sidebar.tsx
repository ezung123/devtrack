import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
} from 'lucide-react'
import { useDevTrack } from '../../context/DevTrackContext'
import { cn } from '../../utils/cn'

export interface SidebarProps {
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { metrics, settings } = useDevTrack()

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: metrics.activeProjects > 0 ? metrics.activeProjects : null,
      badgeColor: 'bg-indigo-500/10 text-indigo-400',
    },
    {
      to: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: metrics.pendingTasks > 0 ? metrics.pendingTasks : null,
      badgeColor: 'bg-amber-500/10 text-amber-400',
    },
    {
      to: '/kanban',
      label: 'Kanban Board',
      icon: Columns3,
      badge: null,
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top: Logo & Collapse */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight text-base bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    DevTrack
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
                    v1.0 • PRO
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        )}
                      />
                      {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!isCollapsed && item.badge !== null && (
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                            isActive ? 'bg-white/20 text-white' : item.badgeColor
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50',
              isCollapsed && 'justify-center p-2'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {settings.userName.slice(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                  {settings.userName}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {settings.userTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
