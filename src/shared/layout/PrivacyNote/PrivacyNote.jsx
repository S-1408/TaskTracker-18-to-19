import styles from "./PrivacyNote.module.css";

function PrivacyNote() {
  return (
    <p className={styles.privacyNote}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <rect x="3" y="7" width="10" height="7" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </svg>
      Your tasks stay on this device.
    </p>
  );
}

export default PrivacyNote;
