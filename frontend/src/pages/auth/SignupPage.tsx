import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { TechnicalGrid } from '../../components/common/TechnicalGrid';
import { Logo } from '../../components/common/Logo';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminButton } from '../../components/ui/AdminButton';
import { Eye, EyeOff, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      name?: string;
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'OPERATOR NAME IS REQUIRED';
    }

    if (!username.trim()) {
      newErrors.username = 'OPERATOR IDENTIFIER IS REQUIRED';
    } else if (username.trim().length < 3) {
      newErrors.username = 'MINIMUM 3 CHARACTERS REQUIRED';
    }

    if (!email.trim()) {
      newErrors.email = 'CONTACT EMAIL IS REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'INVALID EMAIL FORMAT';
    }

    if (!password) {
      newErrors.password = 'SECURITY KEY IS REQUIRED';
    } else if (password.length < 6) {
      newErrors.password = 'MINIMUM 6 CHARACTERS REQUIRED';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'SECURITY KEYS DO NOT MATCH';
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
      const result = await signup({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        showToast('OPERATOR ACCOUNT INITIALIZED: CLEARANCE GRANTED', 'success');
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(result.error || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Communication error with authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 70% Hero Area: Day Zero Blueprint Atmosphere */}
      <section className="login-hero-area">
        <TechnicalGrid />

        <div className="login-hero-top">
          <Logo size={28} showText />
        </div>

        <div className="login-hero-center">
          <div className="tech-label" style={{ color: 'var(--dz-text-muted)' }}>
            OPERATOR ONBOARDING PROTOCOL
          </div>
          <h1 className="login-hero-headline">INITIALIZE ACCESS</h1>
          <p className="login-hero-subtext">
            Register new administrator credentials for Day Zero operations, telemetry verification,
            asset management, and mission deployment.
          </p>
        </div>

        <div className="login-hero-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="tech-coord">PROTOCOL: REG-01</span>
            <span className="tech-coord">AUTHENTICATION: SUPABASE-PG</span>
          </div>
          <span className="tech-coord">DAY ZERO LABS © 2026</span>
        </div>
      </section>

      {/* 30% Form Area: Admin Registration Form */}
      <section className="login-form-area" style={{ overflowY: 'auto' }}>
        <div className="login-form-box" style={{ maxWidth: '420px', width: '100%', padding: '24px 20px' }}>
          <div className="login-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={16} color="var(--dz-accent)" />
              <h2 className="login-form-title">REGISTER ADMIN</h2>
            </div>
            <p className="subhead">Create authorized operator credentials for portal access.</p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="login-error-banner" role="alert" style={{ marginBottom: '16px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AdminInput
              id="admin-signup-name"
              label="OPERATOR FULL NAME"
              placeholder="e.g. Alex Vance"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              required
              disabled={isLoading}
              autoComplete="name"
            />

            <AdminInput
              id="admin-signup-username"
              label="OPERATOR IDENTIFIER (USERNAME)"
              placeholder="e.g. alex_vance"
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

            <AdminInput
              id="admin-signup-email"
              type="email"
              label="OFFICIAL EMAIL ADDRESS"
              placeholder="e.g. alex@dayzero.internal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              isMono
              required
              disabled={isLoading}
              autoComplete="email"
            />

            <AdminInput
              id="admin-signup-password"
              type={showPassword ? 'text' : 'password'}
              label="SECURITY KEY (PASSPHRASE)"
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
              autoComplete="new-password"
              rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <AdminInput
              id="admin-signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              label="CONFIRM SECURITY KEY"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              isMono
              required
              disabled={isLoading}
              autoComplete="new-password"
            />

            <AdminButton
              type="submit"
              variant="primary"
              size="md"
              isFullWidth
              isLoading={isLoading}
              icon={<ArrowRight size={14} />}
              iconPosition="right"
              style={{ marginTop: '8px' }}
            >
              Initialize Admin Account
            </AdminButton>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--dz-text-muted)' }}>
                Already an authorized operator?{' '}
              </span>
              <Link
                to="/admin/login"
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--dz-accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
