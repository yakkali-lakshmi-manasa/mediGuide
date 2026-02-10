import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, actualTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: 'Symptom Check', path: '/assessment' },
    { name: 'Hospital Finder', path: '/hospitals' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return actualTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
    return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition-opacity"
          >
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="gradient-text">MediGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Disclaimer Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Disclaimer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Medical Disclaimer</DialogTitle>
                  <DialogDescription>
                    Important information about using MediGuide
                  </DialogDescription>
                </DialogHeader>
                <MedicalDisclaimer />
              </DialogContent>
            </Dialog>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="ml-2"
              title={`Current theme: ${getThemeLabel()}`}
            >
              {getThemeIcon()}
              <span className="ml-2 text-sm">{getThemeLabel()}</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Current theme: ${getThemeLabel()}`}
            >
              {getThemeIcon()}
            </Button>

            {/* Mobile Menu Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" fill="currentColor" />
                    <span className="gradient-text">MediGuide</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Disclaimer Dialog Mobile */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="justify-start px-4 py-3 h-auto text-base font-medium"
                      >
                        Disclaimer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Medical Disclaimer</DialogTitle>
                        <DialogDescription>
                          Important information about using MediGuide
                        </DialogDescription>
                      </DialogHeader>
                      <MedicalDisclaimer />
                    </DialogContent>
                  </Dialog>

                  {/* Theme Info Mobile */}
                  <div className="px-4 py-3 border-t mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Theme</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">{getThemeLabel()} Mode</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                      >
                        {getThemeIcon()}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
