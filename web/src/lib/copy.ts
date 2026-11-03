/* All site copy, in both languages. In titles, *word* sets a word in gold
   and \n breaks the line. The wording follows the original site. */

export type Locale = "en" | "ar";

const en = {
  nav: { home: "Home", about: "About", voice: "Voice", work: "Work", contact: "Contact", book: "Get a demo", menu: "Menu", close: "Close" },
  theme: { toDark: "Dark mode", toLight: "Light mode", night: "Studio night" },
  lang: { next: "AR", label: "العربية" },
  hero: {
    hi: "Hi, I'm",
    first: "Jawad",
    last: "Khamaysa",
    role: "Voice-over artist & graphic designer",
    listen: "Hear samples",
    book: "Get a demo",
    portrait: "Jawad Khamaysa",
    spin: "Drag to spin",
    status: "Available · Palestine",
  },
  marquee: ["Commercial", "Narration", "Documentary", "Brand identity", "Print", "Motion", "Radio", "Education"],
  about: {
    label: "About",
    title: "Designer &\n*voice* artist.",
    p1: "Voice acting, brand identity and digital products. Ideas that land fast and clean.",
    yaml: { k: "Graduate of", v: "Youth Arab Media Leaders · UAE" },
    skillsTitle: "Skills",
    skills: ["Voice performance", "Graphic design", "Brand direction", "Videography"],
  },
  services: {
    label: "Services",
    title: "What I do.",
    items: [
      { title: "Voice over", line: "Arabic dialects", tags: ["Commercial", "Narration", "Documentary"] },
      { title: "Brand identity", line: "Logos to systems", tags: ["Logo", "Guidelines", "Print"] },
      { title: "Video", line: "Promos & reels", tags: ["Promo", "Reels", "Motion"] },
    ],
  },
  voice: {
    label: "Voice",
    title: "Listen. Then *decide.*",
    dialects: [
      { name: "Palestinian", level: "Native" },
      { name: "MSA", level: "Formal" },
      { name: "Egyptian", level: "On request" },
      { name: "Gulf", level: "On request" },
    ],
    dialectsTitle: "Dialects",
    formatsTitle: "Work types",
    formats: [
      ["Commercial", "Radio · TV"],
      ["Documentary", "Film"],
      ["E-learning", "Education"],
      ["Product", "App · SaaS"],
    ],
    cta: { title: "Need a *voice?*", more: "More samples", quote: "Get a quote" },
    studio: { title: "The studio", items: ["RØDE NT1 5th Gen", "Treated room", "Fast delivery", "Revisions included"] },
    all: "All samples",
    now: "Now playing",
    loaded: "In the deck",
    shelf: "Tapes",
    forward: "Forward 10 seconds",
  },
  work: { label: "Selected", title: "Beyond the *mic.*", all: "All projects", open: "Open", video: "Video" },
  motion: { label: "Films", title: "In *motion.*", play: "Play" },
  socials: {
    label: "Channels",
    title: "Follow the *work.*",
    open: "Open",
    cards: [
      { kicker: "YouTube", name: "Jawad Khamaysa", desc: "Samples and behind the scenes.", href: "https://www.youtube.com/@jawad_khamaysa" },
      { kicker: "Instagram", name: "@jawad.khamaysa", desc: "Clips and studio moments.", href: "https://www.instagram.com/jawad.khamaysa" },
    ],
  },
  contact: {
    label: "Contact",
    title: "Let's make it *heard.*",
    ready: { title: "Ready when\n*you are.*", sub: "Send a script. Get a demo back.", button: "Send a message" },
    reach: "Reach me",
    email: "Email",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    youtube: "YouTube",
    bottom: [
      ["Location", "Palestine"],
      ["Status", "Available for collaboration"],
      ["Specialty", "Voice · Design · Product"],
    ],
    copy: "Copy",
    copied: "Copied",
    copiedLive: "Email copied",
    select: "Ctrl C",
    selectedLive: "Email selected. Press Ctrl C to copy.",
  },
  footer: { rights: "© 2026 · Voice · Design · Palestine", top: "Back to top", credit: "" },
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
  dialect: "Palestinian",
  player: { play: "Play", pause: "Pause", back: "Back 10 seconds", mute: "Mute", seek: "Seek", loading: "Loading", error: "Tape won't play. Try again.", cantPlay: "Can't play" },
  viewer: { prev: "Previous page", next: "Next page", download: "Download PDF", close: "Close", of: "of" },
};

export type Copy = typeof en;

const ar: Copy = {
  nav: { home: "الرئيسية", about: "نبذة", voice: "الصوت", work: "الأعمال", contact: "تواصل", book: "اطلب نموذجًا", menu: "القائمة", close: "إغلاق" },
  theme: { toDark: "الوضع الداكن", toLight: "الوضع الفاتح", night: "الوضع الليلي" },
  lang: { next: "EN", label: "English" },
  hero: {
    hi: "أهلًا، أنا",
    first: "جواد",
    last: "خمايسة",
    role: "معلّق صوتي ومصمم جرافيكي",
    listen: "اسمع النماذج",
    book: "اطلب نموذجًا",
    portrait: "جواد خمايسة",
    spin: "اسحب للتدوير",
    status: "متاح · فلسطين",
  },
  marquee: ["إعلانات", "سرد", "وثائقيات", "هوية بصرية", "مطبوعات", "موشن", "إذاعة", "تعليم"],
  about: {
    label: "نبذة",
    title: "*معلّق صوتي*\nومصمم.",
    p1: "أشتغل على التعليق الصوتي والهوية البصرية والمنتجات الرقمية، لتوصل فكرتك بسرعة ووضوح.",
    yaml: { k: "خرّيج برنامج", v: "القيادات الإعلامية العربية الشابة · الإمارات" },
    skillsTitle: "المهارات",
    skills: ["الأداء الصوتي", "التصميم الجرافيكي", "بناء العلامات التجارية", "تصوير الفيديو"],
  },
  services: {
    label: "الخدمات",
    title: "ماذا أقدّم.",
    items: [
      { title: "تعليق صوتي", line: "لهجات عربية", tags: ["إعلانات", "سرد", "وثائقيات"] },
      { title: "هوية بصرية", line: "من الشعار للنظام", tags: ["شعار", "دليل", "مطبوعات"] },
      { title: "فيديو", line: "إعلانات وريلز", tags: ["إعلان", "ريلز", "موشن"] },
    ],
  },
  voice: {
    label: "الصوت",
    title: "اسمع، وبعدها *قرّر.*",
    dialects: [
      { name: "الفلسطينية", level: "لهجتي الأم" },
      { name: "الفصحى", level: "للأعمال الرسمية" },
      { name: "المصرية", level: "حسب المشروع" },
      { name: "الخليجية البيضاء", level: "حسب المشروع" },
    ],
    dialectsTitle: "اللهجات",
    formatsTitle: "أنواع الأعمال",
    formats: [
      ["إعلانات", "راديو وتلفزيون"],
      ["وثائقيات", "أفلام وبرامج"],
      ["محتوى تعليمي", "دورات وشروحات"],
      ["عروض منتجات", "تطبيقات ومنصّات"],
    ],
    cta: { title: "محتاج *صوت؟*", more: "نماذج أكثر", quote: "اطلب عرض سعر" },
    studio: { title: "الاستوديو", items: ["مايك RØDE NT1 الجيل الخامس", "غرفة معزولة صوتيًا", "تسليم سريع", "التعديلات مشمولة"] },
    all: "كل النماذج",
    now: "قيد التشغيل",
    loaded: "في المشغّل",
    shelf: "الأشرطة",
    forward: "تقديم ١٠ ثوانٍ",
  },
  work: { label: "مختارات", title: "أكثر من *مايك.*", all: "كل المشاريع", open: "فتح", video: "فيديو" },
  motion: { label: "فيديو", title: "صورة *وحركة.*", play: "تشغيل" },
  socials: {
    label: "القنوات",
    title: "تابع *شغلي.*",
    open: "افتح",
    cards: [
      { kicker: "YouTube", name: "Jawad Khamaysa", desc: "نماذج ولقطات من الكواليس.", href: "https://www.youtube.com/@jawad_khamaysa" },
      { kicker: "Instagram", name: "@jawad.khamaysa", desc: "مقاطع ولحظات من الاستوديو.", href: "https://www.instagram.com/jawad.khamaysa" },
    ],
  },
  contact: {
    label: "تواصل",
    title: "خلّي فكرتك *تنسمع.*",
    ready: { title: "جاهز\n*وقت ما بدك.*", sub: "ابعتلي النص، وبرجعلك بنموذج.", button: "راسلني" },
    reach: "تواصل معي",
    email: "البريد",
    whatsapp: "واتساب",
    instagram: "إنستغرام",
    youtube: "يوتيوب",
    bottom: [
      ["المكان", "فلسطين"],
      ["الحالة", "متاح للتعاون"],
      ["التخصص", "صوت · تصميم · منتجات رقمية"],
    ],
    copy: "نسخ",
    copied: "تم النسخ",
    copiedLive: "تم نسخ البريد",
    select: "Ctrl C",
    selectedLive: "تم تحديد البريد. اضغط Ctrl C للنسخ.",
  },
  footer: { rights: "© 2026 · صوت · تصميم · فلسطين", top: "إلى الأعلى", credit: "" },
  projects: {
    label: "الأعمال",
    title: "أعمال مختارة.",
    filters: { all: "الكل", brand: "هويات", print: "مطبوعات", motion: "فيديو", social: "منشورات" },
    cta: "عندك مشروع؟",
    soon: "أعمال جديدة قريبًا.",
    empty: "لا شيء هنا بعد.",
  },
  samples: {
    label: "مكتبة النماذج",
    title: "كل *النماذج.*",
    filters: { all: "الكل", commercial: "إعلانات", narration: "سرد" },
    cta: "محتاج تسجيل خاص؟",
  },
  cta: { button: "تواصل معي" },
  cat: { commercial: "إعلان", narration: "سرد" },
  dialect: "فلسطينية",
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
