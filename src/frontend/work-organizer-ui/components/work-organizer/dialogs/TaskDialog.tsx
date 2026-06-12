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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagInput } from '../TagInput'
import type { Task } from '@/hooks/useWorkOrganizerState'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    tagNames: string[],
  ) => void
  task?: Task
  title: string
  onAddTag?: (name: string) => void | Promise<void>
  onRemoveTag?: (tagId: string) => void | Promise<void>
}

export function TaskDialog({
  open,
  onOpenChange,
  onSave,
  task,
  title,
  onAddTag,
  onRemoveTag,
}: TaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium')
  const [pendingTags, setPendingTags] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setTaskTitle(task?.title || '')
      setDescription(task?.description || '')
      setPriority(task?.priority || 'medium')
      setPendingTags([])
    }
  }, [open, task])

  const handleSave = () => {
    if (taskTitle.trim()) {
      onSave(taskTitle, description, priority, pendingTags)
      setTaskTitle('')
      setDescription('')
      setPriority('medium')
      setPendingTags([])
      onOpenChange(false)
    }
  }

  const addPendingTag = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed || pendingTags.includes(trimmed)) return
    setPendingTags((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b)))
  }

  const removePendingTag = (name: string) => {
    setPendingTags((prev) => prev.filter((t) => t !== name))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
              <SelectTrigger id="task-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            {task && onAddTag && onRemoveTag ? (
              <TagInput
                tags={task.tags}
                onAdd={onAddTag}
                onRemove={onRemoveTag}
                placeholder="Add task tag"
              />
            ) : (
              <TagInput
                tags={pendingTags.map((name) => ({
                  id: name,
                  name,
                  color: 'slate',
                }))}
                onAdd={addPendingTag}
                onRemove={(id) => removePendingTag(id)}
                placeholder="Add tags for new task"
              />
            )}
          </div>
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
