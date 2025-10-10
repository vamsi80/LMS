"use client"

import {
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react"

import ThemeToggle from "@/components/ui/theme-toggle"
import UserMenu from "@/app/(main)/_components/user-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { authClient } from "@/lib/auth-clint"
import Link from "next/link"
import Image from "next/image"
const navigationLinks = [
  { href: "dashboard", label: "Dashboard", icon: HomeIcon, active: true },
  { href: "projects", label: "Projects", icon: LayersIcon },
  { href: "documentation", label: "Documentation", icon: FileTextIcon },
  { href: "team", label: "Team", icon: UsersIcon },
]

export default function Navbar() {

  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                          active={link.active}
                        >
                          <Icon
                            size={16}
                            className="text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="block relative h-10 md:h-16 lg:h-16 w-full max-w-[220px]">
              <Image src="/logo.png" alt="logo" fill className="object-contain" />
            </Link>
            {/* Desktop navigation - icon only */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
                <TooltipProvider>
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href={link.href}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${link.active ? "bg-accent text-accent-foreground" : ""
                              }`}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </TooltipTrigger>
                      </Tooltip>
                    </NavigationMenuItem>
                  ))}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />
          {isPending ? null : session ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="sign-in">Sign In</a>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <a href="#">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
