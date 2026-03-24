import styles from '../../css/FullExpandedWindow.module.css';

function FrequentView({ frequentFunctions, recentFunctions, loading }) {
    return (
        <div className={styles.frequentFunctionsContainer}>
            <h2>자주 쓰는 기능</h2>

            {loading ? (
                <div className={styles.fewLoading}>로딩 중...</div>
            ) : (
                <>
                    <div className={styles.frequentFunctionsGrid}>
                        {frequentFunctions.map((func, index) => (
                            <div key={index} className={styles.functionCard}>
                                <div className={styles.functionIcon}>{func.icon}</div>
                                <div className={styles.functionTitle}>{func.title}</div>
                                <div className={styles.functionDescription}>{func.description}</div>
                                <div className={styles.functionShortcut}>{func.shortcut}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.recentFunctionsSection}>
                        <h3>최근 쓴 기능들</h3>
                        <p className={styles.subtitle}>가장 최근에 한 질문들</p>

                        <div className={styles.recentFunctionsList}>
                            {recentFunctions.map((func, index) => (
                                <div key={index} className={styles.recentFunctionItem}>
                                    <div className={styles.recentFunctionTitle}>{func.title}</div>
                                    <div className={styles.recentFunctionTime}>{func.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default FrequentView;
