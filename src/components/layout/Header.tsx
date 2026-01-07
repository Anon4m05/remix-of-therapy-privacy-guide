import { Menu, Home, TreeDeciduous, Sparkles, FileText, BookOpen, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = () => {
    if (!role) return null;
    
    const roleConfig = {
      healthcare_provider: { emoji: '🏥', label: 'Healthcare Provider', className: 'bg-teal-light text-foreground' },
      patient_family: { emoji: '👤', label: 'Patient & Family', className: 'bg-purple-light text-foreground' },
      privacy_professional: { emoji: '🔒', label: 'Privacy Professional', className: 'bg-orange-light text-foreground' },
    };

    const config = roleConfig[role];
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.className}`}>
        <span>{config.emoji}</span>
        <span className="hidden sm:inline">{config.label}</span>
      </div>
    );
  };

  const handleLogoClick = () => {
    if (role) {
      navigate(`/dashboard/${role}`);
    } else {
      navigate('/');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', onClick: () => navigate(role ? `/dashboard/${role}` : '/select-role') },
    { icon: TreeDeciduous, label: 'Decision Trees', onClick: () => navigate('/decision-tree') },
    { icon: Sparkles, label: 'AI Decision Tree', onClick: () => navigate('/generate-decision-tree') },
    { icon: FileText, label: 'Document Analysis', onClick: () => navigate('/document-analysis') },
    { icon: BookOpen, label: 'Legislation', onClick: () => navigate('/learn') },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {role && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <button
              onClick={handleLogoClick}
              className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
            >
              Therapeutic Privacy Tool
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {getRoleBadge()}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="hover:bg-muted"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 z-[100] bg-popover border shadow-lg"
              >
                {menuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-3 cursor-pointer py-2.5 bg-popover hover:bg-accent focus:bg-accent"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                
                {role && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setRole(null)}
                      className="flex items-center gap-3 cursor-pointer py-2.5 text-muted-foreground bg-popover hover:bg-accent focus:bg-accent"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>Change Role</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
