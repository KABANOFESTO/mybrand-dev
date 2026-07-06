import { useState } from "react";
import "../../CSS/auth.css";
import logo from "/home.png";

const SOCIAL_PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
];

const validateLoginForm = ({ email, password }) => {
  if (!email.trim()) return "Please enter your email address.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
  if (!password) return "Please enter your password.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
};

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

// eslint-disable-next-line react/prop-types
function EyeIcon({ off }) {
  if (off) {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 2l12 12M6.5 6.7A2 2 0 0110 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4.1 4.5C2.8 5.4 1.8 6.6 1 8c1.5 2.5 4 4 7 4 1.2 0 2.4-.3 3.4-.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M7 4.1c.3 0 .7-.1 1-.1 3 0 5.5 1.5 7 4-.4.7-1 1.4-1.6 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8c1.5-2.5 4-4 7-4s5.5 1.5 7 4c-1.5 2.5-4 4-7 4s-5.5-1.5-7-4z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.58C14.79 12.65 15.68 10.6 15.68 8.18z" fill="#4285F4" />
    <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.77 4.77 0 01-7.1-2.5H1v2.06A8 8 0 008 16z" fill="#34A853" />
    <path d="M3.61 9.56A4.8 4.8 0 013.36 8c0-.54.09-1.07.25-1.56V4.38H1A8 8 0 000 8c0 1.29.31 2.51.86 3.59l2.75-2.03z" fill="#FBBC05" />
    <path d="M8 3.2c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 001 4.38L3.74 6.44A4.77 4.77 0 018 3.2z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect width="16" height="16" rx="3" fill="#1877F2" />
    <path d="M10.8 5.4H9.2c-.3 0-.4.1-.4.5v.9h2l-.3 2H8.8V14H6.6V8.8H5.4v-2h1.2V5.7C6.6 4.2 7.4 3.2 9 3.2c.7 0 1.8.1 1.8.1v1.9z" fill="white" />
  </svg>
);

const SOCIAL_ICONS = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
};

const CornerSVG = () => (
  <svg viewBox="0 0 100 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="corner-svg" aria-hidden="true">
    <rect x="0" y="0" width="38" height="26" rx="5" fill="#0f1218" stroke="rgba(91,140,222,0.2)" strokeWidth="0.5" />
    <line x1="38" y1="13" x2="100" y2="13" stroke="rgba(91,140,222,0.15)" strokeWidth="0.5" />
    <circle cx="44" cy="13" r="2.5" fill="#5b8cde" opacity="0.5" />
    <line x1="19" y1="26" x2="19" y2="68" stroke="rgba(91,140,222,0.15)" strokeWidth="0.5" />
    <circle cx="19" cy="32" r="2.5" fill="#5b8cde" opacity="0.5" />
    <circle cx="7" cy="9" r="1.5" fill="rgba(91,140,222,0.2)" />
    <circle cx="13" cy="9" r="1.5" fill="rgba(91,140,222,0.2)" />
    <circle cx="19" cy="9" r="1.5" fill="rgba(91,140,222,0.2)" />
    <circle cx="25" cy="9" r="1.5" fill="rgba(91,140,222,0.2)" />
  </svg>
);

function LoginPage() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue,
    }));

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const message = validateLoginForm(formValues);
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      alert(`Logged in as ${formValues.email}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (providerLabel) => {
    alert(`Redirecting to ${providerLabel} OAuth...`);
  };

  return (
    <section className="login-page">
      <div className="corner tl">
        <CornerSVG />
      </div>
      <div className="corner tr">
        <CornerSVG />
      </div>
      <div className="corner bl">
        <CornerSVG />
      </div>
      <div className="corner br">
        <CornerSVG />
      </div>

      <div className="login-card">
        <div className="logo-area">
          <div className="logo-pip-group" aria-hidden="true">
            <div className="pip pip-3" />
            <div className="pip pip-2" />
            <div className="pip pip-1" />
          </div>
          <a href="/" className="logo-box" aria-hidden="true">
            <div className="logo-box" aria-hidden="true">
              <img src={logo} alt="Logo" className="logo-img" />
            </div>
          </a>
          <div className="logo-pip-group logo-pip-group-reverse" aria-hidden="true">
            <div className="pip pip-3" />
            <div className="pip pip-2" />
            <div className="pip pip-1" />
          </div>
        </div>

        <header className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">
            Don&apos;t have an account yet? <a href="/signup">Sign up</a>
          </p>
        </header>

        {error ? (
          <div className="error-msg" role="alert">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleLogin} noValidate className="login-form">
          <label className="field-label" htmlFor="email">
            Email address
          </label>
          <div className="field-wrap">
            <span className="field-icon">
              <MailIcon />
            </span>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="Email address"
              value={formValues.email}
              onChange={updateField("email")}
              autoComplete="email"
            />
          </div>

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="field-wrap">
            <span className="field-icon">
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="field-input field-input-password"
              placeholder="Password"
              value={formValues.password}
              onChange={updateField("password")}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pwd-toggle"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          <div className="forgot-row">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-grid">
          {SOCIAL_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              className="btn-social"
              onClick={() => handleSocialLogin(provider.label)}
            >
              {SOCIAL_ICONS[provider.id]}
              {provider.label}
            </button>
          ))}
        </div>
        <p className="terms-note">
          By creating an account, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
