import styles from "./MobileBlocker.module.css";
import happyZigi from "../../../media/zigi-first.svg";

const MobileBlocker = () => {
    return (
        <div className={styles.mobileBlocker}>
            <div className={styles.mobileBox}>
                <h2>כיף לראות אתכם!</h2>
                <h3>שימו 🤎   שהלומדה אינה מותאמת לטלפון</h3>
                <p>כדי ללמוד יש להיכנס דרך המחשב </p>
                <img src={happyZigi} alt="happy zigi" className={styles.gal}/>
            </div>
        </div>
    );
}

export default MobileBlocker;