import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  Landmark,
  ArrowLeftRight,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Facturas", url: "/facturas", icon: FileText },
  { title: "Conciliación", url: "/conciliacion", icon: ArrowLeftRight },
  { title: "DIAN", url: "/dian", icon: Shield },
];

const catalogItems = [
  { title: "Terceros", url: "/terceros", icon: Users },
  { title: "Plan de Cuentas", url: "/cuentas", icon: BookOpen },
  { title: "Bancos", url: "/bancos", icon: Landmark },
];

const configItems = [
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const renderItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive(item.url)}>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className="hover:bg-sidebar-accent/60"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
            IA
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">
                IntegrIAPP
              </span>
              <span className="text-[10px] text-sidebar-foreground/50">
                Contabilidad Colombia
              </span>
            </div>
          )}
        </div>

        {/* Main */}
        {!collapsed && <div className="sidebar-section-label">Principal</div>}
        <SidebarGroup>
          <SidebarGroupContent>{renderItems(mainItems)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Catalogs */}
        {!collapsed && <div className="sidebar-section-label">Catálogos</div>}
        <SidebarGroup>
          <SidebarGroupContent>{renderItems(catalogItems)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Config */}
        {!collapsed && <div className="sidebar-section-label">Sistema</div>}
        <SidebarGroup>
          <SidebarGroupContent>{renderItems(configItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Cerrar sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
