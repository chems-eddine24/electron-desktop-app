

import { useState } from 'react'
import type { Task } from '../../src/db/schema/tasks.ts'

export function TaskBar({ onTaskAdded }: { onTaskAdded: (task: Task) => void }) {
    const [title,       setTitle]       = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [error,       setError]       = useState<string | null>(null)
    const [loading,     setLoading]     = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const result = await window.electronApi.tasks.create({ title, description })

        setLoading(false)

        if (!result.ok) {
            setError(result.error)
            return
        }

        setTitle('')
        setDescription('')
        setStatus('')
        onTaskAdded(result.data)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                value={status}
                onChange={e => setStatus(e.target.value)}
                placeholder="Status"
                />
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}