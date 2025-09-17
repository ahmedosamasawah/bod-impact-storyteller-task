import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Project, CreateProjectPayload } from "@/services/api";
import { Loader2, Calendar, DollarSign, Target } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "@/hooks/use-toast";
import { COPY } from "@/constants/copy";

const enhancedProjectSchema = z.object({
  title: z
    .string()
    .min(3, "يجب أن يكون العنوان 3 أحرف على الأقل")
    .max(100, "يجب ألا يزيد العنوان عن 100 حرف"),
  body: z
    .string()
    .min(10, "يجب أن يحتوي الوصف على 10 أحرف على الأقل")
    .max(1000, "يجب ألا يزيد الوصف عن 1000 حرف"),
  sector: z.string().min(1, "يرجى اختيار القطاع"),
  status: z.string().min(1, "يرجى اختيار حالة المشروع"),
  region: z.string().min(1, "يرجى اختيار المنطقة"),
  budget: z
    .number()
    .min(100000, "الميزانية يجب أن تكون 100,000 ريال على الأقل")
    .max(10000000, "الميزانية لا يمكن أن تتجاوز 10 مليون ريال"),
  duration: z.string().min(1, "يرجى اختيار مدة المشروع"),
  impactScore: z
    .number()
    .min(1, "نقاط الأثر يجب أن تكون بين 1-10")
    .max(10, "نقاط الأثر يجب أن تكون بين 1-10"),
  clientName: z.string().min(2, "اسم العميل مطلوب"),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  endDate: z.string().min(1, "تاريخ النهاية مطلوب"),
  userId: z.number().min(1, "يرجى اختيار الاستشاري المسؤول"),
});

type EnhancedProjectFormData = z.infer<typeof enhancedProjectSchema>;

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSuccess: () => void;
}

const BOD_SECTORS = [
  { value: "تحول رقمي", label: "التحول الرقمي", icon: "💻" },
  { value: "مالية", label: "الخدمات المالية", icon: "💰" },
  { value: "صحة", label: "الرعاية الصحية", icon: "🏥" },
  { value: "تعليم", label: "التعليم والتدريب", icon: "📚" },
  { value: "طاقة", label: "الطاقة والبيئة", icon: "⚡" },
];

const BOD_STATUSES = [
  {
    value: "التخطيط",
    label: "مرحلة التخطيط",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "قيد التنفيذ",
    label: "قيد التنفيذ",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "مكتمل", label: "مكتمل", color: "bg-green-100 text-green-800" },
  { value: "معلق", label: "معلق", color: "bg-red-100 text-red-800" },
];

const BOD_REGIONS = [
  { value: "الرياض", label: "الرياض" },
  { value: "جدة", label: "جدة" },
  { value: "الدمام", label: "الدمام" },
  { value: "مكة", label: "مكة المكرمة" },
  { value: "المدينة", label: "المدينة المنورة" },
];

const BOD_DURATIONS = [
  { value: "3 أشهر", label: "3 أشهر" },
  { value: "6 أشهر", label: "6 أشهر" },
  { value: "سنة", label: "سنة واحدة" },
  { value: "سنة ونصف", label: "سنة ونصف" },
  { value: "سنتان", label: "سنتان" },
];

const BOD_CONSULTANTS = [
  { id: 1, name: "د. أحمد العبدالله" },
  { id: 2, name: "د. فاطمة الزهراني" },
  { id: 3, name: "محمد البريك" },
  { id: 4, name: "سارة القحطاني" },
  { id: 5, name: "د. خالد العمري" },
  { id: 6, name: "نورا الدوسري" },
];

const getFieldTab = (fieldName: string): string => {
  const basicFields = ["title", "body", "sector", "status", "clientName"];
  const detailsFields = ["region", "duration", "budget", "impactScore"];
  const timelineFields = ["startDate", "endDate", "userId"];

  if (basicFields.includes(fieldName)) return "basic";
  if (detailsFields.includes(fieldName)) return "details";
  if (timelineFields.includes(fieldName)) return "timeline";
  return "basic";
};

const getTabsWithErrors = (errors: Record<string, unknown>): Set<string> => {
  const tabsWithErrors = new Set<string>();
  Object.keys(errors).forEach((fieldName) => {
    tabsWithErrors.add(getFieldTab(fieldName));
  });
  return tabsWithErrors;
};

const getTabDisplayName = (tabName: string): string => {
  const tabNames = {
    basic: "المعلومات الأساسية",
    details: "تفاصيل المشروع",
    timeline: "الجدول الزمني والمسؤوليات",
  };
  return tabNames[tabName as keyof typeof tabNames] || tabName;
};

export function ProjectForm({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [tabsWithErrors, setTabsWithErrors] = useState<Set<string>>(new Set());
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { createProject, updateProject, isCreating, isUpdating } =
    useProjects();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<EnhancedProjectFormData>({
    resolver: zodResolver(enhancedProjectSchema),
    defaultValues: {
      title: "",
      body: "",
      sector: "",
      status: "",
      region: "",
      budget: 500000,
      duration: "",
      impactScore: 8,
      clientName: "",
      startDate: "",
      endDate: "",
      userId: 1,
    },
  });

  const {
    watch,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    const subscription = watch(() => {
      setHasUnsavedChanges(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

  useEffect(() => {
    const errors = form.formState.errors;
    setTabsWithErrors(getTabsWithErrors(errors));
  }, [form.formState.errors]);

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        body: project.body,
        sector: project.sector,
        status: project.status,
        region: project.region,
        budget: project.budget,
        duration: project.duration,
        impactScore: project.impactScore,
        clientName: project.clientName,
        startDate: project.startDate,
        endDate: project.endDate,
        userId: project.userId,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const sixMonthsLater = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      form.reset({
        title: "",
        body: "",
        sector: "",
        status: "",
        region: "",
        budget: 0,
        duration: "",
        impactScore: 0,
        clientName: "",
        startDate: today,
        endDate: sixMonthsLater,
        userId: 1,
      });
    }
    setHasUnsavedChanges(false);
  }, [project, form]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
      return;
    }
    onOpenChange(false);
    setHasUnsavedChanges(false);
    setActiveTab("basic");
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    onOpenChange(false);
    setHasUnsavedChanges(false);
    setActiveTab("basic");
  };

  const handleKeepEditing = () => {
    setShowUnsavedDialog(false);
  };

  const onSubmit = async (data: EnhancedProjectFormData) => {
    const formErrors = form.formState.errors;
    if (Object.keys(formErrors).length > 0) {
      const tabsWithErrors = getTabsWithErrors(formErrors);
      const firstErrorTab = Array.from(tabsWithErrors)[0];

      setActiveTab(firstErrorTab);

      toast({
        variant: "destructive",
        title: "يرجى إكمال جميع الحقول المطلوبة",
        description: `توجد أخطاء في تبويب "${getTabDisplayName(
          firstErrorTab
        )}". يرجى مراجعة وإصلاح الأخطاء أولاً.`,
      });

      return;
    }

    const projectData: CreateProjectPayload = {
      title: data.title,
      body: data.body,
      sector: data.sector,
      status: data.status,
      region: data.region,
      budget: data.budget,
      duration: data.duration,
      impactScore: data.impactScore,
      clientName: data.clientName,
      startDate: data.startDate,
      endDate: data.endDate,
      userId: data.userId,
    };

    if (project)
      await updateProject(project.id, projectData);
    else await createProject(projectData);

    onSuccess();
    setHasUnsavedChanges(false);
    setActiveTab("basic");
  };

  useEffect(() => {
    if (open && titleInputRef.current) {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getImpactLabel = (score: number) => {
    if (score >= 9) return "أثر استثنائي";
    if (score >= 8) return "أثر عالي";
    if (score >= 6) return "أثر متوسط";
    return "أثر منخفض";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (hasUnsavedChanges) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {project
                ? COPY.PROJECTS.ACTIONS.edit
                : COPY.PROJECTS.ACTIONS.create}
            </DialogTitle>
          </div>
          <DialogDescription>
            {project
              ? "قم بتحديث تفاصيل المشروع الاستشاري أدناه. سيتم حفظ التغييرات في قاعدة البيانات."
              : "املأ تفاصيل المشروع لإنشاء مشروع استشاري جديد بواسطة فريق ولادة حلم."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
              dir="rtl"
            >
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 h-auto p-1">
                <TabsTrigger
                  value="basic"
                  className={`text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("basic")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">المعلومات الأساسية</span>
                    <span className="sm:hidden">أساسية</span>
                    {tabsWithErrors.has("basic") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className={`text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("details")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">تفاصيل المشروع</span>
                    <span className="sm:hidden">تفاصيل</span>
                    {tabsWithErrors.has("details") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className={`text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("timeline")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">
                      الجدول الزمني والمسؤوليات
                    </span>
                    <span className="sm:hidden">جدولة</span>
                    {tabsWithErrors.has("timeline") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        عنوان المشروع
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          ref={titleInputRef}
                          placeholder="أدخل عنوان المشروع الاستشاري..."
                          {...field}
                          disabled={isSubmitting}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormDescription>
                        عنوان واضح ووصفي للمشروع الاستشاري يعكس طبيعة الخدمة
                        المقدمة.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        وصف المشروع
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="صف أهداف المشروع، نطاق العمل، والنتائج المتوقعة..."
                          className="min-h-[120px] resize-none"
                          {...field}
                          disabled={isSubmitting}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormDescription>
                        وصف تفصيلي لأهداف المشروع ومخرجاته ومنهجية العمل المخطط
                        لها.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          القطاع
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر القطاع" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOD_SECTORS.map((sector) => (
                              <SelectItem
                                key={sector.value}
                                value={sector.value}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{sector.icon}</span>
                                  <span>{sector.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          حالة المشروع
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOD_STATUSES.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={status.color}
                                    variant="secondary"
                                  >
                                    {status.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        اسم العميل
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اسم العميل أو المؤسسة..."
                          {...field}
                          disabled={isSubmitting}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormDescription>
                        اسم العميل أو المؤسسة التي سيتم تقديم الخدمة الاستشارية
                        لها.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          المنطقة
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المنطقة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOD_REGIONS.map((region) => (
                              <SelectItem
                                key={region.value}
                                value={region.value}
                              >
                                {region.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          مدة المشروع
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOD_DURATIONS.map((duration) => (
                              <SelectItem
                                key={duration.value}
                                value={duration.value}
                              >
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <DollarSign className="size-4" />
                        الميزانية (ريال سعودي)
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="number"
                            placeholder="500000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            disabled={isSubmitting}
                            aria-required="true"
                          />
                          <div className="text-sm text-muted-foreground">
                            الميزانية المقدرة: {formatBudget(field.value)}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        الميزانية الإجمالية المقدرة للمشروع بالريال السعودي.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="impactScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Target className="size-4" />
                        نقاط الأثر المتوقع
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={1}
                            max={10}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            disabled={isSubmitting}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm">
                            <span>1</span>
                            <div className="text-center">
                              <div className="font-medium">
                                {field.value ? field.value.toFixed(1) : "0.0"}
                              </div>
                              <div className="text-muted-foreground">
                                {getImpactLabel(field.value)}
                              </div>
                            </div>
                            <span>10</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        تقييم الأثر المتوقع للمشروع على العميل والمجتمع (1-10).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          تاريخ البداية
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isSubmitting}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          تاريخ النهاية المتوقع
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isSubmitting}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        الاستشاري المسؤول
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={
                          field.value ? field.value.toString() : "1"
                        }
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الاستشاري المسؤول" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BOD_CONSULTANTS.map((consultant) => (
                            <SelectItem
                              key={consultant.id}
                              value={consultant.id.toString()}
                            >
                              {consultant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        الاستشاري الرئيسي المسؤول عن إدارة وتنفيذ هذا المشروع.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    {project ? "جارٍ التحديث..." : "جارٍ الإنشاء..."}
                  </>
                ) : project ? (
                  "تحديث المشروع"
                ) : (
                  "إنشاء المشروع"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={handleDiscardChanges}
        onCancel={handleKeepEditing}
      />
    </Dialog>
  );
}
