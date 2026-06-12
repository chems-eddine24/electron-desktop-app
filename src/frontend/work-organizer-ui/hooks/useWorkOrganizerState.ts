import { useState, useCallback, useEffect } from 'react'
import { mapDbProject, mapDbTask, mapDbTags, toDbStatus } from '@/lib/electron-mappers'
import { unwrapResult } from '@/lib/ipc'

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  tags: Tag[]
  createdAt: Date
  dueDate?: Date
}

export interface Project {
  id: string
  name: string
  description: string
  tags: Tag[]
  createdAt: Date
  taskCount?: number
}

interface UseWorkOrganizerStateReturn {
  projects: Project[]
  tasks: Task[]
  allTags: Tag[]
  selectedProjectId: string | null
  selectedTaskId: string | null
  loading: boolean
  error: string | null

  addProject: (name: string, description: string) => Promise<void>
  updateProject: (id: string, name: string, description: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  selectProject: (id: string | null) => void
  addTagToProject: (projectId: string, tagName: string) => Promise<void>
  removeTagFromProject: (projectId: string, tagId: string) => Promise<void>

  addTask: (
    projectId: string,
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    tagNames?: string[],
  ) => Promise<void>
  updateTask: (
    id: string,
    title: string,
    description: string,
    status: 'todo' | 'in-progress' | 'done',
    priority: 'low' | 'medium' | 'high',
  ) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
  addTagToTask: (taskId: string, tagName: string) => Promise<void>
  removeTagFromTask: (taskId: string, tagId: string) => Promise<void>

  getSelectedProject: () => Project | undefined
  getSelectedTask: () => Task | undefined
  getProjectTasks: (projectId: string) => Task[]
  refresh: () => Promise<void>
}

function hasElectronApi(): boolean {
  return typeof window !== 'undefined' && !!window.electronApi
}

async function loadProjectTags(projectId: string): Promise<Tag[]> {
  const result = await window.electronApi.tags.getProjectTags(projectId)
  return mapDbTags(unwrapResult(result))
}

async function loadTaskTags(taskId: string): Promise<Tag[]> {
  const result = await window.electronApi.tags.getTaskTags(taskId)
  return mapDbTags(unwrapResult(result))
}

export function useWorkOrganizerState(): UseWorkOrganizerStateReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!hasElectronApi()) {
      setLoading(false)
      setError('Electron API is not available. Run the app with npm run electron-dev.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [projectRows, taskResult, allTagsResult] = await Promise.all([
        window.electronApi.projects.getAllProjects(),
        window.electronApi.tasks.getAllTasks(),
        window.electronApi.tags.getAllTags(),
      ])
      const taskRows = unwrapResult(taskResult)
      setAllTags(mapDbTags(unwrapResult(allTagsResult)))

      const tasksWithTags = await Promise.all(
        taskRows.map(async (row) => {
          const tags = await loadTaskTags(row.task_id)
          return mapDbTask(row, tags)
        }),
      )

      const projectsWithTags = await Promise.all(
        projectRows.map(async (row) => {
          const tags = await loadProjectTags(row.project_id)
          return mapDbProject(
            row,
            tasksWithTags.filter((t) => t.projectId === row.project_id).length,
            tags,
          )
        }),
      )

      setProjects(projectsWithTags)
      setTasks(tasksWithTags)
      setSelectedProjectId((current) => {
        if (current && projectsWithTags.some((p) => p.id === current)) return current
        return projectsWithTags[0]?.id ?? null
      })
      setSelectedTaskId((current) => {
        if (current && tasksWithTags.some((t) => t.id === current)) return current
        return null
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data'
      setError(message)
      console.error('[useWorkOrganizerState]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addProject = useCallback(
    async (name: string, description: string) => {
      if (!hasElectronApi()) return
      const row = await window.electronApi.projects.createProject({
        title: name.trim(),
        description: description.trim(),
        active: true,
      })
      await refresh()
      setSelectedProjectId(row.project_id)
    },
    [refresh],
  )

  const updateProject = useCallback(
    async (id: string, name: string, description: string) => {
      if (!hasElectronApi()) return
      await window.electronApi.projects.updateProject(id, {
        title: name.trim(),
        description: description.trim(),
      })
      await refresh()
    },
    [refresh],
  )

  const deleteProject = useCallback(
    async (id: string) => {
      if (!hasElectronApi()) return
      await window.electronApi.projects.deleteProject(id)
      if (selectedProjectId === id) {
        setSelectedProjectId(null)
        setSelectedTaskId(null)
      }
      await refresh()
    },
    [refresh, selectedProjectId],
  )

  const selectProject = useCallback((id: string | null) => {
    setSelectedProjectId(id)
    setSelectedTaskId(null)
  }, [])

  const addTagToProject = useCallback(
    async (projectId: string, tagName: string) => {
      if (!hasElectronApi()) return
      const tag = unwrapResult(
        await window.electronApi.tags.addTagToProject(projectId, {
          tag_name: tagName.trim(),
        }),
      )
      const uiTag = mapDbTags([tag])[0]
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId && !p.tags.some((t) => t.id === uiTag.id)
            ? { ...p, tags: [...p.tags, uiTag].sort((a, b) => a.name.localeCompare(b.name)) }
            : p,
        ),
      )
      setAllTags((prev) =>
        prev.some((t) => t.id === uiTag.id)
          ? prev
          : [...prev, uiTag].sort((a, b) => a.name.localeCompare(b.name)),
      )
    },
    [],
  )

  const removeTagFromProject = useCallback(async (projectId: string, tagId: string) => {
    if (!hasElectronApi()) return
    unwrapResult(await window.electronApi.tags.removeTagFromProject(projectId, tagId))
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tags: p.tags.filter((t) => t.id !== tagId) } : p,
      ),
    )
  }, [])

  const addTask = useCallback(
    async (
      projectId: string,
      title: string,
      description: string,
      priority: 'low' | 'medium' | 'high',
      tagNames: string[] = [],
    ) => {
      if (!hasElectronApi()) return
      const result = await window.electronApi.tasks.createTask(
        {
          title: title.trim(),
          description: description.trim(),
          status: 'doing',
        },
        projectId,
      )
      const created = unwrapResult(result)

      const tags: Tag[] = []
      for (const name of tagNames) {
        const trimmed = name.trim()
        if (!trimmed) continue
        const tag = unwrapResult(
          await window.electronApi.tags.addTagToTask(created.task_id, { tag_name: trimmed }),
        )
        tags.push(mapDbTags([tag])[0])
      }

      setSelectedTaskId(created.task_id)
      await refresh()
    },
    [refresh],
  )

  const updateTask = useCallback(
    async (
      id: string,
      title: string,
      description: string,
      status: 'todo' | 'in-progress' | 'done',
      priority: 'low' | 'medium' | 'high',
    ) => {
      if (!hasElectronApi()) return
      const result = await window.electronApi.tasks.updateTask({
        task_id: id,
        title: title.trim(),
        description: description.trim(),
        status: toDbStatus(status),
      })
      unwrapResult(result)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, title, description, status, priority } : t,
        ),
      )
    },
    [],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      if (!hasElectronApi()) return
      unwrapResult(await window.electronApi.tasks.deleteTask(id))
      if (selectedTaskId === id) setSelectedTaskId(null)
      await refresh()
    },
    [refresh, selectedTaskId],
  )

  const addTagToTask = useCallback(async (taskId: string, tagName: string) => {
    if (!hasElectronApi()) return
    const tag = unwrapResult(
      await window.electronApi.tags.addTagToTask(taskId, { tag_name: tagName.trim() }),
    )
    const uiTag = mapDbTags([tag])[0]
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId && !t.tags.some((x) => x.id === uiTag.id)
          ? { ...t, tags: [...t.tags, uiTag].sort((a, b) => a.name.localeCompare(b.name)) }
          : t,
      ),
    )
    setAllTags((prev) =>
      prev.some((t) => t.id === uiTag.id)
        ? prev
        : [...prev, uiTag].sort((a, b) => a.name.localeCompare(b.name)),
    )
  }, [])

  const removeTagFromTask = useCallback(async (taskId: string, tagId: string) => {
    if (!hasElectronApi()) return
    unwrapResult(await window.electronApi.tags.removeTagFromTask(taskId, tagId))
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, tags: t.tags.filter((x) => x.id !== tagId) } : t,
      ),
    )
  }, [])

  const selectTask = useCallback((id: string | null) => {
    setSelectedTaskId(id)
  }, [])

  const getSelectedProject = useCallback(() => {
    return projects.find((p) => p.id === selectedProjectId)
  }, [projects, selectedProjectId])

  const getSelectedTask = useCallback(() => {
    return tasks.find((t) => t.id === selectedTaskId)
  }, [tasks, selectedTaskId])

  const getProjectTasks = useCallback(
    (projectId: string) => {
      return tasks.filter((t) => t.projectId === projectId)
    },
    [tasks],
  )

  return {
    projects,
    tasks,
    allTags,
    selectedProjectId,
    selectedTaskId,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    addTagToProject,
    removeTagFromProject,
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    addTagToTask,
    removeTagFromTask,
    getSelectedProject,
    getSelectedTask,
    getProjectTasks,
    refresh,
  }
}
