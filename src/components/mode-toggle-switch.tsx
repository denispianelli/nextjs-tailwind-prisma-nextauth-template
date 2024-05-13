'use client';

import { Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function ModeToggleSwitch() {
  const { theme, setTheme } = useTheme();

  const handleModeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium " htmlFor="theme-toggle">
          Dark Mode
        </Label>
        <Switch
          checked={theme === 'dark'}
          id="theme-toggle"
          onCheckedChange={handleModeSwitch}
        />
      </div>
      <Moon size={20} />
    </div>
  );
}
