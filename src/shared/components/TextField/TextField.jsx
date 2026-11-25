import styles from "./TextField.module.css";

function TextField({ ref, ...props }) {
  return <input {...props} className={styles.input} ref={ref} />;
}

export default TextField;
