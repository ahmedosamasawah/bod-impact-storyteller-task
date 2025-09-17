import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  TrendingUp,
  User,
  Building,
  Globe,
  Edit,
  Trash2,
  Briefcase,
  Clock,
} from "lucide-react";
import { TeamMember } from "@/services/api";

interface TeamMemberViewPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (id: number) => void;
}

const getPositionInfo = (position: string) => {
  const positionMap: Record<
    string,
    { level: string; color: string; bgColor: string }
  > = {
    "المدير التنفيذي": {
      level: "تنفيذي",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    "استشاري أول": {
      level: "أول",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    "استشاري أول - التحول الرقمي": {
      level: "أول",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    "محلل أبحاث أول": {
      level: "أول",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    "مدير تطوير الأعمال": {
      level: "إداري",
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
    "عالم بيانات أول": {
      level: "أول",
      color: "text-cyan-700",
      bgColor: "bg-cyan-100",
    },
    "مدير مشاريع أول": {
      level: "أول",
      color: "text-indigo-700",
      bgColor: "bg-indigo-100",
    },
    "استشاري قطاع الصحة": {
      level: "متخصص",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
    "أخصائي تقنيات التعليم": {
      level: "متخصص",
      color: "text-pink-700",
      bgColor: "bg-pink-100",
    },
  };
  return (
    positionMap[position] || {
      level: "عام",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    }
  );
};

const formatJoinDate = (dateString: string) => {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const calculateServiceYears = (joinDate: string) => {
  const start = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0) {
    return `${years} سنة${months > 0 ? ` و ${months} شهر` : ""}`;
  }
  return `${months} شهر`;
};

const getExperienceInfo = (years: number) => {
  if (years >= 15)
    return { label: "خبير", color: "text-purple-600", bgColor: "bg-purple-50" };
  if (years >= 10)
    return { label: "كبير", color: "text-blue-600", bgColor: "bg-blue-50" };
  if (years >= 5)
    return { label: "متوسط", color: "text-green-600", bgColor: "bg-green-50" };
  return { label: "مبتدئ", color: "text-orange-600", bgColor: "bg-orange-50" };
};

const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`size-4 ${
        i < Math.floor(rating)
          ? "text-yellow-400 fill-current"
          : "text-gray-300"
      }`}
    />
  ));
};

const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("966")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
      5,
      8
    )} ${digits.slice(8)}`;
  } else if (digits.startsWith("05")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone;
};

export function TeamMemberViewPanel({
  open,
  onOpenChange,
  member,
  onEdit,
  onDelete,
}: TeamMemberViewPanelProps) {
  if (!member) return null;

  const positionInfo = getPositionInfo(member.position);
  const experienceInfo = getExperienceInfo(member.experience);
  const serviceYears = calculateServiceYears(member.joinDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl text-right">
                {member.name}
              </DialogTitle>
              <DialogDescription className="text-right">
                ملف شخصي تفصيلي لعضو فريق ولادة حلم الاستشاري
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(member)}
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
                  onClick={() => onDelete(member.id)}
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
                  <div className={`p-2 rounded-lg ${positionInfo.bgColor}`}>
                    <Briefcase className={`size-4 ${positionInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المنصب</p>
                    <p className={`font-medium ${positionInfo.color}`}>
                      {member.position}
                    </p>
                    <Badge
                      className={`${positionInfo.color} ${positionInfo.bgColor} border-0 text-xs mt-1`}
                    >
                      {positionInfo.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${experienceInfo.bgColor}`}>
                    <Clock className={`size-4 ${experienceInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      سنوات الخبرة
                    </p>
                    <p className="font-bold text-lg">{member.experience}</p>
                    <Badge
                      className={`${experienceInfo.color} ${experienceInfo.bgColor} border-0 text-xs`}
                    >
                      {experienceInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex">{renderStars(member.clientRating)}</div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      تقييم العملاء
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {member.clientRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        من 5
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                مؤشرات الأداء والإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      المشاريع المقادة
                    </span>
                    <span className="font-bold text-primary">
                      {member.projectsLed}
                    </span>
                  </div>
                  <Progress
                    value={Math.min((member.projectsLed / 50) * 100, 100)}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">تقييم العملاء</span>
                    <span className="font-bold text-primary">
                      {member.clientRating.toFixed(1)}/5
                    </span>
                  </div>
                  <Progress
                    value={(member.clientRating / 5) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  فترة الخدمة في ولادة حلم
                </span>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {serviceYears}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">البريد الإلكتروني</p>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">رقم الجوال</p>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {formatPhoneNumber(member.phone)}
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">موقع العمل</p>
                      <p className="text-sm text-muted-foreground">
                        {member.location}
                      </p>
                    </div>
                  </div>

                  {member.website && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <Globe className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">الموقع الشخصي</p>
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            ملف LinkedIn
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>المعلومات المهنية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">اسم المستخدم</p>
                      <p className="text-sm text-muted-foreground">
                        @{member.username}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">تاريخ الانضمام</p>
                      <p className="text-sm text-muted-foreground">
                        {formatJoinDate(member.joinDate)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Building className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">العنوان</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{member.address.street}</p>
                        {member.address.suite && <p>{member.address.suite}</p>}
                        <p>
                          {member.address.city} {member.address.zipcode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  مجالات الخبرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  الشهادات المهنية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {member.certifications.length > 0 ? (
                    member.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      لا توجد شهادات مسجلة
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{member.company.name}</p>
                {member.company.catchPhrase && (
                  <p className="text-sm text-muted-foreground italic">
                    "{member.company.catchPhrase}"
                  </p>
                )}
                {member.company.bs && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {member.company.bs}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium gradient-text">
                    فريق ولادة حلم للاستشارات
                  </p>
                  <p className="text-sm text-muted-foreground">
                    خبراء متميزون في تحويل الأحلام إلى واقع
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  عضو معتمد
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
