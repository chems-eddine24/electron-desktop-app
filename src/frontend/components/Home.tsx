import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import '../App.css';

export default function Home() {
    const [showNewModal, setShowNewModal] = useState(false);
    const projects = useProjects();
    const tasks = useTasks(projects.selectedProjectId);

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="panelHeader">
                    <div>
                        <h1>Organizer</h1>
                        <p>Projects and tasks</p>
                    </div>
                    <button className="primaryBtn" onClick={() => setShowNewModal(true)}>
                        + Project
                    </button>
                </div>

                <div className="section">
                    <div className="sectionTitle">Projects</div>
                    {projects.projects.length === 0 ? (
                        <div className="emptyBox">
                            <strong>No projects yet</strong>
                            <span>Create your first project to start organizing work.</span>
                        </div>
                    ) : (
                        <div className="list">
                            {projects.projects.map((project) => (
                                <button
                                    key={project.project_id}
                                    className={`listItem ${projects.selectedProjectId === project.project_id ? 'active' : ''}`}
                                    onClick={() => projects.setSelectedProjectId(project.project_id)}
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
                        <h2>{projects.selectedProject ? projects.selectedProject.title : 'All tasks'}</h2>
                        <p>
                            {projects.selectedProject
                                ? projects.selectedProject.description || 'No description'
                                : 'Select a project to view tasks'}
                        </p>
                    </div>

                    {projects.selectedProject && (
                        <>
                            <div className="actions">
                                <button className="secondaryBtn" onClick={projects.openEdit}>Edit project</button>
                            </div>
                            <div>
                                <button className="secondaryBtn" onClick={projects.deleteProject}>Delete project</button>
                            </div>
                        </>

                    )}
                </header>

                <section className="contentGrid">
                    {/* Task list */}
                    <div className="card">
                        <div className="sectionTitle">Tasks</div>
                        {tasks.filteredTasks.length === 0 ? (
                            <div className="emptyBox tall">
                                <strong>No tasks yet</strong>
                                <span>Create a task in the editor panel.</span>
                            </div>
                        ) : (
                            <div className="list">
                                {tasks.filteredTasks.map((task) => (
                                    <div key={task.task_id} className="taskItem">
                                        <div className="taskTop">
                                            <div>
                                                <div className="listItemTitle">{task.title}</div>
                                                <div className="listItemSub">{task.description}</div>
                                            </div>
                                            <span className={`status status-${task.status}`}>{task.status}</span>
                                        </div>
                                        <div className="tagRow">
                                            <span>Tags</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Task form */}
                    <div className="card">
                        <div className="sectionTitle">New task</div>
                        <div className="form">
                            <label>
                                <span>Title</span>
                                <input
                                    value={tasks.draft.title}
                                    onChange={(e) => tasks.setDraft((d) => ({ ...d, title: e.target.value }))}
                                    placeholder="Task title"
                                />
                            </label>
                            <label>
                                <span>Description</span>
                                <textarea
                                    value={tasks.draft.description}
                                    onChange={(e) => tasks.setDraft((d) => ({ ...d, description: e.target.value }))}
                                    placeholder="Task description"
                                    rows={5}
                                />
                            </label>
                            <label>
                                <span>Status</span>
                                <select
                                    value={tasks.draft.status}
                                    onChange={(e) => tasks.setDraft((d) => ({ ...d, status: e.target.value as 'doing' | 'done' | 'paused' }))}
                                >
                                    <option value="doing">Doing</option>
                                    <option value="done">Done</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </label>
                            <label>
                                <span>Tags</span>
                            </label>
                            <button className="primaryBtn full" onClick={tasks.createTask}>
                                Save task
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* New project modal */}
            {showNewModal && (
                <div className="modalOverlay">
                    <div className="modalCard">
                        <h2>New project</h2>
                        <input
                            autoFocus
                            value={projects.newTitle}
                            onChange={(e) => projects.setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && projects.createProject().then(() => setShowNewModal(false))}
                            placeholder="Project name"
                        />
                        <input
                            value={projects.newDescription}
                            onChange={(e) => projects.setNewDescription(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && projects.createProject().then(() => setShowNewModal(false))}
                            placeholder="Project description"
                        />
                        <div className="modalActions">
                            <button className="primaryBtn" onClick={() => projects.createProject().then(() => setShowNewModal(false))}>
                                Save
                            </button>
                            <button className="secondaryBtn" onClick={() => setShowNewModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit project modal */}
            {projects.showEditModal && projects.selectedProject && (
                <div className="modalOverlay">
                    <div className="modalCard">
                        <h2>Edit project</h2>
                        <input
                            autoFocus
                            value={projects.editForm.title}
                            onChange={(e) => projects.setEditForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Project name"
                        />
                        <input
                            value={projects.editForm.description}
                            onChange={(e) => projects.setEditForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Project description"
                        />
                        <div className="modalActions">
                            <button className="primaryBtn" onClick={projects.updateProject}>Save</button>
                            <button className="secondaryBtn" onClick={projects.closeEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}