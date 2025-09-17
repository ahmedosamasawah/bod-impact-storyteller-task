import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/constants/copy";
import { Settings as SettingsIcon, Server, Info } from "lucide-react";

const Settings = () => {
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl bod-heading flex items-center gap-2">
            <SettingsIcon className="size-8 text-primary" />
            {COPY.SETTINGS.PAGE.title}
          </h1>
          <p className="bod-subtitle text-sm sm:text-base max-w-2xl">
            {COPY.SETTINGS.PAGE.subtitle}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="size-5 text-primary" />
              {COPY.SETTINGS.SECTIONS.apiConfig}
            </CardTitle>
            <CardDescription>
              إعدادات وحالة اتصال API مع MockAPI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">حالة الاتصال الحالية</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MockAPI:</span>
                      <Badge variant="default" className="gap-1 flex">
                        <div className="size-2 bg-green-500 rounded-full"></div>
                        متصل
                      </Badge>
                    </div>
                    
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">آخر عملية مزامنة</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      المشاريع:{" "}
                      <span className="text-foreground">
                        منذ {Math.floor(Math.random() * 5) + 1} دقائق
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      أعضاء الفريق:{" "}
                      <span className="text-foreground">
                        منذ {Math.floor(Math.random() * 3) + 1} دقائق
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      المقاييس:{" "}
                      <span className="text-foreground">
                        منذ {Math.floor(Math.random() * 10) + 1} ثواني
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-medium">تفاصيل التكوين</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الوضع الحالي:</span>
                    <code className="px-2 py-1 bg-muted rounded">MockAPI</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base URL</span>
                    <code className="px-2 py-1 bg-muted rounded text-xs">
                      mockapi.io/api/v1
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      مهلة الاستجابة:
                    </span>
                    <span>5 ثوان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      إعادة المحاولة:
                    </span>
                    <span>2 مرات</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-blue-900 dark:text-blue-100">
                      معلومات للمراجعين
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      التطبيق يستخدم MockAPI كمصدر أساسي للبيانات.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;
