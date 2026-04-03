import { routes } from "@/constants/routes";
import * as Icons from "@/assets/icon/NavIcons";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
  items: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        url: routes.dashboard,
        icon: Icons.Dashboard,
        items: [],
      }
    ],
  },
];