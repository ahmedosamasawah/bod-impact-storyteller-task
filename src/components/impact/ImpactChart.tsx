import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChartData {
  month: string;
  impact: number;
  consultingHours: number;
  clientSatisfaction: number;
  projects?: number;
}

interface ImpactChartProps {
  data: ChartData[];
  title?: string;
  description?: string;
}

export function ImpactChart({
  data,
  title = "أداء الخدمات الاستشارية",
  description = "مقاييس جودة وأداء مشاريع ولادة حلم الاستشارية",
}: ImpactChartProps) {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "calc(var(--radius) - 2px)",
                  boxShadow: "var(--shadow-md)",
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="impact"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
                name="نقاط الأثر الاستشاري"
              />
              <Line
                type="monotone"
                dataKey="consultingHours"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--success))",
                  strokeWidth: 2,
                }}
                name="ساعات استشارية"
              />
              <Line
                type="monotone"
                dataKey="clientSatisfaction"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--warning))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--warning))",
                  strokeWidth: 2,
                }}
                name="% رضا العملاء"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
