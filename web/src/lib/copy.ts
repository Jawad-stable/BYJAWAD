/* All site copy, in both languages. Kept deliberately short: labels and
   headlines are two or three words, and nothing uses dashes. */

export type Locale = "en" | "ar";

const en = {
  nav: { home: "Home", about: "About", voice: "Voice", work: "Work", contact: "Contact", book: "Get a demo", menu: "Menu", close: "Close" },
  theme: { toDark: "Dark mode", toLight: "Light mode", night: "Studio night" },
  lang: { next: "AR", label: "العربية" },
  hero: {
    status: "Available · Palestine",
    first: "Jawad",
    last: "Khamaysa",
    role: "Voice artist & designer",
    listen: "Hear my voice",
    book: "Get a demo",
    tagline: "Arabic voice over and brand design, from Palestine.",
    portrait: "Jawad Khamaysa",
    scroll: "Scroll",
    spin: "Drag to spin",
  },
  marquee: ["Commercial", "Narration", "Documentary", "Brand identity", "Print", "Motion", "Radio", "Education"],
  about: {
    label: "About",
    title: "Hi, I'm Jawad.",
    brief: "I'm an Arabic voice artist and brand designer from Palestine. I voice commercials and narration, and I design the identities, print and films they live in.",
    facts: [
      { k: "YAML graduate", v: "Youth Arab Media Leaders" },
      { k: "Voice", v: "Arabic & English" },
      { k: "Based in", v: "Palestine" },
    ],
    stats: { reads: "Voice reads", projects: "Design projects", films: "Films" },
  },
  services: {
    label: "Services",
    title: "What I do.",
    items: [
      { title: "Voice over", line: "Arabic & English", tags: ["Commercial", "Narration", "Documentary"] },
      { title: "Brand identity", line: "Logos to systems", tags: ["Logo", "Guidelines", "Print"] },
      { title: "Video", line: "Promos & reels", tags: ["Promo", "Reels", "Motion"] },
    ],
  },
  voice: { label: "Voice", title: "Listen first.", dialects: ["Levantine", "MSA", "Dialects"], all: "All samples", now: "Now playing", loaded: "In the deck", shelf: "Tapes", forward: "Forward 10 seconds" },
  work: { label: "Work", title: "Selected work.", all: "All projects", open: "Open", video: "Video" },
  motion: { label: "Films", title: "In motion.", play: "Play" },
  contact: {
    label: "Contact",
    title: "Let's talk.",
    sub: "Send a script or a brief. I'll send a demo back.",
    email: "Email",
    status: "Booking now",
    copy: "Copy email",
    copied: "Copied",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    youtube: "YouTube",
    copiedLive: "Email copied",
    select: "Press Ctrl C",
    selectedLive: "Email selected. Press Ctrl C to copy.",
    admit: "Admit one",
    sides: "Voice · Design",
  },
  footer: { rights: "© 2026 Jawad Khamaysa", top: "Back to top", credit: "" },
  projects: {
    label: "Portfolio",
    title: "Selected work.",
    filters: { all: "All", brand: "Branding", print: "Print", motion: "Motion", social: "Social" },
    cta: "Have a project?",
    soon: "New work soon.",
    empty: "Nothing here yet.",
  },
  samples: {
    label: "Voice library",
    title: "Hear the range.",
    filters: { all: "All", commercial: "Commercial", narration: "Narration" },
    cta: "Need a custom read?",
  },
  cta: { button: "Get in touch" },
  cat: { commercial: "Commercial", narration: "Narration" },
  dialect: "Levantine",
  player: { play: "Play", pause: "Pause", back: "Back 10 seconds", mute: "Mute", seek: "Seek", loading: "Loading", error: "Tape won't play. Try again.", cantPlay: "Can't play" },
  viewer: { prev: "Previous page", next: "Next page", download: "Download PDF", close: "Close", of: "of" },
};

export type Copy = typeof en;

const ar: Copy = {
  nav: { home: "الرئيسية", about: "من أنا", voice: "الصوت", work: "الأعمال", contact: "تواصل", book: "اطلب نموذجًا", menu: "القائمة", close: "إغلاق" },
  theme: { toDark: "الوضع الداكن", toLight: "الوضع الفاتح", night: "الوضع الليلي" },
  lang: { next: "EN", label: "English" },
  hero: {
    status: "متاح · فلسطين",
    first: "جواد",
    last: "خمايسة",
    role: "معلّق صوتي ومصمم",
    listen: "استمع لصوتي",
    book: "اطلب نموذجًا",
    tagline: "تعليق صوتي عربي وتصميم هويات، من فلسطين.",
    portrait: "جواد خمايسة",
    scroll: "مرّر",
    spin: "اسحب للتدوير",
  },
  marquee: ["إعلانات", "سرد", "وثائقيات", "هوية بصرية", "مطبوعات", "موشن", "إذاعة", "تعليم"],
  about: {
    label: "من أنا",
    title: "أهلًا، أنا جواد.",
    brief: "معلّق صوتي عربي ومصمم هويات من فلسطين. أؤدي الإعلانات والسرد، وأصمم الهويات والمطبوعات والأفلام التي تعيش فيها.",
    facts: [
      { k: "خريج YAML", v: "Youth Arab Media Leaders" },
      { k: "الصوت", v: "عربي وإنجليزي" },
      { k: "من", v: "فلسطين" },
    ],
    stats: { reads: "نماذج صوتية", projects: "مشاريع تصميم", films: "أفلام" },
  },
  services: {
    label: "الخدمات",
    title: "ماذا أقدّم.",
    items: [
      { title: "تعليق صوتي", line: "عربي وإنجليزي", tags: ["إعلانات", "سرد", "وثائقيات"] },
      { title: "هوية بصرية", line: "من الشعار للنظام", tags: ["شعار", "دليل", "مطبوعات"] },
      { title: "فيديو", line: "إعلانات وريلز", tags: ["إعلان", "ريلز", "موشن"] },
    ],
  },
  voice: { label: "الصوت", title: "استمع أولًا.", dialects: ["الشامية", "الفصحى", "لهجات"], all: "كل النماذج", now: "قيد التشغيل", loaded: "في المشغّل", shelf: "الأشرطة", forward: "تقديم ١٠ ثوانٍ" },
  work: { label: "الأعمال", title: "أعمال مختارة.", all: "كل المشاريع", open: "فتح", video: "فيديو" },
  motion: { label: "أفلام", title: "بالحركة.", play: "تشغيل" },
  contact: {
    label: "تواصل",
    title: "لنتحدّث.",
    sub: "أرسل نصًا أو فكرة، وأرسل لك نموذجًا.",
    email: "البريد",
    status: "متاح للحجز",
    copy: "نسخ البريد",
    copied: "تم النسخ",
    whatsapp: "واتساب",
    instagram: "إنستغرام",
    youtube: "يوتيوب",
    copiedLive: "تم نسخ البريد",
    select: "اضغط Ctrl C",
    selectedLive: "تم تحديد البريد. اضغط Ctrl C للنسخ.",
    admit: "دخول واحد",
    sides: "صوت · تصميم",
  },
  footer: { rights: "© 2026 جواد خمايسة", top: "إلى الأعلى", credit: "" },
  projects: {
    label: "الأعمال",
    title: "أعمال مختارة.",
    filters: { all: "الكل", brand: "هويات", print: "مطبوعات", motion: "فيديو", social: "منشورات" },
    cta: "لديك مشروع؟",
    soon: "أعمال جديدة قريبًا.",
    empty: "لا شيء هنا بعد.",
  },
  samples: {
    label: "مكتبة الصوت",
    title: "استمع للتنوّع.",
    filters: { all: "الكل", commercial: "إعلانات", narration: "سرد" },
    cta: "تحتاج قراءة خاصة؟",
  },
  cta: { button: "تواصل معي" },
  cat: { commercial: "إعلان", narration: "سرد" },
  dialect: "شامية",
  player: { play: "تشغيل", pause: "إيقاف", back: "رجوع ١٠ ثوانٍ", mute: "كتم الصوت", seek: "تقديم", loading: "جارٍ التحميل", error: "تعذّر تشغيل الشريط. حاول مجددًا.", cantPlay: "تعذّر التشغيل" },
  viewer: { prev: "الصفحة السابقة", next: "الصفحة التالية", download: "تحميل PDF", close: "إغلاق", of: "من" },
};

export const COPY: Record<Locale, Copy> = { en, ar };

export function pageCount(count: number, locale: Locale) {
  if (locale !== "ar") return `${count} page${count === 1 ? "" : "s"}`;
  if (count === 1) return "صفحة واحدة";
  if (count === 2) return "صفحتان";
  if (count <= 10) return `${count} صفحات`;
  return `${count} صفحة`;
}
