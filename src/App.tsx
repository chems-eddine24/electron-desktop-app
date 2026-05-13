import { useState } from 'react'
import { TaskBar } from './components/TaskBar'
import type { Task } from '../src/db/schema/tasks.ts'

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([])

    return (
        <div>
            <TaskBar onTaskAdded={task => setTasks(prev => [task, ...prev])} />
            <ul>
                {tasks.map(task => (
                    <li key={task.task_id}>{task.title} — {task.status}</li>
                ))}
            </ul>
        </div>
    )
}