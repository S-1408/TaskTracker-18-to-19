import styles from "./PageIntro.module.css";

function PageIntro() {
  return (
    <div className={styles.intro}>
      <p className={styles.eyebrow}>YOUR SPACE TO GET THINGS DONE</p>
      <h1 id="page-title" className={styles.pageTitle}>
        Make today count.
      </h1>
      <p className={styles.introCopy}>
        One step at a time. Write it down, then make it happen.
      </p>
    </div>
  );
}

export default PageIntro;
