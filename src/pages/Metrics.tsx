import { ImpactMetricsCard as MetricsCard } from "@/components/impact/ImpactMetricsCard";
import { ImpactChart } from "@/components/impact/ImpactChart";
import { COPY } from "@/constants/copy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Zap,
  Calendar,
  Globe,
} from "lucide-react";
import { mockMetrics, mockChartData } from "@/services/api";

const Metrics = () => {
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl bod-heading flex items-center gap-2">
            <Target className="size-8 text-primary" />
            {COPY.METRICS.TITLES.analytics}
          </h1>
          <p className="bod-subtitle text-sm sm:text-base max-w-2xl">
            {COPY.METRICS.DESCRIPTIONS.analytics}
          </p>
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

        <div className="bod-grid-cards">
          <MetricsCard
            title={COPY.METRICS.TITLES.projectsCompleted}
            value={mockMetrics.projectsCompleted}
            icon={TrendingUp}
            change={{ value: 22.7, type: "increase" }}
            description={COPY.METRICS.DESCRIPTIONS.projectsCompleted}
          />
          <MetricsCard
            title={COPY.METRICS.TITLES.clientsSatisfaction}
            value={`${mockMetrics.clientSatisfaction}%`}
            icon={Activity}
            change={{ value: 5.2, type: "increase" }}
            description="معدل رضا عملائنا عن جودة الخدمات الاستشارية"
          />
          <MetricsCard
            title="تقارير بحثية منشورة"
            value={mockMetrics.researchReportsPublished}
            icon={Zap}
            variant="success"
            change={{ value: 42.1, type: "increase" }}
            description="تقارير بحثية عالية الجودة مع رؤى عميقة"
          />
          <MetricsCard
            title="الوصول الإقليمي"
            value={mockMetrics.regionalReach}
            icon={Globe}
            change={{ value: 25.8, type: "increase" }}
            description="المدن والمناطق المُخدمة في المملكة"
          />
        </div>

        <ImpactChart
          data={mockChartData}
          title="أداء ولادة حلم عبر الزمن"
          description="تطور مؤشرات جودة وأثر مشاريعنا الاستشارية والبحثية"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-bod-primary">
            <CardHeader>
              <CardTitle className="bod-title flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                مشاريع ولادة حلم الأخيرة
              </CardTitle>
              <CardDescription>
                مشاريع استشارية وبحثية مكتملة هذا الربع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">استراتيجية التحول الرقمي</p>
                    <p className="text-sm text-muted-foreground">
                      شراكة مع هيئة الحكومة الرقمية
                    </p>
                  </div>
                  <Badge className="badge-success">منجز</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">دراسة سوق الطاقة المتجددة</p>
                    <p className="text-sm text-muted-foreground">
                      شراكة مع وزارة الطاقة
                    </p>
                  </div>
                  <Badge className="badge-bod-progress">المرحلة الثانية</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">برنامج تطوير ريادة الأعمال</p>
                    <p className="text-sm text-muted-foreground">
                      دعم الشركات الناشئة والمتوسطة
                    </p>
                  </div>
                  <Badge className="badge-bod-planning">قيد التخطيط</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-bod-primary">
            <CardHeader>
              <CardTitle className="bod-title flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                ملخص الأداء
              </CardTitle>
              <CardDescription className="bod-subtitle">
                الأداء الربع سنوي مقابل الأهداف الاستراتيجية لولادة حلم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>تسليم الأثر</span>
                    <span className="text-muted-foreground">87%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "87%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>رضا أصحاب المصلحة</span>
                    <span className="text-muted-foreground">94%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "94%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>التسليم في الوقت</span>
                    <span className="text-muted-foreground">92%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>كفاءة الميزانية</span>
                    <span className="text-muted-foreground">89%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: "89%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Metrics;
