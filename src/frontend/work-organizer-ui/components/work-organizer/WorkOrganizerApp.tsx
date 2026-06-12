import { useState } from 'react'
import { ProjectsPanel } from './panels/ProjectsPanel'
import { TasksPanel } from './panels/TasksPanel'
import { TaskDetailsPanel } from './panels/TaskDetailsPanel'
import { ProjectDialog } from './dialogs/ProjectDialog'
import { TaskDialog } from './dialogs/TaskDialog'
import { DeleteConfirmDialog } from './dialogs/DeleteConfirmDialog'
import { useWorkOrganizerState } from '@/hooks/useWorkOrganizerState'

type DialogType = 'add-project' | 'edit-project' | 'add-task' | 'edit-task' | null
type DeleteType = 'project' | 'task' | null

export function WorkOrganizerApp() {
  const state = useWorkOrganizerState()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    type: DeleteType
    id: string | null
    title: string
    description: string
  }>({
    open: false,
    type: null,
    id: null,
    title: '',
    description: '',
  })

  const handleAddProject = () => {
    setEditingProjectId(null)
    setActiveDialog('add-project')
  }

  const handleEditProject = (id: string) => {
    setEditingProjectId(id)
    setActiveDialog('edit-project')
  }

  const handleDeleteProject = (id: string) => {
    const project = state.projects.find((p) => p.id === id)
    setDeleteConfirm({
      open: true,
      type: 'project',
      id,
      title: 'Delete Project',
      description: `Are you sure you want to delete "${project?.name}"? This will also delete all tasks in this project.`,
    })
  }

  const handleSaveProject = async (name: string, description: string) => {
    if (editingProjectId) {
      await state.updateProject(editingProjectId, name, description)
    } else {
      await state.addProject(name, description)
    }
    setActiveDialog(null)
  }

  const handleAddTask = () => {
    if (!state.selectedProjectId) return
    setEditingTaskId(null)
    setActiveDialog('add-task')
  }

  const handleEditTask = (id: string) => {
    setEditingTaskId(id)
    setActiveDialog('edit-task')
  }

  const handleDeleteTask = (id: string) => {
    const task = state.tasks.find((t) => t.id === id)
    setDeleteConfirm({
      open: true,
      type: 'task',
      id,
      title: 'Delete Task',
      description: `Are you sure you want to delete "${task?.title}"?`,
    })
  }

  const handleSaveTask = async (
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    tagNames: string[],
  ) => {
    if (editingTaskId) {
      const task = state.tasks.find((t) => t.id === editingTaskId)
      if (task) {
        await state.updateTask(editingTaskId, title, description, task.status, priority)
      }
    } else if (state.selectedProjectId) {
      await state.addTask(state.selectedProjectId, title, description, priority, tagNames)
    }
    setActiveDialog(null)
  }

  const handleStatusChange = async (status: 'todo' | 'in-progress' | 'done') => {
    const task = state.getSelectedTask()
    if (task && state.selectedTaskId) {
      await state.updateTask(
        state.selectedTaskId,
        task.title,
        task.description,
        status,
        task.priority,
      )
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteConfirm.type === 'project' && deleteConfirm.id) {
      await state.deleteProject(deleteConfirm.id)
    } else if (deleteConfirm.type === 'task' && deleteConfirm.id) {
      await state.deleteTask(deleteConfirm.id)
    }
    setDeleteConfirm((prev) => ({ ...prev, open: false }))
  }

  const selectedTask = state.getSelectedTask()
  const projectTasks = state.selectedProjectId
    ? state.getProjectTasks(state.selectedProjectId)
    : []

  const editingProject = editingProjectId
    ? state.projects.find((p) => p.id === editingProjectId)
    : undefined

  const editingTask = editingTaskId ? state.tasks.find((t) => t.id === editingTaskId) : undefined

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {state.error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 text-sm border-b border-destructive/20">
          {state.error}
        </div>
      )}
      {state.loading && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
          Loading projects and tasks…
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 hidden md:flex flex-col">
          <ProjectsPanel
            projects={state.projects}
            selectedProjectId={state.selectedProjectId}
            getTaskCount={(id) => state.getProjectTasks(id).length}
            onSelectProject={state.selectProject}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>

        <div className="w-72 hidden lg:flex flex-col">
          <TasksPanel
            tasks={projectTasks}
            selectedTaskId={state.selectedTaskId}
            selectedProjectId={state.selectedProjectId}
            onSelectTask={state.selectTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <TaskDetailsPanel
            task={selectedTask}
            onEditTask={() => {
              if (selectedTask) handleEditTask(selectedTask.id)
            }}
            onDeleteTask={() => {
              if (selectedTask) handleDeleteTask(selectedTask.id)
            }}
            onStatusChange={(status) => void handleStatusChange(status)}
            onAddTag={(name) =>
              state.selectedTaskId
                ? state.addTagToTask(state.selectedTaskId, name)
                : Promise.resolve()
            }
            onRemoveTag={(tagId) =>
              state.selectedTaskId
                ? state.removeTagFromTask(state.selectedTaskId, tagId)
                : Promise.resolve()
            }
          />
        </div>
      </div>

      <ProjectDialog
        open={activeDialog === 'add-project'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSave={(name, desc) => void handleSaveProject(name, desc)}
        title="Add New Project"
      />

      <ProjectDialog
        open={activeDialog === 'edit-project'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSave={(name, desc) => void handleSaveProject(name, desc)}
        project={editingProject}
        title="Edit Project"
        onAddTag={(name) =>
          editingProjectId
            ? state.addTagToProject(editingProjectId, name)
            : Promise.resolve()
        }
        onRemoveTag={(tagId) =>
          editingProjectId
            ? state.removeTagFromProject(editingProjectId, tagId)
            : Promise.resolve()
        }
      />

      <TaskDialog
        open={activeDialog === 'add-task'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSave={(title, desc, priority, tags) =>
          void handleSaveTask(title, desc, priority, tags)
        }
        title="Add New Task"
      />

      <TaskDialog
        open={activeDialog === 'edit-task'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSave={(title, desc, priority) =>
          void handleSaveTask(title, desc, priority, [])
        }
        task={editingTask}
        title="Edit Task"
        onAddTag={(name) =>
          editingTaskId ? state.addTagToTask(editingTaskId, name) : Promise.resolve()
        }
        onRemoveTag={(tagId) =>
          editingTaskId ? state.removeTagFromTask(editingTaskId, tagId) : Promise.resolve()
        }
      />

      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        onConfirm={() => void handleConfirmDelete()}
        title={deleteConfirm.title}
        description={deleteConfirm.description}
      />
    </div>
  )
}
