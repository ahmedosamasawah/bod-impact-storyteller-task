import { useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  sortable?: boolean;
  minWidth?: string;
  render?: (item: T, index: number) => ReactNode;
  mobileRender?: (item: T, index: number) => ReactNode;
}

export interface ActionConfig<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
}

export interface SearchConfig<T> {
  searchableFields: (keyof T | string)[];
  placeholder: string;
}

export interface EmptyStateConfig {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface DeleteDialogConfig<T> {
  title: string;
  description: string;
  getItemName: (item: T) => string;
  getItemDetails?: (item: T) => {
    subtitle?: string;
    metadata?: Array<{ label: string; value: string }>;
  };
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  searchConfig: SearchConfig<T>;
  emptyState: EmptyStateConfig;
  actions?: ActionConfig<T>;
  deleteDialog?: DeleteDialogConfig<T>;
  isDeleting?: boolean;
  cardTitle: string;
  itemsPerPage?: number;
  getSearchValue?: (item: T, field: keyof T | string) => string;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading,
  searchConfig,
  emptyState,
  actions,
  deleteDialog,
  isDeleting,
  cardTitle,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  getSearchValue,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((current, key) => 
      current && typeof current === 'object' && key in current 
        ? (current as Record<string, unknown>)[key] 
        : undefined, 
      obj
    );
  };

  const getItemSearchValue = (item: T, field: keyof T | string): string => {
    if (getSearchValue) {
      return getSearchValue(item, field);
    }
    
    const value = getNestedValue(item, field as string);
    return String(value || "").toLowerCase();
  };

  const filteredData = data.filter((item) =>
    searchConfig.searchableFields.some((field) =>
      getItemSearchValue(item, field).includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) 
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
     else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete && actions?.onDelete) 
      actions.onDelete(itemToDelete.id);
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (loading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>جاري التحميل...</CardTitle>
          <CardDescription>جاري جلب البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>{emptyState.title}</CardTitle>
          <CardDescription>{emptyState.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{emptyState.description}</p>
            {emptyState.actionLabel && emptyState.onAction && (
              <Button className="btn-hero" onClick={emptyState.onAction}>
                {emptyState.actionLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>
              عرض {paginatedData.length} عناصر من {filteredData.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchConfig.placeholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile */}
        <div className="block md:hidden space-y-4">
          {paginatedData.map((item, index) => (
            <Card key={item.id} className="">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">
                        #{startIndex + index + 1}
                      </div>
                      {columns.find(col => col.mobileRender)?.mobileRender?.(item, index) || (
                        <div className="font-semibold text-base mb-2">
                          {columns[0]?.render?.(item, index) || String(getNestedValue(item, columns[0]?.key))}
                        </div>
                      )}
                    </div>
                    {(actions?.onView || actions?.onEdit || actions?.onDelete) && (
                      <div className="flex gap-1 ml-2">
                        {actions.onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => actions.onView!(item)}
                          >
                            <Eye className="size-4" />
                          </Button>
                        )}
                        {actions.onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => actions.onEdit!(item)}
                          >
                            <Edit className="size-4" />
                          </Button>
                        )}
                        {actions.onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(item)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">#</TableHead>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.minWidth ? `min-w-[${column.minWidth}]` : undefined}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                        <ArrowUpDown className="ml-2 size-4" />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {(actions?.onView || actions?.onEdit || actions?.onDelete) && (
                  <TableHead className="min-w-[120px] text-center">الإجراءات</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="numbers text-sm text-muted-foreground text-right">
                    {startIndex + index + 1}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? 
                        column.render(item, index) : 
                        String(getNestedValue(item, column.key) || "")
                      }
                    </TableCell>
                  ))}
                  {(actions?.onView || actions?.onEdit || actions?.onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-center">
                        {actions.onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => actions.onView!(item)}
                          >
                            <Eye className="size-4" />
                          </Button>
                        )}
                        {actions.onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => actions.onEdit!(item)}
                          >
                            <Edit className="size-4" />
                          </Button>
                        )}
                        {actions.onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(item)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              صفحة {currentPage} من {totalPages}
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="size-4 mr-1" />
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                التالي
                <ChevronLeft className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {deleteDialog && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title={deleteDialog.title}
          itemName={itemToDelete ? deleteDialog.getItemName(itemToDelete) : ""}
          itemDetails={
            itemToDelete && deleteDialog.getItemDetails
              ? deleteDialog.getItemDetails(itemToDelete)
              : undefined
          }
          description={deleteDialog.description}
        />
      )}
    </Card>
  );
}