import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TechnicalGrid } from '../../components/common/TechnicalGrid';
import { Logo } from '../../components/common/Logo';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);

  const validate = () => {
    if (!email.trim()) {
      setFieldError('EMAIL ADDRESS IS REQUIRED');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError('INVALID EMAIL FORMAT');
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    // Mock reset link generation
    setTimeout(() => {
      setIsLoading(false);
      // Simulate error if testing with specific keyword
      if (email.includes('error')) {
        setErrorMessage('Unable to dispatch security reset token. Please contact system admin.');
      } else {
        setIsSuccess(true);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      {/* 70% Area: Day Zero Branding & Blueprint Atmosphere */}
      <section className="login-hero-area">
        <TechnicalGrid />

        <div className="login-hero-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Logo size={28} showText />
            <span className="tech-coord">RECOVERY PROTOCOL</span>
          </div>

          <AdminBadge variant="outline">RESTRICTED</AdminBadge>
        </div>

        <div className="login-hero-center">
          <div className="tech-label" style={{ color: 'var(--dz-text-muted)' }}>
            CREDENTIAL OVERRIDE
          </div>
          <h1 className="login-hero-headline">RESET ACCESS</h1>
          <p className="login-hero-subtext">
            Security tokens are dispatched only to verified operator domains. Ensure you
            have active hardware authentication ready upon reception.
          </p>
        </div>

        <div className="login-hero-bottom">
          <span className="tech-coord">SYS_ID: DZ-REC-01</span>
          <span className="tech-coord">ENCRYPTION: RSA-4096</span>
        </div>
      </section>

      {/* 30% Area: Form Box */}
      <section className="login-form-area">
        <div className="login-form-box">
          <div className="login-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={16} color="var(--dz-accent)" />
              <h2 className="login-form-title">FORGOT PASSWORD</h2>
            </div>
            <p className="subhead">Enter your operator email to request a reset link.</p>
          </div>

          {errorMessage && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '20px',
                backgroundColor: 'var(--dz-bg-surface-elevated)',
                border: '1px solid var(--dz-border-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="var(--dz-status-operational)" />
                <span
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--dz-status-operational)',
                    fontWeight: 600,
                  }}
                >
                  DISPATCH CONFIRMED
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--dz-text-muted)', lineHeight: 1.6 }}>
                A password reset token has been dispatched to <code style={{ color: 'var(--dz-text-primary)' }}>{email}</code>.
                The token will expire in 15 minutes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <Link to="/admin/login">
                  <AdminButton variant="primary" size="md" isFullWidth>
                    Return to Sign In
                  </AdminButton>
                </Link>
                <AdminButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                >
                  Request another link
                </AdminButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                id="reset-email"
                type="email"
                label="VERIFIED OPERATOR EMAIL"
                placeholder="operator@dayzero.internal"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(undefined);
                }}
                error={fieldError}
                leftIcon={<Mail size={16} />}
                isMono
                required
                disabled={isLoading}
                autoComplete="email"
              />

              <AdminButton
                type="submit"
                variant="primary"
                size="md"
                isFullWidth
                isLoading={isLoading}
              >
                Send reset link
              </AdminButton>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--dz-text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  <ArrowLeft size={12} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
