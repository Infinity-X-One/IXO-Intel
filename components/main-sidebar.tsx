"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Bot, Network, Globe, Share2, FileUp, Database, Key, Home, Menu, TrendingUp } from "lucide-react"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Agentic Bots",
    icon: Bot,
    href: "/bots",
  },
  {
    title: "Predictions",
    icon: TrendingUp,
    href: "/predictions",
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

export function MainSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <MobileSidebarContent pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
        <DesktopSidebarContent pathname={pathname} />
      </div>
    </>
  )
}

function MobileSidebarContent({ pathname, setOpen }: { pathname: string; setOpen: (open: boolean) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neon flex items-center justify-center">
            <span className="text-black font-bold">X1</span>
          </div>
          <h1 className="text-lg font-bold">
            <span className="text-white">Infinity</span> <span className="neon-text">X</span>{" "}
            <span className="text-white">One</span> <span className="neon-text">Intelligence</span>
          </h1>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:text-neon hover:shadow-glow",
                pathname === item.href ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50",
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-neon" : "")} />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

function DesktopSidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neon flex items-center justify-center">
            <span className="text-black font-bold">X1</span>
          </div>
          <h1 className="text-lg font-bold">
            <span className="text-white">Infinity</span> <span className="neon-text">X</span>{" "}
            <span className="text-white">One</span> <span className="neon-text">Intelligence</span>
          </h1>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:text-neon hover:shadow-glow",
                pathname === item.href ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50",
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-neon" : "")} />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
