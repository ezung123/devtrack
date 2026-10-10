import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ActivityDrawer } from './ActivityDrawer'
import { TaskFormModal } from '../tasks/TaskFormModal'
import { ProjectFormModal } from '../projects/ProjectFormModal'
import { useDevTrack } from '../../context/DevTrackContext'

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false)
  const { activities } = useDevTrack()

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleActivityDrawer={() => setIsActivityDrawerOpen((prev) => !prev)}
          activityCount={activities.length}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Slide-out Activity Feed Drawer */}
      <ActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      {/* Global Modals for Creating/Editing */}
      <TaskFormModal />
      <ProjectFormModal />
    </div>
  )
}
