import { useState, useEffect } from "react";
import React from "react";
import { api, TeamMember, CreateTeamMemberPayload } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { COPY } from "@/constants/copy";

interface UseTeamMembersState {
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: Error | null;
}

interface UseTeamMembersActions {
  refetch: () => Promise<void>;
  createTeamMember: (data: CreateTeamMemberPayload) => Promise<void>;
  updateTeamMember: (id: string, data: Partial<CreateTeamMemberPayload>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useTeamMembers(): UseTeamMembersState & UseTeamMembersActions {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getTeamMembers();
      setTeamMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch team members"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const refetch = async () => {
    await fetchTeamMembers();
  };

  const createTeamMember = async (data: CreateTeamMemberPayload) => {
    try {
      setIsCreating(true);
      const newTeamMember = await api.createTeamMember(data);
      setTeamMembers(prev => [newTeamMember, ...prev]);
      
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.created,
        description: `"${data.name}" تم إضافته بنجاح.`,
      });
    } catch (err) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.createFailed,
        description: COPY.COMMON.MESSAGES.checkConnection,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateTeamMember = async (id: string, data: Partial<CreateTeamMemberPayload>) => {
    try {
      setIsUpdating(true);
      const updatedTeamMember = await api.updateTeamMember(id, data);
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? updatedTeamMember : member
        )
      );
      
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.updated,
        description: `"${data.name || "العضو"}" تم تحديثه بنجاح.`,
      });
    } catch (err) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.updateFailed,
        description: COPY.COMMON.MESSAGES.checkConnection,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const restoreTeamMember = async (member: TeamMember) => {
    try {
      const { id, createdAt, updatedAt, ...memberData } = member;
      const restoredMember = await api.createTeamMember(memberData);
      setTeamMembers(prev => [restoredMember, ...prev]);
      
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.restored,
        description: `"${member.name}" تم استعادته بنجاح.`,
      });
    } catch (err) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.restoreFailed,
        description: "تعذر استعادة عضو الفريق. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      setIsDeleting(true);
      const deletedMember = teamMembers.find(m => m.id === id);
      
      await api.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.deleted,
        description: COPY.UNDO.DESCRIPTIONS.teamMember(deletedMember?.name || "العضو"),
        action: deletedMember ? React.createElement(
          ToastAction,
          {
            altText: COPY.UNDO.ACTIONS.teamMemberRestore,
            onClick: () => restoreTeamMember(deletedMember),
          },
          COPY.UNDO.ACTIONS.undoButton
        ) : undefined,
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.deleteFailed,
        description: COPY.COMMON.MESSAGES.tryAgain,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    teamMembers,
    isLoading,
    error,
    refetch,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    isCreating,
    isUpdating,
    isDeleting,
  };
}