import { forwardRef } from "react";
import styles from "./TextField.module.css";

const TextField = forwardRef(function TextField(props, ref) {
  return <input {...props} className={styles.input} ref={ref} />;
});

export default TextField;
