import { ProjectsTable } from "@/components/consulting/ProjectsTable";
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
  FileText,
  Calendar,
  Users,
  Target,
} from "lucide-react";
import { Project } from "@/services/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProjectForm } from "@/components/consulting/ProjectForm";
import { ProjectViewPanel } from "@/components/view/ProjectViewPanel";
import { useProjects } from "@/hooks/useProjects";
import { COPY } from "@/constants/copy";

const Projects = () => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  const {
    projects,
    isLoading,
    error,
    refetch,
    deleteProject,
    isDeleting,
  } = useProjects();

  const handleCreate = () => {
    setEditingProject(null);
    setShowCreateForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProject(id);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
  };

  const handleExport = () => {
    if (projects.length === 0) {
      toast({
        title: COPY.PROJECTS.TOASTS.noDataToExport,
        description: "لا توجد مشاريع متاحة للتصدير.",
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = [
        COPY.PROJECTS.CSV_HEADERS.id,
        COPY.PROJECTS.CSV_HEADERS.title,
        COPY.PROJECTS.CSV_HEADERS.description,
        COPY.PROJECTS.CSV_HEADERS.sector,
        COPY.PROJECTS.CSV_HEADERS.status,
        COPY.PROJECTS.CSV_HEADERS.budget,
        COPY.PROJECTS.CSV_HEADERS.client,
      ];
      const csvContent = [
        headers.join(","),
        ...projects.map((project) =>
          [
            project.id,
            `"${project.title.replace(/"/g, '""')}"`,
            `"${project.body.replace(/"/g, '""').substring(0, 100)}..."`,
            `"${project.sector}"`,
            `"${project.status}"`,
            project.budget,
            `"${project.clientName}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `projects-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: COPY.COMMON.STATUS.success,
        description: `تم تصدير ${projects.length} مشروع إلى ملف CSV`,
      });
    } catch (error) {
      toast({
        title: COPY.PROJECTS.TOASTS.exportFailed,
        description: "غير قادر على تصدير المشاريع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingProject(null);
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
                غير قادر على جلب بيانات المشاريع. يرجى فحص اتصالك والمحاولة مرة
                أخرى.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => refetch()}
                className="w-full"
                variant="outline"
              >
                أعد الاتصال
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
              <FileText className="size-8 text-primary" />
              {COPY.PROJECTS.ENTITY.active}
            </h1>
            <p className="bod-subtitle text-sm sm:text-base max-w-2xl">
              {COPY.PROJECTS.DESCRIPTIONS.overview}
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
              {COPY.PROJECTS.ACTIONS.createNew}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {COPY.PROJECTS.ENTITY.plural}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Target className="size-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-muted-foreground">منجز</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Users className="size-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">أعضاء الفريق</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ProjectsTable
          data={projects}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isDeleting={isDeleting}
        />

        <ProjectForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          project={editingProject}
          onSuccess={handleFormSuccess}
        />

        {viewingProject && (
          <ProjectViewPanel
            open={!!viewingProject}
            onOpenChange={(open) => !open && setViewingProject(null)}
            project={viewingProject}
          />
        )}
      </div>
    </>
  );
};

export default Projects;
