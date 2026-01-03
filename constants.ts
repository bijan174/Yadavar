
export const CATEGORY_LABELS: Record<string, string> = {
  Learning: 'یادگیری',
  Health: 'سلامت',
  Work: 'کاری',
  Personal: 'شخصی',
  Other: 'متفرقه'
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  Webinar: 'وبینار',
  Class: 'کلاس',
  Exam: 'آزمون',
  Meeting: 'جلسه'
};

export const WEEK_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

export const PERS_WEEK_DAYS = [6, 0, 1, 2, 3, 4, 5]; // Mapping JS getDay() to Persian week start (Sat=6)
