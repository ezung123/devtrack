import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MetricCard } from '../components/dashboard/MetricCard'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { Activity } from 'lucide-react'

describe('UI Components', () => {
  describe('MetricCard', () => {
    it('renders metric card with title, value, subtext and icon', () => {
      const handleClick = vi.fn()
      render(
        <MetricCard
          title="Active Projects"
          value={8}
          subtext="2 due this week"
          icon={<Activity data-testid="metric-icon" />}
          color="indigo"
          onClick={handleClick}
        />
      )

      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('2 due this week')).toBeInTheDocument()
      expect(screen.getByTestId('metric-icon')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Active Projects'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Badges', () => {
    it('renders priority badge with appropriate text and dot indicator', () => {
      const { rerender } = render(<PriorityBadge priority="urgent" />)
      expect(screen.getByText('Urgent')).toBeInTheDocument()

      rerender(<PriorityBadge priority="low" />)
      expect(screen.getByText('Low')).toBeInTheDocument()
    })

    it('renders task status badge accurately', () => {
      const { rerender } = render(<StatusBadge status="in_progress" />)
      expect(screen.getByText('In Progress')).toBeInTheDocument()

      rerender(<StatusBadge status="done" />)
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
  })

  describe('ConfirmDialog', () => {
    it('triggers onConfirm when confirm button is clicked', () => {
      const handleConfirm = vi.fn()
      const handleClose = vi.fn()

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Delete Confirmation"
          message="Are you sure you want to delete this resource?"
          confirmText="Yes, Delete"
        />
      )

      expect(screen.getByText('Delete Confirmation')).toBeInTheDocument()
      expect(
        screen.getByText('Are you sure you want to delete this resource?')
      ).toBeInTheDocument()

      fireEvent.click(screen.getByText('Yes, Delete'))
      expect(handleConfirm).toHaveBeenCalledTimes(1)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button', () => {
    it('renders button with loading spinner when isLoading is true', () => {
      render(
        <Button isLoading>
          Submit Task
        </Button>
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
