import styles from "./AppHeader.module.css";

function AppHeader({ theme, onToggleTheme, onNavigateAuth }) {
  return (
    <header className={styles.topbar}>
      <a className={styles.brand} href="#" aria-label="Daymark home">
        <span className={styles.brandMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>daymark </span>
      </a>
      <span className={styles.topbarNote}>A little more focus, every day.</span>
      <nav className={styles.authNavigation} aria-label="Account">
        <button type="button" onClick={() => onNavigateAuth("login")}>
          Sign in
        </button>
        <button type="button" onClick={() => onNavigateAuth("signup")}>
          Sign up
        </button>
      </nav>
      <button
        className={styles.themeButton}
        type="button"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        aria-pressed={theme === "dark"}
        onClick={onToggleTheme}
      >
        {theme === "dark" ? "Light theme" : "Dark theme"}
      </button>
    </header>
  );
}

export default AppHeader;
