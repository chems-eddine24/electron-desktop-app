'use client'

import { Button } from '@/components/ui/button'
import { TaskCard } from '../cards/TaskCard'
import { Plus } from 'lucide-react'
import type { Task } from '@/hooks/useWorkOrganizerState'

interface TasksPanelProps {
  tasks: Task[]
  selectedTaskId: string | null
  selectedProjectId: string | null
  onSelectTask: (id: string) => void
  onAddTask: () => void
  onEditTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

export function TasksPanel({
  tasks,
  selectedTaskId,
  selectedProjectId,
  onSelectTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TasksPanelProps) {
  const isAddDisabled = !selectedProjectId
  const taskCount = tasks.length

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <Button
          onClick={onAddTask}
          className="w-full"
          size="sm"
          disabled={isAddDisabled}
          title={isAddDisabled ? 'Select a project first' : 'Add a new task'}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!selectedProjectId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Select a project</p>
            <p className="text-muted-foreground text-xs mt-2">Choose a project to view and manage its tasks</p>
          </div>
        ) : taskCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No tasks yet</p>
            <p className="text-muted-foreground text-xs mt-2">Click &quot;New Task&quot; to create one</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              onSelect={() => onSelectTask(task.id)}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
