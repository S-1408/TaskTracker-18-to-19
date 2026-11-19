import styles from "./AppHeader.module.css";

function AppHeader() {
  return (
    <header className={styles.topbar}>
      <a className={styles.brand} href="#" aria-label="Daymark home">
        <span className={styles.brandMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>daymark</span>
      </a>
      <span className={styles.topbarNote}>
        A little more focus, every day.
      </span>
    </header>
  );
}

export default AppHeader;
