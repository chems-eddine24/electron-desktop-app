'use client'

import { Button } from '@/components/ui/button'
import { ProjectCard } from '../cards/ProjectCard'
import { ThemeToggle } from '../ThemeToggle'
import { Plus } from 'lucide-react'
import type { Project } from '@/hooks/useWorkOrganizerState'

interface ProjectsPanelProps {
  projects: Project[]
  selectedProjectId: string | null
  getTaskCount: (projectId: string) => number
  onSelectProject: (id: string) => void
  onAddProject: () => void
  onEditProject: (id: string) => void
  onDeleteProject: (id: string) => void
}

export function ProjectsPanel({
  projects,
  selectedProjectId,
  getTaskCount,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
}: ProjectsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">Organizer</h2>
            <p className="text-xs text-muted-foreground">Projects & tasks</p>
          </div>
          <ThemeToggle />
        </div>
        <Button onClick={onAddProject} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No projects yet</p>
            <p className="text-muted-foreground text-xs mt-2">
              Click &quot;New Project&quot; to get started
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                ...project,
                taskCount: getTaskCount(project.id),
              }}
              isSelected={selectedProjectId === project.id}
              onSelect={() => onSelectProject(project.id)}
              onEdit={() => onEditProject(project.id)}
              onDelete={() => onDeleteProject(project.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
