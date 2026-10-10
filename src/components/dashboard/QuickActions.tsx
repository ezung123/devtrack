import React from 'react'
import { Plus, FolderPlus, Columns3, BarChart2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useDevTrack } from '../../context/DevTrackContext'

export const QuickActions: React.FC = () => {
  const navigate = useNavigate()
  const { openCreateTaskModal, openCreateProjectModal } = useDevTrack()

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <Button
        size="sm"
        onClick={() => openCreateTaskModal()}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Create Task
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={openCreateProjectModal}
        leftIcon={<FolderPlus className="w-4 h-4" />}
      >
        Create Project
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate('/kanban')}
        leftIcon={<Columns3 className="w-4 h-4" />}
      >
        Kanban Board
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate('/analytics')}
        leftIcon={<BarChart2 className="w-4 h-4" />}
      >
        Analytics
      </Button>
    </div>
  )
}
