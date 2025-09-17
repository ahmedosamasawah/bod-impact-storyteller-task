import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowRight, AlertTriangle, Search, Map } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/bod-logo.png"
              alt="BOD Logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl bod-heading text-primary">
              ولادة حلم الاستشارية
            </h1>
          </div>
        </div>

        <Card className="card-bod-feature shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-destructive/10 border-2 border-destructive/20">
                <AlertTriangle className="size-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-6xl sm:text-8xl font-bold numbers text-primary mb-2 text-center">
              404
            </CardTitle>
            <CardDescription className="text-xl sm:text-2xl bod-heading text-foreground/80">
              عذراً، الصفحة المطلوبة غير موجودة
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="bod-subtitle text-base sm:text-lg max-w-md mx-auto">
                يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح أو تم نقل الصفحة
                إلى موقع آخر.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Map className="size-4" />
                <span className="numbers ltr">المسار: {location.pathname}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="btn-bod-secondary flex-1 sm:flex-none"
                size="lg"
              >
                <ArrowRight className="size-5 mr-2" />
                العودة للخلف
              </Button>
              <Button
                onClick={handleGoHome}
                className="btn-bod-primary flex-1 sm:flex-none"
                size="lg"
              >
                <Home className="size-5 mr-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Home className="size-5 text-primary" />
                  </div>
                  <h3 className="bod-title text-sm">الصفحة الرئيسية</h3>
                  <p className="text-xs text-muted-foreground">
                    لوحة المتابعة والمقاييس
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Search className="size-5 text-primary" />
                  </div>
                  <h3 className="bod-title text-sm">البحث</h3>
                  <p className="text-xs text-muted-foreground">
                    ابحث في المشاريع والبيانات
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mx-auto">
                    <AlertTriangle className="size-5 text-primary" />
                  </div>
                  <h3 className="bod-title text-sm">الدعم الفني</h3>
                  <p className="text-xs text-muted-foreground">
                    تواصل مع فريق الدعم
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 text-xs text-muted-foreground">
              © 2024 ولادة حلم الاستشارية - جميع الحقوق محفوظة
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
