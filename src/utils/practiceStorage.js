
/* ==========================================
   WAREHOUSE COURSE - PROGRESS STORAGE
   שמירת התקדמות הלומדה ושני התרגולים
========================================== */

// מפתחות נפרדים לכל חלק בלומדה
export const STORAGE_KEYS = {
  course: "til-warehouse-course-v1",
  firstPractice: "til-warehouse-first-practice-v1",
  secondPractice: "til-warehouse-second-practice-v1",
};

/* ==========================================
   READ PROGRESS
   טעינת מידע שמור
========================================== */

export function readStoredObject(key) {
  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const value = JSON.parse(raw);

    return value &&
      typeof value === "object" &&
      !Array.isArray(value)
      ? value
      : null;

  } catch {
    return null;
  }
}

/* ==========================================
   SAVE PROGRESS
   שמירת מידע בדפדפן
========================================== */

export function writeStoredObject(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch {
    // אם הדפדפן חוסם שמירה,
    // הלומדה תמשיך לפעול כרגיל.
  }
}

/* ==========================================
   RESET PROGRESS
   מחיקת ההתקדמות בעת התחלה מחדש
========================================== */

export function clearWarehouseProgress() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });

  } catch {
    // אם לא ניתן לגשת לאחסון,
    // נמנע משגיאה שתעצור את הלומדה.
  }
}
