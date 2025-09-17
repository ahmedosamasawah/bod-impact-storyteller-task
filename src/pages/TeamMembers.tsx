import { TeamMembersTable } from "@/components/consulting/TeamMembersTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Plus,
  Download,
  Users as UsersIcon,
  UserCheck,
  MapPin,
  Building,
} from "lucide-react";
import { TeamMember } from "@/services/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TeamMemberForm } from "@/components/consulting/TeamMemberForm";
import { TeamMemberViewPanel } from "@/components/view/TeamMemberViewPanel";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { COPY } from "@/constants/copy";

const TeamMembers = () => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [viewingUser, setViewingUser] = useState<TeamMember | null>(null);
  
  const {
    teamMembers: users,
    isLoading,
    error,
    refetch,
    deleteTeamMember,
    isDeleting,
  } = useTeamMembers();

  const handleCreate = () => {
    setEditingUser(null);
    setShowCreateForm(true);
  };

  const handleEdit = (user: TeamMember) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTeamMember(id);
  };

  const handleView = (user: TeamMember) => {
    setViewingUser(user);
  };

  const handleExport = () => {
    if (!users || users.length === 0) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.noDataToExport,
        description: "لا توجد بيانات فريق متاحة للتصدير.",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = [
        COPY.TEAM_MEMBERS.CSV_HEADERS.id,
        COPY.TEAM_MEMBERS.CSV_HEADERS.name,
        COPY.TEAM_MEMBERS.CSV_HEADERS.username,
        COPY.TEAM_MEMBERS.CSV_HEADERS.email,
        COPY.TEAM_MEMBERS.CSV_HEADERS.phone,
        COPY.TEAM_MEMBERS.CSV_HEADERS.company,
        COPY.TEAM_MEMBERS.CSV_HEADERS.city,
      ];
      const csvContent = [
        headers.join(","),
        ...users.map((user) =>
          [
            user.id,
            `"${user.name.replace(/"/g, '""')}"`,
            `"${user.username.replace(/"/g, '""')}"`,
            `"${user.email.replace(/"/g, '""')}"`,
            `"${user.phone.replace(/"/g, '""')}"`,
            `"${user.company.name.replace(/"/g, '""')}"`,
            `"${user.address.city.replace(/"/g, '""')}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `team-members-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: COPY.COMMON.STATUS.success,
        description: `تم تصدير ${users.length} عضو فريق إلى ملف CSV`,
      });
    } catch (error) {
      toast({
        title: COPY.TEAM_MEMBERS.TOASTS.exportFailed,
        description:
          "غير قادر على تصدير بيانات الفريق. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingUser(null);
    refetch();
  };

  if (error) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="card-elevated max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">خطأ في الاتصال</CardTitle>
              <CardDescription>
                غير قادر على جلب بيانات أعضاء الفريق. يرجى فحص اتصالك والمحاولة
                مرة أخرى.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => refetch()}
                className="w-full"
                variant="outline"
              >
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl bod-heading flex items-center gap-2">
              <UsersIcon className="size-8 text-primary" />
              {COPY.TEAM_MEMBERS.ACTIONS.manage}
            </h1>
            <p className="bod-subtitle text-sm sm:text-base max-w-2xl">
              {COPY.TEAM_MEMBERS.DESCRIPTIONS.overview}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              className="btn-bod-secondary flex-1 sm:flex-none order-2 sm:order-1 py-2"
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="size-4 mr-2" />
              {COPY.COMMON.ACTIONS.export}
            </Button>
            <Button
              className="btn-bod-primary flex-1 sm:flex-none order-1 sm:order-2 py-2"
              size="sm"
              onClick={handleCreate}
            >
              <Plus className="size-4 mr-2" />
              {COPY.TEAM_MEMBERS.ACTIONS.createNew}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UsersIcon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {COPY.TEAM_MEMBERS.ENTITY.plural}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <UserCheck className="size-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">نشط</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Building className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users ? new Set(users.map((u) => u.company.name)).size : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">الشركات</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <MapPin className="size-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users ? new Set(users.map((u) => u.address.city)).size : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">المواقع</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <TeamMembersTable
          data={users}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isDeleting={isDeleting}
        />

        <TeamMemberForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          user={editingUser}
          onSuccess={handleFormSuccess}
        />

        {viewingUser && (
          <TeamMemberViewPanel
            open={!!viewingUser}
            onOpenChange={(open) => !open && setViewingUser(null)}
            member={viewingUser}
          />
        )}
      </div>
    </>
  );
};

export default TeamMembers;
