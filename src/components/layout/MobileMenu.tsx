import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Home, TreeDeciduous, ClipboardList, BookOpen, Scale, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { role, setRole } = useRole();

  const navItems = [
    {
      icon: Home,
      label: 'Dashboard',
      to: `/dashboard/${role}`,
      active: true,
    },
    {
      icon: TreeDeciduous,
      label: 'Decision Trees',
      to: '/decision-tree',
      active: true,
    },
    {
      icon: ClipboardList,
      label: 'Assessments',
      to: '#',
      active: false,
      comingSoon: true,
    },
    {
      icon: BookOpen,
      label: 'Learn',
      to: '#',
      active: false,
      comingSoon: true,
    },
    {
      icon: Scale,
      label: 'Rights',
      to: '#',
      active: false,
      comingSoon: true,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <nav className="p-4 space-y-2" role="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3 w-full">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
                {item.comingSoon && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
            );

            if (!item.active) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed"
                >
                  {content}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-light text-foreground font-medium'
                      : 'hover:bg-muted'
                  }`
                }
              >
                {content}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setRole(null);
              onClose();
            }}
          >
            Change Role
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
