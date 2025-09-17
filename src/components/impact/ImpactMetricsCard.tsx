import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImpactMetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
  description?: string;
}

export function ImpactMetricsCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  description,
}: ImpactMetricsCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case "increase":
        return "badge-success";
      case "decrease":
        return "badge-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIconBg = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-success-light text-success";
      case "warning":
        return "bg-warning-light text-warning";
      case "destructive":
        return "bg-destructive-light text-destructive";
      default:
        return "bg-primary-light text-primary";
    }
  };

  return (
    <Card className="card-elevated hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", getIconBg(variant))}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getChangeColor(change.type))}>
                {change.type === "increase"
                  ? "+"
                  : change.type === "decrease"
                  ? "-"
                  : ""}
                {Math.abs(change.value)}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                مقارنة بالشهر الماضي
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
