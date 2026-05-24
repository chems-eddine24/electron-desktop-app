import React, { useMemo, useState,useEffect } from 'react';
import '../App.css';


type Project = {
    project_id: number;
    title: string;
    description: string;
    created_at: string;
    archive: boolean;
    active: boolean;
};

type TaskStatus = 'doing' | 'done' | 'paused'

type TaskTag = {
    id: string;
    name: string;
};

type Task = {
    title: string;
    description: string;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    tags: TaskTag[];
    project_id?: number;
};

type TaskDraft = {
    title: string;
    description: string;
    status: TaskStatus;
    tagsText: string;
};

const emptyDraft: TaskDraft = {
    title: '',
    description: '',
    status: 'doing',
    tagsText: '',
};

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditshowModal] = useState(false);
    const [formData, setFormData] = useState({ archive: false , active: true, title: '', description: '' });
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await window.electronApi.projects.getAllProjects();
                setProjects(res);           // adjust based on your API shape
            } catch (err) {
                console.error(err);
            }
        };
        loadProjects()
    }, [])
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await window.electronApi.tasks.getAllTasks();
                setTasks(Array.isArray(res) ? res : []); // ✅ guard against non-array
            } catch (err) {
                console.error(err);
            }
        };
        loadTasks();
    }, []);
    const selectedProject = useMemo(
        () => projects.find((p) => p.project_id === selectedProjectId),
        [projects, selectedProjectId]
    );

    const filteredTasks = useMemo(() => {
        if (!Array.isArray(tasks)) return [];
        if (!selectedProjectId) return tasks;
        return tasks.filter((task) => task.project_id === selectedProjectId);
    }, [tasks, selectedProjectId]);

    const handleCreateProject = () => {
        setShowModal(true); // open modal instead of prompt()
    };
    const handleConfirm = async () => {
        if (!projectName.trim()) return;
        const newProject = await window.electronApi.projects.createProject({title: projectName, active: true, description: projectDescription})
        setProjects(prev => [...prev, newProject]);
        setProjectName('')
        setProjectDescription('')
        setShowModal(false);
    };

    const handleOpenModal = () => {
        if (!selectedProject) return;
        setFormData({ archive: selectedProject.archive ,active: selectedProject.active, title: selectedProject.title, description: selectedProject.description });
        setEditshowModal(true);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const submit = async () => {
        if (!selectedProject) return;
        try{
            await window.electronApi.projects.updateProject(Number(selectedProjectId), formData)
            setProjects(prev =>
                prev.map(p =>
                    p.project_id === selectedProject.project_id
                        ? { ...p, ...formData }
                        : p
                )
            );
            setEditshowModal(false);
        }catch (err) {
            console.error(err);
        }
    }

    const handleCreateTask = async () => {
        if (!selectedProjectId) {
            alert('Select a project first.');
            return;
        }
        if (!draft.title.trim()) {
            alert('Task title is required.');
            return;
        }

        const tags = draft.tagsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .map((name) => ({
                id: crypto.randomUUID(),
                name,
            }));

        const now = new Date().toISOString();

        const newTask: Task = {
            title: draft.title.trim(),
            description: draft.description.trim(),
            status: draft.status,
            created_at: now,
            updated_at: '',
            tags,
            project_id: selectedProjectId,
        };

        setTasks((prev) => [...(Array.isArray(prev) ? prev : []), newTask]); // ✅
        setDraft(emptyDraft);
        await window.electronApi.tasks.createTask({
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
        })
    };



    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="panelHeader">
                    <div>
                        <h1>Organizer</h1>
                        <p>Projects and tasks</p>
                    </div>
                    <button className="primaryBtn" onClick={handleCreateProject}>
                        + Project
                    </button>
                </div>

                <div className="section">
                    <div className="sectionTitle">Projects</div>
                    {projects.length === 0 ? (
                        <div className="emptyBox">
                            <strong>No projects yet</strong>
                            <span>Create your first project to start organizing work.</span>
                        </div>
                    ) : (
                        <div className="list">
                            {projects.map((project) => (
                                <button
                                    key={project.project_id}
                                    className={`listItem ${selectedProjectId === project.project_id ? 'active' : ''}`}
                                    onClick={() => setSelectedProjectId(project.project_id)}
                                >
                                    <div className="listItemTitle">{project.title}</div>
                                    <div className="listItemSub">{project.description}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div>
                        <h2>{selectedProject ? selectedProject.title : 'All tasks'}</h2>
                        <p>
                            {selectedProject
                                ? selectedProject.description || 'No description'
                                : 'Select a project to view tasks'}
                        </p>
                    </div>

                    <div className="actions">
                        <button onClick={handleOpenModal}>Edit Project</button>
                        {editshowModal && (
                            <div className="modal">
                                <input name="title" value={formData.title} onChange={handleChange} />
                                <input name="description" value={formData.description} onChange={handleChange} />
                                <button onClick={submit}>Save</button>
                                <button onClick={() => setEditshowModal(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                </header>

                <section className="contentGrid">
                    <div className="card">
                        <div className="sectionTitle">Tasks</div>
                        {filteredTasks.length === 0 ? (
                            <div className="emptyBox tall">
                                <strong>No tasks yet</strong>
                                <span>Create a task in the editor panel.</span>
                            </div>
                        ) : (
                            <div className="list">
                                {filteredTasks.map((task) => (
                                    <div  className="taskItem">
                                        <div className="taskTop">
                                            <div>
                                                <div className="listItemTitle">{task.title}</div>
                                                <div className="listItemSub">{task.description}</div>
                                            </div>
                                            <span className={`status status-${task.status}`}>{task.status}</span>
                                        </div>
                                        <div className="tagRow">
                                            {task.tags.map((tag) => (
                                                <span key={tag.id} className="tag">
                          {tag.name}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="sectionTitle">New task</div>

                        <div className="form">
                            <label>
                                <span>Title</span>
                                <input
                                    value={draft.title}
                                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                                    placeholder="Task title"
                                />
                            </label>

                            <label>
                                <span>Description</span>
                                <textarea
                                    value={draft.description}
                                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                    placeholder="Task description"
                                    rows={5}
                                />
                            </label>

                            <label>
                                <span>Status</span>
                                <select
                                    value={draft.status}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, status: e.target.value as TaskStatus }))
                                    }
                                >
                                    <option value="doing">Doing</option>
                                    <option value="done">Done</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </label>

                            <label>
                                <span>Tags</span>
                                <input
                                    value={draft.tagsText}
                                    onChange={(e) => setDraft((d) => ({ ...d, tagsText: e.target.value }))}
                                    placeholder="comma,separated,tags"
                                />
                            </label>

                            <button className="primaryBtn full" onClick={handleCreateTask}>
                                Save task
                            </button>
                        </div>

                    </div>
                </section>
            </main>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">New Project</h2>
                        <input
                            autoFocus
                            type="text"
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleConfirm()}
                            placeholder="Project name"
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            autoFocus
                            type="text"
                            value={projectDescription}
                            onChange={e => setProjectDescription(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleConfirm()}
                            placeholder="Project description"
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 pe-px-10 ma py-2 text-sm rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}