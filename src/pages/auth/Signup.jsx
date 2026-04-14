import PropTypes from "prop-types";
import { useState } from "react";
import "../../CSS/auth.css";

const validateSignupForm = ({ fullName, email, password, confirmPassword }) => {
  if (!fullName.trim()) return "Please enter your full name.";
  if (!email.trim()) return "Please enter your email address.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
  if (!password) return "Please create a password.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
};

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.5 13c1.1-2.3 3-3.5 5.5-3.5S12.4 10.7 13.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

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

EyeIcon.propTypes = {
  off: PropTypes.bool.isRequired,
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

function SignupPage() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignup = async (event) => {
    event.preventDefault();

    const message = validateSignupForm(formValues);
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      alert(`Account created for ${formValues.fullName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page auth-page auth-page-signup">
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

      <div className="login-card auth-card auth-card-signup">
        <div className="logo-area">
          <div className="logo-pip-group" aria-hidden="true">
            <div className="pip pip-3" />
            <div className="pip pip-2" />
            <div className="pip pip-1" />
          </div>

          <div className="logo-box" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#5b8cde" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" stroke="#5b8cde" strokeWidth="1" opacity="0.45" />
              <circle cx="12" cy="12" r="2" fill="#5b8cde" />
              <line x1="12" y1="3" x2="12" y2="6" stroke="#5b8cde" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="12" y1="18" x2="12" y2="21" stroke="#5b8cde" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="3" y1="12" x2="6" y2="12" stroke="#5b8cde" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <line x1="18" y1="12" x2="21" y2="12" stroke="#5b8cde" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>

          <div className="logo-pip-group logo-pip-group-reverse" aria-hidden="true">
            <div className="pip pip-3" />
            <div className="pip pip-2" />
            <div className="pip pip-1" />
          </div>
        </div>

        <header className="login-header">
          <h1 className="login-title">Create Account</h1>
          <p className="login-sub">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </header>

        {error ? (
          <div className="error-msg" role="alert">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSignup} noValidate className="login-form">
          <label className="field-label" htmlFor="fullName">
            Full name
          </label>
          <div className="field-wrap">
            <span className="field-icon">
              <UserIcon />
            </span>
            <input
              id="fullName"
              type="text"
              className="field-input"
              placeholder="Full name"
              value={formValues.fullName}
              onChange={updateField("fullName")}
              autoComplete="name"
            />
          </div>

          <label className="field-label" htmlFor="signupEmail">
            Email address
          </label>
          <div className="field-wrap">
            <span className="field-icon">
              <MailIcon />
            </span>
            <input
              id="signupEmail"
              type="email"
              className="field-input"
              placeholder="Email address"
              value={formValues.email}
              onChange={updateField("email")}
              autoComplete="email"
            />
          </div>

          <div className="auth-split-fields">
            <div>
              <label className="field-label" htmlFor="signupPassword">
                Password
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <LockIcon />
                </span>
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  className="field-input field-input-password"
                  placeholder="Create password"
                  value={formValues.password}
                  onChange={updateField("password")}
                  autoComplete="new-password"
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
            </div>

            <div>
              <label className="field-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <LockIcon />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="field-input field-input-password"
                  placeholder="Repeat password"
                  value={formValues.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showConfirmPassword} />
                </button>
              </div>
            </div>
          </div>

          <p className="auth-helper-text">Use at least 6 characters with a mix of letters and numbers.</p>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="terms-note">
          By creating an account, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
