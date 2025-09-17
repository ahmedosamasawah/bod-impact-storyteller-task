import { Badge } from "@/components/ui/badge";
import { Project } from "@/services/api";
import { DataTable, ColumnConfig, ActionConfig, SearchConfig, EmptyStateConfig, DeleteDialogConfig } from "@/components/shared/DataTable";

interface ProjectsTableProps {
  data: Project[];
  loading?: boolean;
  onEdit?: (item: Project) => void;
  onDelete?: (id: number) => void;
  onView?: (item: Project) => void;
  isDeleting?: boolean;
}

export function ProjectsTable({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  isDeleting,
}: ProjectsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "badge-bod-completed";
      case "قيد التنفيذ":
        return "badge-bod-progress";
      case "التخطيط":
        return "badge-bod-planning";
      case "معلق":
        return "badge-error";
      default:
        return "badge-bod-primary";
    }
  };

  const columns: ColumnConfig<Project>[] = [
    {
      key: "title",
      label: "العنوان",
      sortable: true,
      minWidth: "200px",
      render: (item) => (
        <div className="font-medium">
          <div className="line-clamp-2 max-w-[250px]">
            {item.title || "عنوان غير محدد"}
          </div>
        </div>
      ),
    },
    {
      key: "clientName",
      label: "العميل والميزانية",
      minWidth: "180px",
      render: (item) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            <div className="truncate max-w-[150px]">
              {item.clientName || "عميل غير محدد"}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Intl.NumberFormat("ar-SA", {
              style: "currency",
              currency: "SAR",
              minimumFractionDigits: 0,
            }).format(item.budget || 0)}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      minWidth: "100px",
      render: (item) => (
        <Badge className={getStatusBadge(item.status)}>
          {item.status}
        </Badge>
      ),
    },
  ];

  const searchConfig: SearchConfig<Project> = {
    searchableFields: ["title", "body", "sector", "clientName"],
    placeholder: "البحث في الإدخالات...",
  };

  const emptyState: EmptyStateConfig = {
    title: "لا توجد بيانات",
    description: "لم يتم العثور على مشاريع أو إدخالات",
    actionLabel: "إضافة مشروع",
  };

  const actions: ActionConfig<Project> = {
    onView,
    onEdit,
    onDelete,
  };

  const deleteDialog: DeleteDialogConfig<Project> = {
    title: "المشروع",
    description: "سيتم حذف جميع البيانات المرتبطة بهذا المشروع نهائياً من قاعدة البيانات.",
    getItemName: (item) => item.title || "مشروع غير محدد",
    getItemDetails: (item) => ({
      subtitle: item.body?.substring(0, 80) + "...",
      metadata: [
        { label: "القطاع", value: item.sector },
        { label: "الحالة", value: item.status },
        { label: "العميل", value: item.clientName },
        {
          label: "الميزانية",
          value: new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
            minimumFractionDigits: 0,
          }).format(item.budget),
        },
      ],
    }),
  };

  const getSearchValue = (item: Project, field: keyof Project | string): string => {
    switch (field) {
      case "title":
        return item.title?.toLowerCase() || "";
      case "body":
        return item.body?.toLowerCase() || "";
      case "sector":
        return item.sector?.toLowerCase() || "";
      case "clientName":
        return item.clientName?.toLowerCase() || "";
      default:
        return "";
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      searchConfig={searchConfig}
      emptyState={emptyState}
      actions={actions}
      deleteDialog={deleteDialog}
      isDeleting={isDeleting}
      cardTitle="إدخالات المشروع"
      getSearchValue={getSearchValue}
    />
  );
}