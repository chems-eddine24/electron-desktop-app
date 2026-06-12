'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '../TagInput'
import type { Project } from '@/hooks/useWorkOrganizerState'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, description: string) => void
  project?: Project
  title: string
  onAddTag?: (name: string) => void | Promise<void>
  onRemoveTag?: (tagId: string) => void | Promise<void>
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSave,
  project,
  title,
  onAddTag,
  onRemoveTag,
}: ProjectDialogProps) {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')

  useEffect(() => {
    if (open) {
      setName(project?.name || '')
      setDescription(project?.description || '')
    }
  }, [open, project])

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description)
      if (!project) {
        setName('')
        setDescription('')
      }
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          {project && onAddTag && onRemoveTag && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                tags={project.tags}
                onAdd={onAddTag}
                onRemove={onRemoveTag}
                placeholder="Add project tag"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
