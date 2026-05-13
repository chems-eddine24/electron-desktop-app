import type { Task } from './types'
import type { Result } from './ipc-types'

type Status = 'doing' | 'done' | 'paused'

declare global {
    interface Window {
        electronApi: {
            tasks: {
                getAll: ()                                                    => Promise<Result<Task[]>>
                create: (payload: { title: string; description: string; status?: Status }) => Promise<Result<Task>>
                update: (payload: { task_id: number; title?: string; description?: string; status?: Status }) => Promise<Result<Task>>
                delete: (id: number)                                          => Promise<Result<void>>
            }
        }
    }
}

export {}