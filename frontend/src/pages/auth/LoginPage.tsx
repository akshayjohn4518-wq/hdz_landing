import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { TechnicalGrid } from '../../components/common/TechnicalGrid';
import { Logo } from '../../components/common/Logo';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminButton } from '../../components/ui/AdminButton';
import { Shield, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = 'OPERATOR USERNAME IS REQUIRED';
    }
    if (!password) {
      newErrors.password = 'SECURITY PASSPHRASE IS REQUIRED';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        showToast('SESSION INITIALIZED: ACCESS GRANTED', 'success');
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(result.error || 'Access denied.');
      }
    } catch {
      setErrorMessage('Communication error with authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 70% Area: Day Zero Branding & Blueprint Atmosphere */}
      <section className="login-hero-area">
        <TechnicalGrid />

        {/* Top bar with branding logo */}
        <div className="login-hero-top">
          <Logo size={28} showText />
        </div>

        {/* Center Editorial Headline and Atmosphere */}
        <div className="login-hero-center">
          <div className="tech-label" style={{ color: 'var(--dz-text-muted)' }}>
            CONTROL ARCHITECTURE
          </div>
          <h1 className="login-hero-headline">THE FIRST COMMIT</h1>
          <p className="login-hero-subtext">
            Centralized operations gateway for Day Zero digital assets, editorial releases,
            operational telemetry, and mission dispatch.
          </p>
        </div>

        {/* Bottom Technical Bar */}
        <div className="login-hero-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="tech-coord">SYS_ID: DZ-4409</span>
            <span className="tech-coord">SECURITY: ENCRYPTED</span>
          </div>
          <span className="tech-coord">DAY ZERO LABS © 2026</span>
        </div>
      </section>

      {/* 30% Area: Restrained Technical Admin Access Form */}
      <section className="login-form-area">
        <div className="login-form-box">
          <div className="login-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--dz-accent)" />
              <h2 className="login-form-title">ADMIN ACCESS</h2>
            </div>
            <p className="subhead">Enter operator credentials to authenticate.</p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="login-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AdminInput
              id="admin-username"
              label="OPERATOR IDENTIFIER"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              error={errors.username}
              isMono
              required
              disabled={isLoading}
              autoComplete="username"
            />

            <div>
              <AdminInput
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                label="SECURITY KEY"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                isMono
                required
                disabled={isLoading}
                autoComplete="current-password"
                rightIcon={
                  showPassword ? <EyeOff size={16} /> : <Eye size={16} />
                }
                onRightIconClick={() => setShowPassword(!showPassword)}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <Link
                  to="/admin/forgot-password"
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--dz-text-muted)',
                    letterSpacing: '0.04em',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <AdminButton
              type="submit"
              variant="primary"
              size="md"
              isFullWidth
              isLoading={isLoading}
              icon={<ArrowRight size={14} />}
              iconPosition="right"
            >
              Sign In
            </AdminButton>
          </form>
        </div>
      </section>
    </div>
  );
};
