import { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Zap,
  Plus,
  Download,
} from "lucide-react";
import { ImpactMetricsCard as MetricsCard } from "@/components/impact/ImpactMetricsCard";
import { ImpactChart } from "@/components/impact/ImpactChart";
import { ProjectsTable } from "@/components/consulting/ProjectsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMetrics, mockChartData, Project } from "@/services/api";
import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "@/components/consulting/ProjectForm";
import { ProjectViewPanel } from "@/components/view/ProjectViewPanel";
import { COPY } from "@/constants/copy";

const Index = () => {
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
                غير قادر على جلب البيانات من الخادم.
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/bod-logo.png"
              alt="BOD Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl bod-heading">
              {COPY.METRICS.TITLES.overview}
            </h1>
          </div>
          <p className="bod-subtitle text-sm sm:text-base max-w-2xl">
            {COPY.METRICS.DESCRIPTIONS.overview}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            className="btn-bod-primary flex-1 sm:flex-none"
            size="sm"
            onClick={handleCreate}
          >
            <Plus className="size-4 mr-2" />
            {COPY.PROJECTS.ACTIONS.createNew}
          </Button>
        </div>
      </div>

      <div className="bod-grid-cards">
        <MetricsCard
          title={COPY.METRICS.TITLES.impact}
          value={mockMetrics.totalImpactScore}
          icon={Target}
          variant="success"
          change={{ value: 15.3, type: "increase" }}
          description={COPY.METRICS.DESCRIPTIONS.impact}
        />
        <MetricsCard
          title={COPY.METRICS.TITLES.projectsCompleted}
          value={mockMetrics.projectsCompleted}
          icon={TrendingUp}
          change={{ value: 22.7, type: "increase" }}
          description={COPY.METRICS.DESCRIPTIONS.projectsCompleted}
        />
        <MetricsCard
          title={COPY.METRICS.TITLES.clientsServed}
          value={mockMetrics.clientsServed}
          icon={Users}
          variant="success"
          change={{ value: 18.5, type: "increase" }}
          description={COPY.METRICS.DESCRIPTIONS.clientsServed}
        />
        <MetricsCard
          title={COPY.METRICS.TITLES.consultingHours}
          value={`${(mockMetrics.consultingHours / 1000).toFixed(1)}K`}
          icon={DollarSign}
          variant="warning"
          change={{ value: 28.4, type: "increase" }}
          description={COPY.METRICS.DESCRIPTIONS.consultingHours}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MetricsCard
          title="خطط استراتيجية مُسلمة"
          value={mockMetrics.strategicPlansDelivered}
          icon={Activity}
          change={{ value: 31.2, type: "increase" }}
          description="خطط استراتيجية شاملة وقابلة للتنفيذ"
        />
        <MetricsCard
          title="تقارير بحثية منشورة"
          value={mockMetrics.researchReportsPublished}
          icon={Zap}
          variant="success"
          change={{ value: 42.1, type: "increase" }}
          description="تقارير بحثية عالية الجودة مع رؤى عميقة"
        />
      </div>

      <ImpactChart
        data={mockChartData}
        title="أداء الخدمات الاستشارية لولادة حلم"
        description="تطور مؤشرات جودة وأثر مشاريعنا الاستشارية والبحثية"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {COPY.PROJECTS.DESCRIPTIONS.dashboard}
            </h2>
            <p className="text-muted-foreground">
              {COPY.PROJECTS.DESCRIPTIONS.management}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            {COPY.COMMON.ACTIONS.export}
          </Button>
        </div>

        <ProjectsTable
          data={projects}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isDeleting={isDeleting}
        />
      </div>

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

      <Card className="card-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text">
            ولادة حلم - الاستشارة والبحوث
          </CardTitle>
          <CardDescription>
            مرحباً بك في منصة ولادة حلم للاستشارة والبحوث. نحول البيانات المعقدة
            إلى رؤى استراتيجية قابلة للتنفيذ تخدم عملائنا في المملكة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">خدماتنا الاستشارية:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• التخطيط الاستراتيجي والتنفيذي</li>
                <li>• بحوث متخصصة ودراسات سوق</li>
                <li>• مراقبة وتقييم الأداء</li>
                <li>• التحول المؤسسي وبناء القدرات</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">مجالات الخبرة:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• إدارة المشاريع والعمليات</li>
                <li>• استشارات التحول الرقمي</li>
                <li>• بحوث السوق والجدوى الاقتصادية</li>
                <li>• الابتكار وريادة الأعمال</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <Badge variant="secondary">عرض توضيحي لمنصة ولادة حلم</Badge>
            <span className="text-xs text-muted-foreground">
              عرض تفاعلي يُظهر قدراتنا في تطوير الحلول الاستشارية والبحثية
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Index;
