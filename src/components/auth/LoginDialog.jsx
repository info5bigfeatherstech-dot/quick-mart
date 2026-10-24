import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogin } from '@/hooks/useLogin';
import { isValidIndianMobile } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';

import ResponsiveModal from '@/components/common/ResponsiveModal';
import { Button } from '@/components/ui/button';
import PhoneInput from '@/components/common/PhoneInput';

/**
 * LoginDialog using ResponsiveModal (Drawer on mobile, Dialog on desktop)
 * Large h-12 mobile input row, sticky bottom continue button
 */
const LoginDialog = () => {
  const navigate = useNavigate();
  const isLoginDialogOpen = useAuthStore((state) => state.isLoginDialogOpen);
  const closeLoginDialog = useAuthStore((state) => state.closeLoginDialog);

  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);

  const loginMutation = useLogin();

  useEffect(() => {
    if (isLoginDialogOpen) {
      setPhone('');
      setTouched(false);
    }
  }, [isLoginDialogOpen]);

  const isValid = isValidIndianMobile(phone);
  const showError = touched && phone.length > 0 && !isValid;
  const errorMessage = showError ? 'Enter a valid 10-digit mobile number' : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid || loginMutation.isPending) return;

    loginMutation.mutate(phone, {
      onSuccess: () => {
        closeLoginDialog();
        const redirect = useAuthStore.getState().redirectAfterLogin;
        if (redirect) {
          navigate(redirect);
          useAuthStore.getState().setRedirectAfterLogin(null);
        }
      },
    });
  };

  return (
    <ResponsiveModal
      open={isLoginDialogOpen}
      onOpenChange={(open) => !open && closeLoginDialog()}
    >
      <div className="flex flex-col items-center text-center pt-1 pb-3">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm mb-3">
          <Zap className="h-6 w-6 fill-current text-brand-yellow" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Login or Sign up
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Enter your mobile number to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <PhoneInput
            value={phone}
            onChange={(val) => {
              setPhone(val);
              if (!touched) setTouched(true);
            }}
            error={errorMessage}
            autoFocus
            disabled={loginMutation.isPending}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={!isValid || loginMutation.isPending}
          className="w-full h-12 rounded-xl text-sm font-bold tracking-wide"
        >
          {loginMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : (
            'Continue'
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-2">
          By continuing, you agree to our{' '}
          <Link
            to={ROUTES.TERMS_AND_CONDITIONS}
            onClick={closeLoginDialog}
            className="font-medium text-foreground underline hover:text-primary transition-colors"
          >
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link
            to={ROUTES.PRIVACY_POLICY}
            onClick={closeLoginDialog}
            className="font-medium text-foreground underline hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </ResponsiveModal>
  );
};

export default LoginDialog;
