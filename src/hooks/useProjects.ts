import { useState, useEffect } from "react";
import React from "react";
import { api, Project, CreateProjectPayload } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { COPY } from "@/constants/copy";

interface UseProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
}

interface UseProjectsActions {
  refetch: () => Promise<void>;
  createProject: (data: CreateProjectPayload) => Promise<void>;
  updateProject: (id: string, data: Partial<CreateProjectPayload>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useProjects(): UseProjectsState & UseProjectsActions {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch projects"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const refetch = async () => {
    await fetchProjects();
  };

  const createProject = async (data: CreateProjectPayload) => {
    try {
      setIsCreating(true);
      const newProject = await api.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: COPY.PROJECTS.TOASTS.created,
        description: `"${data.title}" تم إنشاؤه بنجاح وحُفظ.`,
      });
    } catch (err) {
      toast({
        title: COPY.PROJECTS.TOASTS.createFailed,
        description: COPY.COMMON.MESSAGES.checkConnection,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProject = async (id: string, data: Partial<CreateProjectPayload>) => {
    try {
      setIsUpdating(true);
      const updatedProject = await api.updateProject(id, data);
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );
      
      toast({
        title: COPY.PROJECTS.TOASTS.updated,
        description: `"${data.title || "المشروع"}" تم تحديثه بنجاح وحفظه.`,
      });
    } catch (err) {
      toast({
        title: COPY.PROJECTS.TOASTS.updateFailed,
        description: COPY.COMMON.MESSAGES.checkConnection,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const restoreProject = async (project: Project) => {
    try {
      const { id, createdAt, updatedAt, ...projectData } = project;
      const restoredProject = await api.createProject(projectData);
      setProjects(prev => [restoredProject, ...prev]);
      
      toast({
        title: COPY.PROJECTS.TOASTS.restored,
        description: `"${project.title}" تم استعادته بنجاح.`,
      });
    } catch (err) {
      toast({
        title: COPY.PROJECTS.TOASTS.restoreFailed,
        description: "تعذر استعادة المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setIsDeleting(true);
      const deletedProject = projects.find(p => p.id === id);
      
      await api.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      
      toast({
        title: COPY.PROJECTS.TOASTS.deleted,
        description: COPY.UNDO.DESCRIPTIONS.project(deletedProject?.title || "المشروع"),
        action: deletedProject ? React.createElement(
          ToastAction,
          {
            altText: COPY.UNDO.ACTIONS.projectRestore,
            onClick: () => restoreProject(deletedProject),
          },
          COPY.UNDO.ACTIONS.undoButton
        ) : undefined,
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: COPY.PROJECTS.TOASTS.deleteFailed,
        description: COPY.COMMON.MESSAGES.tryAgain,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
  };
}