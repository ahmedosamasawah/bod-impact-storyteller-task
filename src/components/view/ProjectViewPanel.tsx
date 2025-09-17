import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  Target,
  MapPin,
  Building,
  User,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { Project } from "@/services/api";

interface ProjectViewPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
}

const getSectorInfo = (sector: string) => {
  const sectorMap: Record<
    string,
    { icon: string; color: string; bgColor: string }
  > = {
    "تحول رقمي": { icon: "💻", color: "text-blue-600", bgColor: "bg-blue-50" },
    مالية: { icon: "💰", color: "text-green-600", bgColor: "bg-green-50" },
    صحة: { icon: "🏥", color: "text-red-600", bgColor: "bg-red-50" },
    تعليم: { icon: "📚", color: "text-purple-600", bgColor: "bg-purple-50" },
    طاقة: { icon: "⚡", color: "text-yellow-600", bgColor: "bg-yellow-50" },
  };
  return (
    sectorMap[sector] || {
      icon: "📊",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    }
  );
};

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { color: string; bgColor: string }> = {
    التخطيط: { color: "text-blue-700", bgColor: "bg-blue-100" },
    "قيد التنفيذ": { color: "text-yellow-700", bgColor: "bg-yellow-100" },
    مكتمل: { color: "text-green-700", bgColor: "bg-green-100" },
    معلق: { color: "text-red-700", bgColor: "bg-red-100" },
  };
  return (
    statusMap[status] || { color: "text-gray-700", bgColor: "bg-gray-100" }
  );
};

const formatBudget = (amount: number) => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const calculateProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.round((elapsed / total) * 100);
};

const getImpactInfo = (score: number) => {
  if (score >= 9)
    return {
      label: "أثر استثنائي",
      color: "text-green-600",
      bgColor: "bg-green-50",
    };
  if (score >= 8)
    return { label: "أثر عالي", color: "text-blue-600", bgColor: "bg-blue-50" };
  if (score >= 6)
    return {
      label: "أثر متوسط",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    };
  return { label: "أثر منخفض", color: "text-red-600", bgColor: "bg-red-50" };
};

const getConsultantName = (userId: number) => {
  const consultants: Record<number, string> = {
    1: "د. أحمد العبدالله",
    2: "د. فاطمة الزهراني",
    3: "محمد البريك",
    4: "سارة القحطاني",
    5: "د. خالد العمري",
    6: "نورا الدوسري",
  };
  return consultants[userId] || "استشاري غير محدد";
};

export function ProjectViewPanel({
  open,
  onOpenChange,
  project,
  onEdit,
  onDelete,
}: ProjectViewPanelProps) {
  if (!project) return null;

  const sectorInfo = getSectorInfo(project.sector);
  const statusInfo = getStatusInfo(project.status);
  const impactInfo = getImpactInfo(project.impactScore);
  const progress = calculateProgress(project.startDate, project.endDate);
  const consultantName = getConsultantName(project.userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl text-right">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-right">
                مشروع استشاري لولادة حلم - تفاصيل كاملة ومؤشرات الأداء
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="gap-2"
                >
                  <Edit className="size-4" />
                  تعديل
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="gap-2"
                >
                  <Trash2 className="size-4" />
                  حذف
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sectorInfo.bgColor}`}>
                    <span className="text-lg">{sectorInfo.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">القطاع</p>
                    <p className={`font-medium ${sectorInfo.color}`}>
                      {project.sector}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${statusInfo.color} ${statusInfo.bgColor} border-0`}
                  >
                    {project.status}
                  </Badge>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{progress}%</span>
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${impactInfo.bgColor}`}>
                    <Target className={`size-4 ${impactInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">نقاط الأثر</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {project.impactScore}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(project.impactScore / 2)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                التقدم الزمني للمشروع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>البداية: {formatDate(project.startDate)}</span>
                <span>النهاية المتوقعة: {formatDate(project.endDate)}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium">{progress}% مكتمل</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>تفاصيل المشروع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">العميل</p>
                      <p className="text-sm text-muted-foreground">
                        {project.clientName}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">المنطقة</p>
                      <p className="text-sm text-muted-foreground">
                        {project.region}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">المدة</p>
                      <p className="text-sm text-muted-foreground">
                        {project.duration}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">الاستشاري المسؤول</p>
                      <p className="text-sm text-muted-foreground">
                        {consultantName}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>المعلومات المالية والأثر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">الميزانية</p>
                      <p className="text-lg font-bold text-primary">
                        {formatBudget(project.budget)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Target className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">تقييم الأثر</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {project.impactScore}/10
                        </span>
                        <Badge
                          className={`${impactInfo.color} ${impactInfo.bgColor} border-0 text-xs`}
                        >
                          {impactInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">مؤشر الإنجاز</p>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>وصف المشروع وأهدافه</CardTitle>
              <CardDescription>
                الأهداف التفصيلية ونطاق العمل للمشروع الاستشاري
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-right">
                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {project.body}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium gradient-text">
                    ولادة حلم للاستشارات
                  </p>
                  <p className="text-sm text-muted-foreground">
                    نحول الأحلام إلى واقع قابل للتحقيق
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  مشروع معتمد
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
