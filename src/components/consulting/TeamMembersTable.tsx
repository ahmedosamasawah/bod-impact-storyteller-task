import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { TeamMember } from "@/services/api";
import { DataTable, ColumnConfig, ActionConfig, SearchConfig, EmptyStateConfig, DeleteDialogConfig } from "@/components/shared/DataTable";

interface TeamMembersTableProps {
  data: TeamMember[];
  loading?: boolean;
  onEdit?: (item: TeamMember) => void;
  onDelete?: (id: number) => void;
  onView?: (item: TeamMember) => void;
  isDeleting?: boolean;
}

export function TeamMembersTable({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  isDeleting,
}: TeamMembersTableProps) {
  const columns: ColumnConfig<TeamMember>[] = [
    {
      key: "name",
      label: "الاسم",
      sortable: true,
      minWidth: "150px",
      render: (item) => (
        <div className="font-medium">{item.name}</div>
      ),
      mobileRender: (item) => (
        <div>
          <h3 className="font-semibold text-base mb-1">{item.name}</h3>
          <div className="text-sm text-muted-foreground">@{item.username}</div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{item.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{item.phone}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t mt-3">
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                الشركة
              </div>
              <div className="font-medium truncate">{item.company.name}</div>
              {item.company.catchPhrase && (
                <div className="text-xs text-muted-foreground truncate">
                  {item.company.catchPhrase}
                </div>
              )}
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                الدور
              </div>
              <Badge variant="secondary" className="badge-success text-xs">
                {item.position}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "الاتصال",
      minWidth: "200px",
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate max-w-[180px]">{item.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "company.name",
      label: "الشركة",
      sortable: true,
      minWidth: "160px",
      render: (item) => (
        <div className="max-w-[140px]">
          <div className="font-medium text-sm truncate">{item.company.name}</div>
          {item.company.catchPhrase && (
            <div className="text-xs text-muted-foreground truncate">
              {item.company.catchPhrase}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "position",
      label: "الدور",
      minWidth: "100px",
      render: (item) => (
        <Badge variant="secondary" className="badge-success">
          {item.position}
        </Badge>
      ),
    },
  ];

  const searchConfig: SearchConfig<TeamMember> = {
    searchableFields: ["name", "username", "email", "company.name"],
    placeholder: "البحث عن أعضاء الفريق...",
  };

  const emptyState: EmptyStateConfig = {
    title: "لا يوجد أعضاء فريق",
    description: "لم يتم العثور على أعضاء فريق",
    actionLabel: "إضافة عضو فريق",
  };

  const actions: ActionConfig<TeamMember> = {
    onView,
    onEdit,
    onDelete,
  };

  const deleteDialog: DeleteDialogConfig<TeamMember> = {
    title: "عضو الفريق",
    description: "سيتم حذف جميع بيانات عضو الفريق والمشاريع المرتبطة به نهائياً من قاعدة البيانات.",
    getItemName: (item) => item.name,
    getItemDetails: (item) => ({
      subtitle: item.email,
      metadata: [
        { label: "المنصب", value: item.position || "غير محدد" },
        { label: "سنوات الخبرة", value: (item.experience || 0).toString() },
        { label: "الموقع", value: item.location || "غير محدد" },
        { label: "المشاريع المقادة", value: (item.projectsLed || 0).toString() },
      ],
    }),
  };

  const getSearchValue = (item: TeamMember, field: keyof TeamMember | string): string => {
    switch (field) {
      case "name":
        return item.name.toLowerCase();
      case "username":
        return item.username.toLowerCase();
      case "email":
        return item.email.toLowerCase();
      case "company.name":
        return item.company.name.toLowerCase();
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
      cardTitle="أعضاء الفريق"
      getSearchValue={getSearchValue}
    />
  );
}