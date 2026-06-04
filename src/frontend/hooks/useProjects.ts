import { useState, useEffect, useMemo } from 'react';
import type { Project } from '../lib/types.ts';

type EditForm = {
    title: string;
    description: string;
    archive: boolean;
    active: boolean;
};

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<EditForm>({ title: '', description: '', archive: false, active: true });
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        window.electronApi.projects
            .getAllProjects()
            .then(setProjects)
            .catch(console.error);
    }, []);

    const selectedProject = useMemo(
        () => projects.find((p) => p.project_id === selectedProjectId) ?? null,
        [projects, selectedProjectId]
    );

    const createProject = async () => {
        if (!newTitle.trim()) return;
        const newProject = await window.electronApi.projects.createProject({
            title: newTitle.trim(),
            description: newDescription.trim(),
            active: true,
        });
        setProjects((prev) => [...prev, newProject]);
        setNewTitle('');
        setNewDescription('');
    };

    const updateProject = async () => {
        if (!selectedProjectId) return;
        await window.electronApi.projects.updateProject(selectedProjectId, editForm);
        setProjects((prev) =>
            prev.map((p) => (p.project_id === selectedProjectId ? { ...p, ...editForm } : p))
        );
        setShowEditModal(false);
    };

    const deleteProject = async () => {
        if (!selectedProjectId) return;
        await window.electronApi.projects.deleteProject(selectedProjectId);
        setProjects((prev) => prev.filter((p) => p.project_id !== selectedProjectId));
        setSelectedProjectId(null);
    };

    const openEdit = () => {
        if (!selectedProject) return;
        setEditForm({
            title: selectedProject.title,
            description: selectedProject.description,
            archive: selectedProject.archive,
            active: selectedProject.active,
        });
        setShowEditModal(true);
    };

    const closeEdit = () => setShowEditModal(false);

    return {
        projects,
        selectedProjectId,
        selectedProject,
        setSelectedProjectId,
        newTitle,
        setNewTitle,
        newDescription,
        setNewDescription,
        createProject,
        updateProject,
        deleteProject,
        editForm,
        setEditForm,
        showEditModal,
        openEdit,
        closeEdit,
    };
}