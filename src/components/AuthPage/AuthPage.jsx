import { useId, useState } from "react";
import styles from "./AuthPage.module.css";

function AuthPage({ mode, onChangeMode, onBackToTasks }) {
  const fieldId = useId();
  const [message, setMessage] = useState("");
  const isSignUp = mode === "signup";

  function handleSubmit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    setMessage(
      "Authentication is not connected. Your credentials were not sent or saved.",
    );
  }

  return (
    <section className={styles.authPage} aria-labelledby={`${fieldId}-title`}>
      <div className={styles.authCard}>
        <p className={styles.eyebrow}>DAYMARK ACCOUNT</p>
        <h1 className={styles.title} id={`${fieldId}-title`}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className={styles.description}>
          {isSignUp
            ? "Create an account to keep your work together."
            : "Sign in to continue to your workspace."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignUp && (
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-name`}>Name</label>
              <input
                id={`${fieldId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-email`}>Email</label>
            <input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-password`}>Password</label>
            <input
              id={`${fieldId}-password`}
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">
            {isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        {message && (
          <p className={styles.notice} role="status">
            {message}
          </p>
        )}

        <p className={styles.switchMode}>
          {isSignUp ? "Already have an account?" : "New to Daymark?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMessage("");
              onChangeMode(isSignUp ? "login" : "signup");
            }}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
        <button
          className={styles.backButton}
          type="button"
          onClick={onBackToTasks}
        >
          Continue without an account
        </button>
      </div>
    </section>
  );
}

export default AuthPage;
