import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeroSectionPurple from '@/components/graphics/HeroSectionPurple';
import HeroSectionYellow from '@/components/graphics/HeroSectionYellow';
import { useLogin } from '@/features/auth/hooks/useLogin';

export function LoginForm() {
  const [accessCode, setAccessCode] = useState('');
  const login = useLogin();

  const isSubmitting = login.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = accessCode.trim();
    if (!code) {
      toast.error('Please enter an access code');
      return;
    }

    try {
      await login.mutateAsync(code);
      toast.success('Welcome to KidAble!');
    } catch {
      toast.error('Invalid access code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B5B45]/5 via-white to-[#F4D16B]/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-20 pointer-events-none">
        <HeroSectionYellow />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <HeroSectionPurple />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-xl relative z-10">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-[#0B5B45] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">K</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to KidAble</CardTitle>
          <CardDescription className="text-base">Enter your staff access code to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Access Code Input */}
            <div className="space-y-2">
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                autoFocus
                className="text-center text-lg tracking-wider font-mono"
              />
              <p className="text-xs text-slate-500">Contact your administrator if you don&apos;t have an access code</p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#0B5B45] hover:bg-[#0D6953] h-11 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 size-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-[#F4D16B]/10 rounded-lg border border-[#F4D16B]/30">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Note:</span> Your access code provides secure entry to the KidAble Admin Panel. Keep
              it confidential and don&apos;t share it with others.
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">Need help accessing your account?</p>
            <a href="mailto:support@kidable.com" className="text-sm text-[#0B5B45] hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-slate-500">
        <p>&copy; 2024 KidAble. Empowering pediatric therapy.</p>
      </div>
    </div>
  );
}


