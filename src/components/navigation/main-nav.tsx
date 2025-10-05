'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell,
  BookOpen,
  Building2,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  User as UserIcon,
  Users,
  FileText,
  BarChart3,
  Search,
  Upload,
  Brain,
  Award,
  Menu,
  X
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import type { User, UserRole } from '@/types';

interface MainNavProps {
  user: User | null;
  notifications?: number;
  onLogout: () => void;
}

const getNavigationItems = (role: UserRole) => {
  const baseItems = [
    { href: '/', label: 'Home', icon: Home },
  ];

  switch (role) {
    case 'student':
      return [
        ...baseItems,
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/internships', label: 'Internships', icon: GraduationCap },
        { href: '/logbook', label: 'Digital Logbook', icon: BookOpen },
        { href: '/files', label: 'File Management', icon: Upload },
        { href: '/skills-assessment', label: 'Skills Assessment', icon: Brain },
        { href: '/credits', label: 'Credit Integration', icon: Award },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    
    case 'faculty':
      return [
        ...baseItems,
        { href: '/faculty/dashboard', label: 'Dashboard', icon: Home },
        { href: '/faculty/students', label: 'Students', icon: Users },
        { href: '/faculty/internships', label: 'Internships', icon: GraduationCap },
        { href: '/faculty/reports', label: 'Reports', icon: FileText },
        { href: '/faculty/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    
    case 'admin':
      return [
        ...baseItems,
        { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
        { href: '/admin/companies', label: 'Companies', icon: Building2 },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    
    case 'industry_partner':
      return [
        ...baseItems,
        { href: '/company/dashboard', label: 'Dashboard', icon: Home },
        { href: '/company/internships', label: 'Internship Programs', icon: GraduationCap },
        { href: '/company/applications', label: 'Applications', icon: FileText },
        { href: '/company/mentoring', label: 'Mentoring', icon: Users },
        { href: '/company/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    
    default:
      return baseItems;
  }
};

export function MainNav({ user, notifications = 0, onLogout }: MainNavProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">Prashiskshan</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search or other components can go here */}
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-2 space-y-2">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  const navigationItems = getNavigationItems(user.role);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold text-sm sm:text-base">Prashiskshan</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" className="relative" asChild>
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center min-w-4"
                  >
                    {notifications > 99 ? '99+' : notifications}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="w-fit text-xs">
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background shadow-lg">
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navigationItems.map((item) => (
                <Button 
                  key={item.href}
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start h-12 text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </Button>
              ))}
              <div className="border-t pt-3 mt-3">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start h-12 text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/profile" className="flex items-center">
                    <UserIcon className="mr-3 h-5 w-5" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start h-12 text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-3 h-5 w-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-sm font-medium">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
