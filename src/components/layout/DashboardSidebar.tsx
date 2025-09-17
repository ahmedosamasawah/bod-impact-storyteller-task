import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Target,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const navigationItems = [
  {
    title: "لوحة المتابعة",
    url: "/",
    icon: BarChart3,
    description: "نظرة عامة على لوحة التحكم",
  },
  {
    title: "مقاييس الأثر",
    url: "/metrics",
    icon: Target,
    description: "متابعة مؤشرات الأثر الرئيسية",
  },
  {
    title: "المشاريع",
    url: "/projects",
    icon: FileText,
    description: "إدارة المشاريع النشطة",
  },
];

const managementItems = [
  {
    title: "الفريق",
    url: "/team-members",
    icon: Users,
    description: "إدارة أعضاء الفريق",
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
    description: "تفضيلات النظام",
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";

    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) =>
    cn(
      "w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium",
      "transition-all duration-200 hover:bg-sidebar-accent",
      isActive(path)
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
        : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
    );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center">
            <img
              src="/bod-logo.png"
              alt="BOD Logo"
              className="h-8 w-8 object-contain"
            />
          </div>
          {!isCollapsed && (
            <p className="text-xs text-sidebar-foreground/70">
              الاستشارات المهنية
            </p>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "px-3 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider",
              isCollapsed && "sr-only"
            )}
          >
            التحليلات
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={getNavClassName(item.url)}
                      title={isCollapsed ? item.title : item.description}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "px-3 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider",
              isCollapsed && "sr-only"
            )}
          >
            الإدارة
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(item.url)}
                      title={isCollapsed ? item.title : item.description}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg ",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {user.avatar ||
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user.role}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          className={`${
            isCollapsed && "w-fit self-center"
          } mt-2 justify-start gap-2 text-sidebar-foreground hover:text-red-500 text-red-400 px-2`}
          onClick={() => {
            logout();
            toast({
              title: "تم تسجيل الخروج بنجاح",
              description:
                "نراك قريباً! شكراً لاستخدام منصة ولادة حلم للاستشارات.",
            });
            navigate("/login");
          }}
        >
          <LogOut className="size-4" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
