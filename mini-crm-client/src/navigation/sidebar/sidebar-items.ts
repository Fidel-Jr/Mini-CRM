import {
  Banknote,
  Bot,
  Brain,
  Calendar,
  ChartBar,
  Contact,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogIn,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Settings,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      // {
      //   title: "Default",
      //   url: "/dashboard/default",
      //   icon: LayoutDashboard,
      // },
      {
        title: "Dashboard",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      // {
      //   title: "Finance",
      //   url: "/dashboard/finance",
      //   icon: Banknote,
      // },
      // {
      //   title: "Analytics",
      //   url: "/dashboard/analytics",
      //   icon: Gauge,
      // },
      // {
      //   title: "Productivity",
      //   url: "/dashboard/productivity",
      //   icon: ListTodo,
      // },
      // {
      //   title: "E-commerce",
      //   url: "/dashboard/ecommerce",
      //   icon: ShoppingBag,
      // },
      // {
      //   title: "Academy",
      //   url: "/dashboard/academy",
      //   icon: GraduationCap,
      //   isNew: true,
      // },
      // {
      //   title: "Logistics",
      //   url: "/dashboard/logistics",
      //   icon: Forklift,
      // },
    ],
  },
  {
    id: 2,
    label: "CRM",
    items: [
      {
        title: "Customers",
        url: "/dashboard/customer",
        icon: Mail,
      },
      {
        title: "Contacts",
        url: "/dashboard/contact",
        icon: Contact,
      },
      {
        title: "Opportunities",
        url: "/dashboard/opportunity",
        icon: Calendar,
      },
      {
        title: "Notes",
        url: "/dashboard/note",
        icon: Kanban,
      },
      // {
      //   title: "Invoice",
      //   url: "/dashboard/coming-soon",
      //   icon: ReceiptText,
      //   comingSoon: true,
      // },
      // {
      //   title: "Users",
      //   url: "/dashboard/users",
      //   icon: Users,
      // },
      // {
      //   title: "Roles",
      //   url: "/dashboard/roles",
      //   icon: Lock,
      // },
      // {
      //   title: "Authentication",
      //   url: "/auth",
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: "Login v1", url: "/auth/v1/login", newTab: true },
      //     { title: "Login v2", url: "/auth/v2/login", newTab: true },
      //     { title: "Register v1", url: "/auth/v1/register", newTab: true },
      //     { title: "Register v2", url: "/auth/v2/register", newTab: true },
      //   ],
      // },
    ],
  },
  {
    id: 3,
    label: "Knowledge",
    items: [
      {
        title: "Knowledge Base",
        url: "/dashboard/knowledge-base",
        icon: Brain,
      },
      {
        title: "AI Assistant",
        url: "/dashboard/ai-chat",
        icon: Bot,
      },
    ],
  },
  {
    id: 4,
    label: "Admin",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Login",
        url: "/login",
        icon: LogIn,
      },
      {
        title: "Settings",
        url: "/dashboard/coming-soon",
        icon: Settings,
      },
    ],
  },
];
