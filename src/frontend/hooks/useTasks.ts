import { useState, useEffect, useMemo } from 'react';
import  { emptyDraft, type Task } from '../lib/types.ts';
import type {createTaskData} from "../shared/schemas/tasks.ts";





export function useTasks(selectedProjectId: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draft, setDraft] = useState<createTaskData>(emptyDraft);

    useEffect(() => {
        window.electronApi.tasks
            .getAllTasks()
            .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
            .catch(console.error);
    }, []);


    const filteredTasks = useMemo(() => {
        if (!selectedProjectId) return tasks;
        return tasks.filter((t) => t.project_id === selectedProjectId);
    }, [tasks, selectedProjectId]);

    const createTask = async () => {
        if (!selectedProjectId) {
            alert('Select a project first.');
            return;
        }
        if (!draft.title.trim()) {
            alert('Task title is required.');
            return;
        }


        const newTask: Task = {
            task_id: crypto.randomUUID(),
            title: draft.title.trim(),
            description: draft.description.trim(),
            status: draft.status,
            created_at: new Date(),
            updated_at: null,
            project_id: selectedProjectId,
        };


        setTasks((prev) => [...prev, newTask]);
        setDraft(emptyDraft);

        await window.electronApi.tasks.createTask(
            {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status
            },
            selectedProjectId
        );
    };

    return {
        tasks,
        filteredTasks,
        draft,
        setDraft,
        createTask,
    };
}