'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { TagBadge } from '../TagBadge'
import type { Task } from '@/hooks/useWorkOrganizerState'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

const statusBadgeClass: Record<string, string> = {
  todo: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/15 text-primary',
  done: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
}

const priorityColors: Record<string, string> = {
  low: 'text-emerald-500 dark:text-emerald-400',
  medium: 'text-amber-500 dark:text-amber-400',
  high: 'text-rose-500 dark:text-rose-400',
}

export function TaskCard({
  task,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const statusLabel =
    task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-accent/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{task.title}</h4>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded ${statusBadgeClass[task.status]}`}>
              {statusLabel}
            </span>
            <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
              {task.tags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </button>
  )
}
