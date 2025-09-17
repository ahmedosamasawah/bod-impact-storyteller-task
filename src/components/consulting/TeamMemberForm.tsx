import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TeamMember } from "@/services/api";
import { Loader2, User, Building, Award } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { toast } from "@/hooks/use-toast";
import { COPY } from "@/constants/copy";

const enhancedUserSchema = z.object({
  name: z
    .string()
    .min(2, "يجب أن يكون الاسم مكونًا من حرفين على الأقل")
    .max(50, "يجب ألا يزيد الاسم عن 50 حرفًا"),
  username: z
    .string()
    .min(3, "يجب أن يكون اسم المستخدم 3 أحرف على الأقل")
    .max(20, "يجب ألا يزيد اسم المستخدم عن 20 حرفًا")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "يمكن أن يحتوي اسم المستخدم على أحرف وأرقام وشرطات سفلية فقط"
    ),
  email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
  phone: z
    .string()
    .min(10, "يجب أن يحتوي رقم الجوال على 10 أرقام على الأقل")
    .regex(/^[\d\s\-+().]+$/, "يرجى إدخال رقم جوال صالح"),
  website: z.string().url("يرجى إدخال رابط موقع صالح").or(z.literal("")),
  position: z.string().min(2, "المنصب مطلوب"),
  expertise: z.string().min(5, "مجال الخبرة مطلوب"),
  experience: z
    .number()
    .min(0, "سنوات الخبرة يجب أن تكون رقم موجب")
    .max(50, "سنوات الخبرة لا يمكن أن تزيد عن 50"),
  certifications: z.string().min(2, "الشهادات المهنية مطلوبة"),
  location: z.string().min(2, "الموقع مطلوب"),
  joinDate: z.string().min(1, "تاريخ الانضمام مطلوب"),
  address: z.object({
    street: z.string().min(5, "العنوان التفصيلي مطلوب"),
    suite: z.string(),
    city: z.string().min(2, "المدينة مطلوبة"),
    zipcode: z.string().min(5, "الرمز البريدي مطلوب"),
  }),
  company: z.object({
    name: z.string().min(2, "اسم الشركة مطلوب"),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

type EnhancedUserFormData = z.infer<typeof enhancedUserSchema>;

// Helper function to map form fields to tabs
const getUserFieldTab = (fieldName: string): string => {
  const personalFields = [
    "name",
    "username",
    "email",
    "phone",
    "website",
    "address",
  ];
  const professionalFields = [
    "position",
    "expertise",
    "experience",
    "certifications",
    "location",
    "joinDate",
  ];
  const companyFields = ["company"];

  // Handle nested fields
  if (fieldName.startsWith("address.")) return "personal";
  if (fieldName.startsWith("company.")) return "company";

  if (personalFields.includes(fieldName)) return "personal";
  if (professionalFields.includes(fieldName)) return "professional";
  if (companyFields.includes(fieldName)) return "company";
  return "personal"; // default
};

// Helper function to get tabs with errors
const getUserTabsWithErrors = (
  errors: Record<string, unknown>
): Set<string> => {
  const tabsWithErrors = new Set<string>();
  Object.keys(errors).forEach((fieldName) => {
    tabsWithErrors.add(getUserFieldTab(fieldName));
  });
  return tabsWithErrors;
};

// Helper function to get tab display names
const getUserTabDisplayName = (tabName: string): string => {
  const tabNames = {
    personal: "البيانات الشخصية",
    professional: "المعلومات المهنية",
    company: "بيانات الشركة",
  };
  return tabNames[tabName as keyof typeof tabNames] || tabName;
};

interface TeamMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: TeamMember | null;
  onSuccess: () => void;
}

export function TeamMemberForm({
  open,
  onOpenChange,
  user,
  onSuccess,
}: TeamMemberFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [tabsWithErrors, setTabsWithErrors] = useState<Set<string>>(new Set());
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { createTeamMember, updateTeamMember, isCreating, isUpdating } =
    useTeamMembers();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<EnhancedUserFormData>({
    resolver: zodResolver(enhancedUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      position: "",
      expertise: "",
      experience: 0,
      certifications: "",
      location: "",
      joinDate: "",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      company: {
        name: "ولادة حلم للاستشارات",
        catchPhrase: "نحول الأحلام إلى واقع قابل للتحقيق",
        bs: "استشارات استراتيجية، بحوث متخصصة، تطوير أعمال",
      },
    },
  });

  const {
    watch,
    formState: { isDirty },
  } = form;

  // Watch for changes to detect unsaved changes
  useEffect(() => {
    const subscription = watch(() => {
      setHasUnsavedChanges(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

  // Watch for form errors to update tab error indicators
  useEffect(() => {
    const errors = form.formState.errors;
    setTabsWithErrors(getUserTabsWithErrors(errors));
  }, [form.formState.errors]);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website || "",
        position: user.position || "",
        expertise: Array.isArray(user.expertise)
          ? user.expertise.join(", ")
          : "",
        experience: user.experience || 0,
        certifications: Array.isArray(user.certifications)
          ? user.certifications.join(", ")
          : "",
        location: user.location || "",
        joinDate: user.joinDate || "",
        address: {
          street: user.address?.street || "",
          suite: user.address?.suite || "",
          city: user.address?.city || "",
          zipcode: user.address?.zipcode || "",
        },
        company: {
          name: user.company?.name || "ولادة حلم للاستشارات",
          catchPhrase:
            user.company?.catchPhrase || "نحول الأحلام إلى واقع قابل للتحقيق",
          bs:
            user.company?.bs || "استشارات استراتيجية، بحوث متخصصة، تطوير أعمال",
        },
      });
    } else {
      form.reset({
        name: "",
        username: "",
        email: "",
        phone: "",
        website: "",
        position: "",
        expertise: "",
        experience: 0,
        certifications: "",
        location: "",
        joinDate: "",
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
        },
        company: {
          name: "ولادة حلم للاستشارات",
          catchPhrase: "نحول الأحلام إلى واقع قابل للتحقيق",
          bs: "استشارات استراتيجية، بحوث متخصصة، تطوير أعمال",
        },
      });
    }
    setHasUnsavedChanges(false);
  }, [user, form]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
      return;
    }
    onOpenChange(false);
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    onOpenChange(false);
    setHasUnsavedChanges(false);
  };

  const handleKeepEditing = () => {
    setShowUnsavedDialog(false);
  };

  const onSubmit = async (data: EnhancedUserFormData) => {
    // Check for validation errors across all tabs
    const formErrors = form.formState.errors;
    if (Object.keys(formErrors).length > 0) {
      const tabsWithErrors = getUserTabsWithErrors(formErrors);
      const firstErrorTab = Array.from(tabsWithErrors)[0];

      // Navigate to first tab with errors
      setActiveTab(firstErrorTab);

      // Show user-friendly message
      toast({
        variant: "destructive",
        title: "يرجى إكمال جميع الحقول المطلوبة",
        description: `توجد أخطاء في تبويب "${getUserTabDisplayName(
          firstErrorTab
        )}". يرجى مراجعة وإصلاح الأخطاء أولاً.`,
      });

      return;
    }

    try {
      const userData = {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        website: data.website,
        // Enhanced professional fields
        position: data.position,
        expertise: data.expertise.split(",").map((item) => item.trim()),
        experience: data.experience,
        certifications: data.certifications
          .split(",")
          .map((item) => item.trim()),
        location: data.location,
        joinDate: data.joinDate,
        // Default values for required fields not in form
        projectsLed: user?.projectsLed || 0, // Keep existing or default to 0
        clientRating: user?.clientRating || 4.0, // Keep existing or default to 4.0
        // Basic contact and company info
        address: {
          street: data.address.street,
          suite: data.address.suite,
          city: data.address.city,
          zipcode: data.address.zipcode,
        },
        company: data.company,
      };

      if (user) {
        await updateTeamMember(user.id, userData);
      } else {
        await createTeamMember(userData);
      }

      onSuccess();
      setHasUnsavedChanges(false);
    } catch (error) {
      // Error handling is done in the mutations
    }
  };

  // Focus first field when dialog opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (hasUnsavedChanges) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {user ? COPY.TEAM_MEMBERS.ACTIONS.edit : COPY.TEAM_MEMBERS.ACTIONS.create}
          </DialogTitle>
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
                  value="personal"
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("personal")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <User className="size-3 sm:size-4" />
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">البيانات الشخصية</span>
                    <span className="sm:hidden">شخصي</span>
                    {tabsWithErrors.has("personal") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("professional")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <Award className="size-3 sm:size-4" />
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">المعلومات المهنية</span>
                    <span className="sm:hidden">مهني</span>
                    {tabsWithErrors.has("professional") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto ${
                    tabsWithErrors.has("company")
                      ? "text-destructive data-[state=active]:text-destructive"
                      : ""
                  }`}
                >
                  <Building className="size-3 sm:size-4" />
                  <div className="flex items-center gap-1 text-center">
                    <span className="hidden sm:inline">بيانات الشركة</span>
                    <span className="sm:hidden">شركة</span>
                    {tabsWithErrors.has("company") && (
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          الاسم الكامل
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            ref={nameInputRef}
                            placeholder="أدخل الاسم الكامل..."
                            {...field}
                            disabled={isSubmitting}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormDescription>
                          الاسم الكامل للمستشار (يفضل مع اللقب الأكاديمي)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          اسم المستخدم
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم المستخدم..."
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

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          البريد الإلكتروني
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@bod.com.sa"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          رقم الجوال
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+966-11-xxx-xxxx"
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع الإلكتروني / LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/consultant-name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        رابط LinkedIn أو الموقع الشخصي
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Information */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">معلومات العنوان</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            العنوان التفصيلي
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="طريق الملك فهد..."
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.suite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوحدة/المكتب</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="برج الإدارة، الطابق 15"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            المدينة
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger disabled={isSubmitting}>
                                <SelectValue placeholder="اختر المدينة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="الرياض">الرياض</SelectItem>
                                <SelectItem value="جدة">جدة</SelectItem>
                                <SelectItem value="الدمام">الدمام</SelectItem>
                                <SelectItem value="مكة المكرمة">
                                  مكة المكرمة
                                </SelectItem>
                                <SelectItem value="المدينة المنورة">
                                  المدينة المنورة
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            الرمز البريدي
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="11564"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          المنصب
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger disabled={isSubmitting}>
                              <SelectValue placeholder="اختر المنصب" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="المدير التنفيذي">
                                المدير التنفيذي
                              </SelectItem>
                              <SelectItem value="استشاري أول">
                                استشاري أول
                              </SelectItem>
                              <SelectItem value="استشاري أول - التحول الرقمي">
                                استشاري أول - التحول الرقمي
                              </SelectItem>
                              <SelectItem value="محلل أبحاث أول">
                                محلل أبحاث أول
                              </SelectItem>
                              <SelectItem value="مدير تطوير الأعمال">
                                مدير تطوير الأعمال
                              </SelectItem>
                              <SelectItem value="مستشار">مستشار</SelectItem>
                              <SelectItem value="محلل">محلل</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          سنوات الخبرة
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="15"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        مجالات الخبرة
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="الاستراتيجية التنفيذية، التحول الرقمي، القيادة المؤسسية"
                          className="min-h-[80px]"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        اكتب مجالات الخبرة مفصولة بفاصلة
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        الشهادات المهنية
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="PMP، Stanford Executive Program، McKinsey Problem Solving"
                          className="min-h-[80px]"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        اكتب الشهادات المهنية مفصولة بفاصلة
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          موقع العمل
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger disabled={isSubmitting}>
                              <SelectValue placeholder="اختر موقع العمل" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="الرياض">الرياض</SelectItem>
                              <SelectItem value="جدة">جدة</SelectItem>
                              <SelectItem value="الدمام">الدمام</SelectItem>
                              <SelectItem value="عن بُعد">عن بُعد</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="joinDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          تاريخ الانضمام
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <FormField
                  control={form.control}
                  name="company.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        اسم الشركة
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ولادة حلم للاستشارات"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.catchPhrase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شعار الشركة</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="نحول الأحلام إلى واقع قابل للتحقيق"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>الشعار الرسمي للشركة</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.bs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تخصص الشركة</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="استشارات استراتيجية، بحوث متخصصة، تطوير أعمال"
                          className="min-h-[100px]"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>وصف مجالات عمل الشركة</FormDescription>
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
                    {user ? "جارٍ التحديث..." : "جارٍ الإضافة..."}
                  </>
                ) : user ? (
                  "تحديث العضو"
                ) : (
                  "إضافة عضو"
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
