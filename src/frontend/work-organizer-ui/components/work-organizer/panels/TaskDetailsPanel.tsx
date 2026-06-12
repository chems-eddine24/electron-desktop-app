'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit2, Trash2 } from 'lucide-react'
import { TagInput } from '../TagInput'
import type { Task } from '@/hooks/useWorkOrganizerState'

interface TaskDetailsPanelProps {
  task: Task | undefined
  onEditTask: () => void
  onDeleteTask: () => void
  onStatusChange: (status: 'todo' | 'in-progress' | 'done') => void
  onAddTag: (name: string) => void | Promise<void>
  onRemoveTag: (tagId: string) => void | Promise<void>
}

const statusBadgeClass: Record<string, string> = {
  todo: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/15 text-primary',
  done: 'bg-emerald-500/15 text-emerald-400 dark:text-emerald-300',
}

const priorityColors: Record<string, string> = {
  low: 'text-emerald-500 dark:text-emerald-400',
  medium: 'text-amber-500 dark:text-amber-400',
  high: 'text-rose-500 dark:text-rose-400',
}

export function TaskDetailsPanel({
  task,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onAddTag,
  onRemoveTag,
}: TaskDetailsPanelProps) {
  if (!task) {
    return (
      <div className="flex flex-col h-full bg-card p-6">
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="text-muted-foreground text-sm">No task selected</p>
            <p className="text-muted-foreground text-xs mt-2">
              Select a task to view its details
            </p>
          </div>
        </div>
      </div>
    )
  }

  const statusLabel =
    task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')
  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1)

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground break-words">{task.title}</h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={onEditTask}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onDeleteTask}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <Select value={task.status} onValueChange={(value: Task['status']) => onStatusChange(value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Priority</p>
            <div
              className={`h-8 flex items-center px-3 rounded-md border border-input text-sm font-medium ${priorityColors[task.priority]}`}
            >
              {priorityLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Tags</p>
            <TagInput
              tags={task.tags}
              onAdd={onAddTag}
              onRemove={onRemoveTag}
              placeholder="Add tag and press Enter"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Created</p>
              <p className="text-sm text-foreground">{task.createdAt.toLocaleDateString()}</p>
            </div>
            {task.dueDate && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Due Date</p>
                <p className="text-sm text-foreground">{task.dueDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Status Badge</p>
            <span
              className={`inline-block text-xs px-3 py-1 rounded font-medium ${statusBadgeClass[task.status]}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
