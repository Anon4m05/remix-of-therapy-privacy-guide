import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const { role } = useRole();
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
          
          {getRoleBadge()}
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
