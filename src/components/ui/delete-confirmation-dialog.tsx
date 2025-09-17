import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  itemName?: string;
  itemDetails?: {
    subtitle?: string;
    metadata?: Array<{ label: string; value: string; variant?: "default" | "secondary" | "destructive" | "outline" }>;
  };
  showUndoHint?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
  itemDetails,
  showUndoHint = true,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>

            <div className="flex-1">

<div className="flex items-center gap-3">

              <Trash2 className="h-5 w-5 text-destructive" />
              <AlertDialogTitle className="text-lg">حذف {title}</AlertDialogTitle>
</div>
              
              {itemName && (
                <div className="mt-2 p-3 rounded-lg bg-muted/50 border">
                  <div className="font-medium text-sm">{itemName}</div>
                  {itemDetails?.subtitle && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {itemDetails.subtitle}
                    </div>
                  )}
                  {itemDetails?.metadata && itemDetails.metadata.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {itemDetails.metadata.map((meta, index) => (
                        <Badge
                          key={index}
                          variant={meta.variant || "secondary"}
                          className="text-xs"
                        >
                          {meta.label}: {meta.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <AlertDialogDescription className="mt-3">
                {description ||
                  `هل أنت متأكد من حذف ${
                    itemName ? `"${itemName}"` : "هذا العنصر"
                  }؟ سيتم حذفه نهائياً من قاعدة البيانات.`}
              </AlertDialogDescription>
              
              {showUndoHint && (
                <div className="flex items-center gap-2 mt-3 p-2 rounded-md bg-blue-50 dark:bg-blue-950/20">
                  <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-700 dark:text-blue-300">
                    ملاحظة: يمكنك التراجع خلال 5 ثوانِ بعد الحذف
                  </span>
                </div>
              )}
            </div>

        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            حذف نهائياً
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
