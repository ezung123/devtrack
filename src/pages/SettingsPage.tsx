import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useDevTrack } from '../hooks/useDevTrack'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import {
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import type { ThemeMode } from '../types/settings'
import type { TaskPriority } from '../types/task'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, exportBackup, importBackup, resetData } = useDevTrack()
  const { error: toastError } = useToast()

  const [userName, setUserName] = useState(settings.userName)
  const [userTitle, setUserTitle] = useState(settings.userTitle)
  const [userEmail, setUserEmail] = useState(settings.userEmail)
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(
    String(settings.weeklyTargetHours)
  )
  const [defaultTaskPriority, setDefaultTaskPriority] = useState<TaskPriority>(
    settings.defaultTaskPriority
  )

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [resetType, setResetType] = useState<'demo' | 'clean'>('demo')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      userName: userName.trim(),
      userTitle: userTitle.trim(),
      userEmail: userEmail.trim(),
      weeklyTargetHours: parseInt(weeklyTargetHours, 10) || 40,
      defaultTaskPriority,
    })
  }

  const handleExportJSON = () => {
    const jsonStr = exportBackup()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `devtrack-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const text = event.target?.result as string
        importBackup(text)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Invalid backup format'
        toastError('Import Validation Error', msg)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure appearance, developer profile, JSON data backups, and storage reset.
        </p>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Appearance & Theme
          </CardTitle>
          <CardDescription>
            Choose your preferred interface theme. Settings persist across page reloads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'dark' as ThemeMode, label: 'Dark Mode', icon: Moon },
              { id: 'light' as ThemeMode, label: 'Light Mode', icon: Sun },
              { id: 'system' as ThemeMode, label: 'System', icon: Laptop },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-semibold transition-all ${
                  theme === id
                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Developer Profile Preferences
          </CardTitle>
          <CardDescription>
            Customize your identity and sprint defaults for DevTrack.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={userName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                placeholder="Alex Developer"
              />
              <Input
                label="Professional Title"
                value={userTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserTitle(e.target.value)}
                placeholder="Staff Software Engineer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={userEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value)}
                placeholder="alex@engineering.io"
              />
              <Input
                label="Weekly Target Hours"
                type="number"
                min="1"
                max="100"
                value={weeklyTargetHours}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeeklyTargetHours(e.target.value)
                }
              />
            </div>

            <Select
              label="Default Task Priority"
              value={defaultTaskPriority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDefaultTaskPriority(e.target.value as TaskPriority)
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>

            <Button type="submit" size="sm" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save Profile Preferences
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management: Export & Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Data Management & Local Persistence
          </CardTitle>
          <CardDescription>
            DevTrack stores data locally in your browser LocalStorage. Export your projects and tasks as JSON or restore from a previous backup with schema verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export & Import Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-500" />
                Export Workspace
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Download a complete JSON file containing all projects, tasks, audit history, and preferences.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="mt-2 text-xs"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download JSON Backup
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                Import Backup
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Restore workspace from an exported JSON backup file. Validated with Zod before acceptance.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                id="import-backup-file"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Select Backup File
              </Button>
            </div>
          </div>

          {/* Reset Options */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              Danger Zone
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setResetType('demo')
                  setIsResetConfirmOpen(true)
                }}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Restore Demo Data
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setResetType('clean')
                  setIsResetConfirmOpen(true)
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Reset Clean Slate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => resetData(resetType === 'demo')}
        title={resetType === 'demo' ? 'Restore Demo Data?' : 'Wipe Clean Slate?'}
        message={
          resetType === 'demo'
            ? 'This will reset all projects and tasks back to the default sample engineering dataset. Any existing custom records will be replaced.'
            : 'This will permanently wipe all local projects, tasks, and audit logs. You will start with a completely empty dashboard.'
        }
        confirmText={resetType === 'demo' ? 'Restore Demo Data' : 'Wipe Everything'}
        variant={resetType === 'clean' ? 'danger' : 'warning'}
      />
    </div>
  )
}
