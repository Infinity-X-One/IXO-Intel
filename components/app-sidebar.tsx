"use client"

import { Building2, Bot, Network, Globe, Share2, FileUp, Database, Key, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Industry Intelligence",
    icon: Building2,
    href: "/industry-intelligence",
  },
  {
    title: "AI Agent Builder",
    icon: Bot,
    href: "/agent-builder",
  },
  {
    title: "Hierarchy Tree",
    icon: Network,
    href: "/hierarchy-tree",
  },
  {
    title: "Web Scraper Tool",
    icon: Globe,
    href: "/web-scraper",
  },
  {
    title: "Data Output Mapper",
    icon: Share2,
    href: "/output-mapper",
  },
  {
    title: "File Knowledge Uploader",
    icon: FileUp,
    href: "/file-uploader",
  },
  {
    title: "Storage",
    icon: Database,
    href: "/storage",
  },
  {
    title: "API Access",
    icon: Key,
    href: "/api-access",
  },
]

interface AppSidebarProps {
  isMobile?: boolean
}

export function AppSidebar({ isMobile = false }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className={`shrink-0 flex-none ${isMobile ? "w-full" : ""}`} collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neon flex items-center justify-center">
            <span className="text-black font-bold">X1</span>
          </div>
          <h1 className="text-lg font-bold">
            <span className="text-white">Infinity</span> <span className="neon-text">X</span>{" "}
            <span className="text-white">One</span> <span className="neon-text">Intelligence</span>
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="hover:text-neon hover:shadow-glow"
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className={pathname === item.href ? "text-neon" : ""} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
