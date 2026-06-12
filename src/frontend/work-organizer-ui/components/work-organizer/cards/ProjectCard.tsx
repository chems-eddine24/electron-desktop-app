'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { TagBadge } from '../TagBadge'
import type { Project } from '@/hooks/useWorkOrganizerState'

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProjectCard({
  project,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const taskCount = project.taskCount || 0

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-accent/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </p>
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
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </button>
  )
}
