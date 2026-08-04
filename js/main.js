/* ── LOCALE ── */
const LOCALE_KEY = 'siteLocale';
const initialLocale = localStorage.getItem(LOCALE_KEY) || ((navigator.language || '').slice(0, 2).toLowerCase() === 'ar' ? 'ar' : 'en');

const resources = {
  en: {
    translation: {
      meta: {
        home: { title: 'Jawad Khamaysa — Voice-Over Artist & Graphic Designer' },
        projects: { title: 'All Projects — Jawad Khamaysa' },
        samples: { title: 'Voice Samples — Jawad Khamaysa' }
      },
      nav: ['About', 'Projects', 'Samples', 'Socials', 'Contact'],
      toggle: 'AR', book: 'Book a Session',
      home: {
        hero: {
          availability: 'Available for Selected Projects · From Palestine <svg class="chip-pin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>',
          name: 'Jawad Khamaysa', role: 'Voice-Over Artist & Graphic Designer',
          headline: 'Hi, I\'m',
          samples: 'Hear Samples ↓', book: 'Book a Session'
        },
        about: {
          chip: 'About',
          title: 'Designer & voice artist. </br> I build clear <span class="hg">experiences</span> with voice.',
          p1: 'I work between voice acting, visual identity, and digital product design. My goal: the idea arrives quickly and professionally.',
          p2: 'I treat every project as a story that needs the right voice, a strong image, and tidy execution that serves the goal without complication.',
          skills: ['Voice Performance', 'Graphic Design', 'Brand Direction', 'Videography'],
          products: [
            { status: 'Active', title: 'Grafly', desc: 'Arabic-first design education app' },
            { status: 'Brand', title: 'Ratteb Omorak', desc: 'Cleaning services brand' }
          ]
        },
        voice: {
          chip: 'Voice',
          title: 'Listen. Then <span class="hw">decide.</span>',
          sub: 'Two strong samples are enough for the first impression. The full library is on the samples page.',
          langs: ['Levantine', 'MSA', 'Arabic Dialects'],
          levels: ['Arabic Dialect', 'Formal Arabic', 'Regional Variations'],
          formats: [['Commercial', 'Radio · TV'], ['Documentary', 'Film'], ['E-Learning', 'Education'], ['Product', 'App · SaaS']],
          samples: [
            { label: 'Sample 01 · Arabic Commercial', title: 'Ratteb Omorak', sub: 'Radio Spot · Levantine Arabic' },
            { label: 'Sample 02 · Arabic Narration', title: 'Companion to the Top', sub: 'Motivational Narration · Levantine Arabic' }
          ],
          cta: {
            title: 'Need a <span class="hw">voice</span><br/>for your project?',
            sub: 'Commercial · Documentary · Educational · Product demos in Arabic & English.',
            button: 'More Samples', secondary: 'Get a Quote'
          },
          studio: {
            title: 'The Studio',
            items: ['Home studio · Pro-grade mic', 'Clean, treated recording', 'Quick turnaround', 'Revisions included']
          },
          stat: 'Bilingual',
          formatsTitle: 'Work Types'
        },
        work: {
          chip: 'Selected',
          title: 'Beyond the <span class="hm">mic.</span>',
          all: 'All Projects',
          featured: [
            { meta: '01 — Featured Product', title: '<span class="hw">Grafly</span>', desc: 'An Arabic-first design learning platform, built as a path that is practical and engaging at the same time.', tags: ['Product', 'Arabic-First', 'Education'] },
            { meta: '02 — Brand Identity', title: 'Ratteb Omorak', desc: '"We care about what you can\'t see." Full brand system for a cleaning-services company — logo, color, and guidelines.', tags: ['Identity', 'Guidelines'] }
          ]
        },
        socials: {
          chip: 'Channels',
          title: 'Watch the work.<br/><span class="hm">And follow the process.</span>',
          sub: 'Voice clips, work notes, and short updates from the studio and daily life.',
          cards: [
            { kicker: 'YouTube', name: 'Jawad Khamaysa', desc: 'Longer samples, project breakdowns, and behind-the-scenes moments.', arr: 'Open' },
            { kicker: 'Instagram', name: '@jawad.khamaysa', desc: 'Short samples, visual work, studio moments, and quick updates.', arr: 'Open' }
          ]
        },
        contact: {
          chip: 'Contact',
          title: 'Let\'s make the idea <span class="hw">heard.</span>',
          sub: 'Book a session, request a custom read, or open the door to a new project.',
          findMe: 'Reach Me',
          cta: {
            title: 'Ready when<br/><span class="hw">you are.</span>',
            sub: 'Quick turnaround, clean delivery, revisions included. Let\'s make the read land exactly where it should.',
            button: 'Send a Message ↗'
          },
          labels: ['Email', 'Instagram', 'YouTube', 'WhatsApp'],
          values: ['jawad.kh.vo@gmail.com', '@jawad.khamaysa', 'Jawad Khamaysa', '+972 595 540 726'],
          bottom: [['Location', '<svg style="display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>Palestine'], ['Status', 'Available for Collaboration'], ['Specialty', 'Voice · Design · Product']]
        },
        footer: '© 2026 · Voice · Design · Palestine',
        marquee: ['Commercial', 'Documentary', 'E-Learning', 'Radio Spots', 'Product Demo', 'Brand Film', 'Narration', 'Arabic · العربية']
      },
      projects: {
        hero: {
          eyebrow: 'Portfolio',
          title: 'Brand, social<br>&amp; motion work.',
          sub: 'Visual identities, social media campaigns, and videography — crafted for clarity and lasting impact.',
          primary: 'Listen to Samples', secondary: 'Start a Project'
        },
        comingSoon: {
          badge: 'Working on it',
          title: 'Coming Soon',
          sub: 'New brand, social, and motion work is being prepared. In the meantime, listen to voice samples or start a conversation.',
          primary: 'Listen to Samples', secondary: 'Start a Project'
        }
      },
      samples: {
        hero: {
          eyebrow: 'Voice Sample Library',
          title: 'More range for serious clients.',
          sub: 'A dedicated listening page for clients who need more than two homepage highlights before booking a session.',
          primary: 'Request Custom Demo', secondary: 'View Projects'
        },
        cards: [
          { label: 'Arabic Commercial', title: 'Ratteb Omorak — Offices & Homes', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Arabic Commercial', title: 'Ratteb Omorak — Mosque', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Arabic Commercial', title: 'Ratteb Omorak — Faith & Cleanliness', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Arabic Narration', title: 'The Family', sub: 'Narration · Levantine Arabic' },
          { label: 'Arabic Narration', title: 'Companion to the Top', sub: 'Motivational narration · Levantine Arabic' }
        ]
      }
    }
  },
  ar: {
    translation: {
      meta: {
        home: { title: 'جواد خمايسة — صوت وتصميم' },
        projects: { title: 'المشاريع — جواد خمايسة' },
        samples: { title: 'نماذج صوتية — جواد خمايسة' }
      },
      nav: ['نبذة', 'المشاريع', 'النماذج', 'القنوات', 'تواصل'],
      toggle: 'EN', book: 'احجز جلسة',
      home: {
        hero: {
          availability: 'متاح لمشاريع مختارة · من فلسطين وإلى أي مكان',
          name: 'جــــــــــــــــــــــــــــواد خـــــمايـــــــــــسة',
          role: 'معلق صوتي ومصمم جرافيكي',
          headline: 'مرحباً، أنا',
          samples: 'اسمع النماذج ↓', book: 'احجز جلسة'
        },
        about: {
          chip: 'نبذة',
          title: 'مصمم ومعلّق صوتي <br/>أبني <span class="hg">تــجــارب</span> واضــحة<br/>بصوت وشكــل متقن.',
          p1: 'أعمل بين التعليق الصوتي، الهوية البصرية، وتصميم المنتجات الرقمية. هدفي: أن تصل الفكرة بسرعة وبأسلوب مهني.',
          p2: 'أتعامل مع كل مشروع كحكاية تحتاج صوتاً مناسباً، صورة قوية، وتنفيذاً مرتباً يخدم الهدف بدون تعقيد.',
          skills: ['الأداء الصوتي', 'التصميم الجرافيكي', 'توجيه الهوية', 'التصوير'],
          products: [
            { status: 'نشط', title: 'Grafly', desc: 'منصة تعليم تصميم بالعربية أولاً' },
            { status: 'علامة', title: 'رتّب أمورك', desc: 'هوية لخدمة تنظيف عملية وواضحة' }
          ]
        },
        voice: {
          chip: 'الصوت',
          title: 'اسمع، ثم <span class="hw">قرّر.</span>',
          sub: 'نماذجان قويان يكفيان للانطباع الأول. أما المكتبة الكاملة فموجودة في صفحة النماذج.',
          langs: ['لهجة شامية', 'فصحى', 'لهجات عربية'],
          levels: ['لهجة عربية', 'فصحى رسمية', 'لهجات متعددة'],
          formats: [['إعلانات', 'إذاعة · تلفاز'], ['وثائقيات', 'أفلام'], ['تعليم إلكتروني', 'تعليمي'], ['منتجات', 'تطبيقات · SaaS']],
          samples: [
            { label: 'النموذج 01 · إعلان عربي', title: 'رتّب أمورك', sub: 'إعلان إذاعي · لهجة شامية' },
            { label: 'النموذج 02 · سرد عربي', title: 'رفيق دربك نحو القمة', sub: 'سرد تحفيزي · لهجة شامية' }
          ],
          cta: {
            title: 'تحتاج <span class="hw">صوتًا</span><br/>لمشروعك؟',
            sub: 'إعلانات · وثائقيات · تعليم · عروض منتجات بالعربية والإنجليزية.',
            button: 'مزيد من النماذج', secondary: 'احصل على عرض'
          },
          studio: {
            title: 'الاستوديو',
            items: ['استوديو منزلي · مايك احترافي', 'تسجيل نظيف ومعالَج', 'تسليم سريع', 'تعديلات متضمنة']
          },
          stat: 'ثنائية اللغة',
          formatsTitle: 'أنواع الأعمال'
        },
        work: {
          chip: 'مختارات',
          title: 'أبعد من <span class="hm">المايك.</span>',
          all: 'كل المشاريع',
          featured: [
            { meta: '01 — منتج رئيسي', title: '<span class="hw">Grafly</span>', desc: 'منصة لتعلّم التصميم بالعربية أولاً، مبنية كمسار عملي وممتع في الوقت نفسه.', tags: ['منتج', 'عربي أولاً', 'تعليم'] },
            { meta: '02 — هوية بصرية', title: 'رتّب أمورك', desc: '"نهتم بما لا تراه." هوية بصرية كاملة لشركة خدمات تنظيف — شعار، ألوان، ودليل استخدام.', tags: ['هوية', 'دليل استخدام'] }
          ]
        },
        socials: {
          chip: 'القنوات',
          title: 'شاهد العمل.<br/><span class="hm">وتابع الطريقة.</span>',
          sub: 'مقاطع صوتية، ملاحظات عمل، وتحديثات قصيرة من الاستوديو والحياة اليومية.',
          cards: [
            { kicker: 'YouTube', name: 'Jawad Khamaysa', desc: 'نماذج أطول، تفكيك للمشاريع، ولحظات من خلف الكواليس.', arr: 'افتح' },
            { kicker: 'Instagram', name: '@jawad.khamaysa', desc: 'نماذج قصيرة، أعمال بصرية، ومشاهد من الاستوديو وتحديثات سريعة.', arr: 'افتح' }
          ]
        },
        contact: {
          chip: 'تواصل',
          title: 'خلّينا نخلي الفكرة <span class="hw">تنسمع.</span>',
          sub: 'احجز جلسة، اطلب قراءة خاصة، أو افتح الباب على مشروع جديد.',
          findMe: 'تواصل معي',
          cta: {
            title: 'جاهز<br/><span class="hw">لما تكون.</span>',
            sub: 'تنفيذ سريع، تسليم نظيف، وتعديلات محسوبة. نخلي القراءة توصل للمكان الصحيح.',
            button: 'أرسل رسالة ↗'
          },
          labels: ['البريد', 'إنستغرام', 'يوتيوب', 'واتساب'],
          values: ['jawad.kh.vo@gmail.com', '@jawad.khamaysa', 'Jawad Khamaysa', '+972 595 540 726'],
          bottom: [['المكان', '<svg style="display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>فلسطين'], ['الحالة', 'متاح للتعاون'], ['التخصص', 'صوت · تصميم · منتج']]
        },
        footer: '© 2026 · صوت · تصميم · فلسطين',
        marquee: ['إعلانات', 'وثائقيات', 'تعليم إلكتروني', 'إعلانات إذاعية', 'عروض منتجات', 'أفلام علامة', 'سرد', 'العربية']
      },
      projects: {
        hero: {
          eyebrow: 'الأعمال',
          title: 'هويات وسوشال<br>وأعمال الفيديو.',
          sub: 'هويات بصرية، حملات سوشال ميديا، وإنتاج فيديو — مصمَّمة بوضوح وأثر يدوم.',
          primary: 'استمع للنماذج', secondary: 'ابدأ مشروعًا'
        },
        comingSoon: {
          badge: 'جارٍ العمل عليه',
          title: 'قريبًا',
          sub: 'يجري حاليًا إعداد أعمال جديدة في الهوية البصرية والسوشال ميديا والفيديو. في هذه الأثناء، استمع إلى النماذج الصوتية أو ابدأ محادثة.',
          primary: 'استمع للنماذج', secondary: 'ابدأ مشروعًا'
        }
      },
      samples: {
        hero: {
          eyebrow: 'مكتبة النماذج الصوتية',
          title: 'نطاق أوسع للعملاء الجادين.',
          sub: 'صفحة استماع مخصصة للعملاء الذين يحتاجون أكثر من نموذجين قبل الحجز.',
          primary: 'طلب ديمو مخصص', secondary: 'عرض المشاريع'
        },
        cards: [
          { label: 'إعلان عربي', title: 'رتّب أمورك — بيوت ومكاتب', sub: 'إعلان إذاعي · لهجة شامية' },
          { label: 'إعلان عربي', title: 'رتّب أمورك — المسجد', sub: 'إعلان إذاعي · لهجة شامية' },
          { label: 'إعلان عربي', title: 'رتّب أمورك — لأن النظافة', sub: 'إعلان إذاعي · لهجة شامية' },
          { label: 'سرد عربي', title: 'العيلة', sub: 'سرد صوتي · لهجة شامية' },
          { label: 'سرد عربي', title: 'رفيق دربك نحو القمة', sub: 'سرد تحفيزي · لهجة شامية' }
        ]
      }
    }
  }
};

/* ── DOM HELPERS ── */
function setText(sel, val) { document.querySelectorAll(sel).forEach(el => el.textContent = val); }
function setHTML(sel, val) { document.querySelectorAll(sel).forEach(el => el.innerHTML = val); }
function setList(sel, vals, asHtml = false) {
  document.querySelectorAll(sel).forEach((el, i) => {
    if (vals[i] == null) return;
    if (asHtml) el.innerHTML = vals[i]; else el.textContent = vals[i];
  });
}
function setChip(sel, text) { setText(sel, text); }

/* ── PAGE UPDATES ── */
function updateCommon() {
  setList('.nlinks a', i18next.t('nav', { returnObjects: true }));
  setText('.ncta', i18next.t('book'));
  const toggle = document.querySelector('[data-lang-toggle]');
  if (toggle) {
    toggle.textContent = i18next.t('toggle');
    toggle.setAttribute('aria-label', i18next.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  }
  const menu = document.querySelector('.menu-toggle');
  if (menu) {
    menu.setAttribute('aria-label', i18next.language === 'ar' ? 'فتح القائمة' : 'Open navigation');
  }
  document.title = i18next.t(`meta.${document.body.dataset.page || 'home'}.title`);
}

function updateHome() {
  const hero = i18next.t('home.hero', { returnObjects: true });
  setHTML('.hero-chip', `<span class="adot"></span>${hero.availability}`);
  setText('.hero-name', hero.name);
  setText('.hero-name-sub', hero.role);
  setHTML('.hero-h', hero.headline);
  setText('.hero-btns .btn-gold', hero.samples);
  setText('.hero-btns .btn-ghost', hero.book);

  const marqueeItems = i18next.t('home.marquee', { returnObjects: true });
  const doubled = [...marqueeItems, ...marqueeItems].slice(0, 16);
  setList('.mq .mqi', doubled.map(item => `${item}<span class="mqd"></span>`), true);

  const about = i18next.t('home.about', { returnObjects: true });
  setChip('.about-main .chip', about.chip);
  setHTML('#about .about-h', about.title);
  setList('#about .about-p', [about.p1, about.p2]);
  setList('#about .skill-row .sk-name', about.skills);
  setList('#about .prod-card .prod-chip span', [about.products[0].status, about.products[1].status]);
  setList('#about .prod-card .prod-t', [about.products[0].title, about.products[1].title]);
  setList('#about .prod-card .prod-s', [about.products[0].desc, about.products[1].desc]);

  const voice = i18next.t('home.voice', { returnObjects: true });
  setChip('#voice .voice-spine .chip', voice.chip);
  setHTML('#voice .voice-h', voice.title);
  setText('#voice .voice-sub', voice.sub);
  setList('#voice .lc-name', voice.langs);
  setList('#voice .lc-level', voice.levels);
  setText('#voice .fc-title', voice.formatsTitle);
  setList('#voice .fc-name', voice.formats.map(f => f[0]));
  setList('#voice .fc-tag', voice.formats.map(f => f[1]));
  setList('#voice .pc-label', voice.samples.map(s => s.label));
  setList('#voice .pc-title', voice.samples.map(s => s.title));
  setList('#voice .pc-sub', voice.samples.map(s => s.sub));
  setHTML('.vcta-t', voice.cta.title);
  setText('.vcta-s', voice.cta.sub);
  setText('.inline-actions .btn-gold', voice.cta.button);
  setText('.inline-actions .btn-ghost', voice.cta.secondary);
  setText('.vstudio-t', voice.studio.title);
  setList('.vstudio-i', voice.studio.items.map(item => `<span class="vstudio-dot"></span>${item}`), true);
  setText('.vstat-l', voice.stat);

  const work = i18next.t('home.work', { returnObjects: true });
  setChip('#work .work-spine .chip', work.chip);
  setHTML('#work .work-h', work.title);
  setText('#work .btn-outline', work.all);
  setText('#work .wf-big .wn', work.featured[0].meta);
  setHTML('#work .wf-big .wt', work.featured[0].title);
  setText('#work .wf-big .wd', work.featured[0].desc);
  setList('#work .wf-big .wtag', work.featured[0].tags);
  setList('#work .wcard-sm .wn', [work.featured[1].meta]);
  setList('#work .wcard-sm .wt', [work.featured[1].title]);
  setList('#work .wcard-sm .wd', [work.featured[1].desc]);
  setList('#work .wcard-sm .wtag', work.featured[1].tags);

  const socials = i18next.t('home.socials', { returnObjects: true });
  setChip('#socials .chip', socials.chip);
  setHTML('#socials .social-h', socials.title);
  setText('#socials .social-sub', socials.sub);
  setList('#socials .social-kicker', socials.cards.map(c => c.kicker));
  setList('#socials .social-name', socials.cards.map(c => c.name));
  setList('#socials .social-desc', socials.cards.map(c => c.desc));
  setList('#socials .social-arr', socials.cards.map(c => c.arr));

  const contact = i18next.t('home.contact', { returnObjects: true });
  setChip('#contact .contact-spine .chip', contact.chip);
  setHTML('#contact .contact-h', contact.title);
  setText('#contact .contact-sub', contact.sub);
  setHTML('#contact .cbig-t', contact.cta.title);
  setText('#contact .cbig-s', contact.cta.sub);
  setText('#contact .cbig .btn-gold', contact.cta.button);
  setChip('#contact .clinks .chip', contact.findMe);
  setList('#contact .cl-label', contact.labels);
  setList('#contact .cv', contact.values);
  setList('#contact .cb-label', contact.bottom.map(b => b[0]));
  setList('#contact .cb-val', contact.bottom.map(b => b[1]), true);
  setText('footer .fc', i18next.t('home.footer'));
}

function updateProjects() {
  const p = i18next.t('projects', { returnObjects: true });
  setText('.page-eyebrow', p.hero.eyebrow);
  if (p.hero.title) setHTML('.page-title', p.hero.title);
  if (p.hero.sub) setText('.page-sub', p.hero.sub);
  setText('.page-actions .btn-gold', p.hero.primary);
  setText('.page-actions .btn-ghost', p.hero.secondary);
  if (p.comingSoon) {
    setText('.coming-soon-badge', p.comingSoon.badge);
    setText('.coming-soon-title', p.comingSoon.title);
    setText('.coming-soon-sub', p.comingSoon.sub);
    setText('.coming-soon-card .btn-gold', p.comingSoon.primary);
    setText('.coming-soon-card .btn-ghost', p.comingSoon.secondary);
  }
  setText('footer .fc', i18next.language === 'ar' ? '© 2026 · الأعمال' : '© 2026 · Work');
}

function updateSamples() {
  const s = i18next.t('samples', { returnObjects: true });
  setText('.page-eyebrow', s.hero.eyebrow);
  setText('.page-title', s.hero.title);
  setText('.page-sub', s.hero.sub);
  setText('.page-actions .btn-gold', s.hero.primary);
  setText('.page-actions .btn-ghost', s.hero.secondary);
  setList('.sample-library .pc-label', s.cards.map(c => c.label));
  setList('.sample-library .pc-title', s.cards.map(c => c.title));
  setList('.sample-library .pc-sub', s.cards.map(c => c.sub));
  setText('footer .fc', i18next.language === 'ar' ? '© 2026 · نماذج صوتية' : '© 2026 · Voice Samples');
}

function applyLocale(locale) {
  i18next.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.body.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem(LOCALE_KEY, locale);
  updateCommon();
  const page = document.body.dataset.page || 'home';
  if (page === 'home') updateHome();
  if (page === 'projects') updateProjects();
  if (page === 'samples') updateSamples();
  if (window.SiteContent && typeof window.SiteContent.render === 'function') {
    window.SiteContent.render(i18next.language);
  }
}

if (window.i18next) {
  i18next.init({ lng: initialLocale, fallbackLng: 'en', interpolation: { escapeValue: false }, resources }, () => {
    applyLocale(i18next.language || initialLocale);
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        closeNavMenu();
        applyLocale(i18next.language === 'ar' ? 'en' : 'ar');
      });
    });
  });
} else {
  // i18next CDN failed to load — fall back to the static page content instead of
  // leaving every .r-tagged section permanently invisible (see .r { opacity: 0 } below).
  console.warn('i18next failed to load; showing static page content without translation.');
}

/* Mobile navigation */
const navEl = document.getElementById('nav');
const menuToggle = document.querySelector('.menu-toggle');

function closeNavMenu() {
  if (!navEl || !menuToggle) return;
  navEl.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (navEl && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      navEl.querySelector('.nlinks a')?.focus();
    } else {
      menuToggle.focus();
    }
  });

  navEl.querySelectorAll('.nlinks a').forEach(link => {
    link.addEventListener('click', closeNavMenu);
  });

  document.addEventListener('click', e => {
    if (!navEl.classList.contains('open') || navEl.contains(e.target)) return;
    closeNavMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNavMenu();
    if (e.key === 'Tab' && navEl.classList.contains('open')) {
      const focusable = Array.from(navEl.querySelectorAll('a,button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
}

/* ── CURSOR ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
if (cur && cur2 && !prefersReducedMotion) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * .1; ry += (my - ry) * .1;
    cur2.style.left = rx + 'px'; cur2.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

function bindHoverTargets(root = document) {
  root.querySelectorAll('a,button,.card,.pc').forEach(el => {
    if (el.dataset.hoverBound === 'true') return;
    el.dataset.hoverBound = 'true';
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
}

bindHoverTargets();

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('sc', scrollY > 50);
}, { passive: true });

/* ── REVEAL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
function bindRevealTargets(root = document) {
  root.querySelectorAll('.r').forEach(el => {
    if (el.dataset.revealBound === 'true') return;
    el.dataset.revealBound = 'true';
    obs.observe(el);
  });
}

bindRevealTargets();

/* ── WAVEFORMS ── */
const patterns = [
  [28, 62, 85, 44, 70, 92, 36, 75, 58, 88, 32, 64, 78, 50, 40, 96, 30, 68, 82, 46, 72, 54, 34, 91, 60, 76, 40, 86, 50, 64, 30, 72, 46, 82, 56, 40, 92, 66, 34, 76, 50, 86, 40, 60, 72, 30, 54, 82, 44, 66],
  [46, 72, 58, 90, 36, 64, 80, 44, 94, 52, 70, 32, 84, 60, 42, 76, 96, 46, 66, 40, 82, 56, 72, 32, 90, 52, 44, 78, 62, 36, 92, 50, 66, 82, 40, 57, 72, 44, 87, 54, 68, 38, 80, 55, 42, 76, 60, 34, 90, 48],
  [36, 64, 90, 46, 74, 52, 82, 40, 66, 92, 44, 76, 56, 86, 34, 70, 96, 42, 60, 80, 46, 64, 82, 36, 92, 54, 72, 40, 86, 50, 62, 76, 44, 90, 56, 34, 80, 66, 52, 92, 48, 72, 36, 62, 78, 40, 58, 84, 46, 68],
  [52, 36, 80, 66, 44, 88, 30, 72, 94, 58, 42, 76, 62, 86, 38, 56, 90, 48, 70, 34, 84, 60, 46, 78, 52, 36, 92, 68, 44, 80, 56, 38, 74, 88, 50, 62, 36, 82, 58, 44, 70, 94, 40, 64, 78, 52, 86, 42, 68, 56],
  [30, 44, 58, 72, 52, 84, 40, 66, 78, 38, 60, 86, 46, 70, 90, 56, 42, 76, 62, 34, 88, 50, 68, 44, 80, 58, 36, 74, 92, 48, 66, 40, 82, 56, 70, 38, 86, 54, 72, 44, 60, 78, 36, 90, 52, 68, 42, 80, 56, 64],
  [66, 52, 78, 44, 68, 90, 38, 72, 58, 84, 46, 64, 80, 50, 36, 74, 88, 56, 70, 42, 62, 78, 34, 92, 54, 68, 44, 80, 60, 38, 76, 52, 86, 48, 62, 70, 40, 84, 56, 46, 72, 60, 36, 88, 50, 66, 78, 42, 58, 74]
];

function buildWaveforms(root = document) {
  root.querySelectorAll('.wf').forEach((el, order) => {
  if (el.dataset.waveformReady === 'true') return;
  el.dataset.waveformReady = 'true';
  const id = parseInt((el.id || '').replace('wf', ''));
  const pts = patterns[Number.isFinite(id) ? id % patterns.length : order % patterns.length];
  pts.forEach(h => {
    const b = document.createElement('div');
    b.className = 'wb';
    b.style.height = h + '%';
    el.appendChild(b);
  });
  });
}

buildWaveforms();

/* ── AUDIO PLAYERS ── */
const TICK = 80;
const playIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
const state = { playing: {}, progress: {}, interval: {} };

function syncWaveform(id, pct) {
  const wf = document.getElementById('wf' + id);
  if (!wf) return;
  const bars = wf.querySelectorAll('.wb');
  const ac = Math.floor(bars.length * pct);
  bars.forEach((b, i) => b.classList.toggle('on', i < ac));
}

function updateTime(id, secs) {
  const el = document.getElementById('pt' + id);
  if (el) el.textContent = `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
}

function startSimulation(id, dur, btn) {
  const total = dur * (1000 / TICK);
  if (state.interval[id]) clearInterval(state.interval[id]);
  state.interval[id] = setInterval(() => {
    if (!state.playing[id]) { clearInterval(state.interval[id]); return; }
    state.progress[id]++;
    if (state.progress[id] >= total) {
      state.progress[id] = 0;
      state.playing[id] = false;
      clearInterval(state.interval[id]);
      btn.innerHTML = playIcon;
      syncWaveform(id, 0);
      updateTime(id, 0);
      return;
    }
    syncWaveform(id, state.progress[id] / total);
    updateTime(id, state.progress[id] / (1000 / TICK));
  }, TICK);
}

/* ── AUDIO SOURCES ── */
(function () {
  var voices = 'assets/voices/';
  var files = {
    cleaning: voices + encodeURIComponent('رتب أمورك تنظيف بيوت مكاتب شركات.wav'),
    mosque: voices + encodeURIComponent('رتب أمورك - المسجد.wav'),
    faith: voices + encodeURIComponent('رتب أمورك - لأن النظافة.wav'),
    family: voices + encodeURIComponent('العيلة.wav'),
    companion: voices + encodeURIComponent('رفيق دربك نحو القمة.wav')
  };
  var page = document.body.dataset.page;
  var map = page === 'samples'
    ? { 0: files.cleaning, 1: files.mosque, 2: files.faith, 3: files.family, 4: files.companion }
    : { 0: files.cleaning, 1: files.companion };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById('audio' + id);
    if (el) el.setAttribute('src', map[id]);
  });
})();

/* Wire real audio elements when present */
document.querySelectorAll('audio[id^="audio"]').forEach(audio => {
  const id = parseInt(audio.id.replace('audio', ''));

  audio.addEventListener('timeupdate', () => {
    if (!state.playing[id] || !audio.duration) return;
    syncWaveform(id, audio.currentTime / audio.duration);
    updateTime(id, audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    state.playing[id] = false;
    state.progress[id] = 0;
    syncWaveform(id, 0);
    updateTime(id, 0);
    const btn = document.querySelector(`.pbtn[data-idx="${id}"]`);
    if (btn) btn.innerHTML = playIcon;
  });
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.pbtn');
  if (!btn) return;
  const id = parseInt(btn.dataset.idx, 10);
  const dur = parseInt(btn.dataset.dur, 10) || 30;
  if (!Number.isFinite(id)) return;
  state.playing[id] = state.playing[id] || false;
  state.progress[id] = state.progress[id] || 0;

  document.querySelectorAll('.pbtn').forEach(other => {
    const j = parseInt(other.dataset.idx, 10);
    if (j === id || !state.playing[j]) return;
    state.playing[j] = false;
    state.progress[j] = 0;
    if (state.interval[j]) clearInterval(state.interval[j]);
    const oa = document.getElementById('audio' + j);
    if (oa) oa.pause();
    other.innerHTML = playIcon;
    syncWaveform(j, 0);
    updateTime(j, 0);
  });

  state.playing[id] = !state.playing[id];
  btn.innerHTML = state.playing[id] ? pauseIcon : playIcon;

  if (state.playing[id]) {
    const audio = document.getElementById('audio' + id);
    if (audio && audio.getAttribute('src')) {
      audio.play().catch(() => startSimulation(id, dur, btn));
    } else {
      startSimulation(id, dur, btn);
    }
  } else {
    if (state.interval[id]) clearInterval(state.interval[id]);
    const audio = document.getElementById('audio' + id);
    if (audio) audio.pause();
  }
});

function bindDynamicAudio(root = document) {
  root.querySelectorAll('audio[id^="audio"]').forEach(audio => {
    if (audio.dataset.dynamicAudioBound === 'true') return;
    audio.dataset.dynamicAudioBound = 'true';
    const id = parseInt(audio.id.replace('audio', ''), 10);

    audio.addEventListener('timeupdate', () => {
      if (!state.playing[id] || !audio.duration) return;
      syncWaveform(id, audio.currentTime / audio.duration);
      updateTime(id, audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      state.playing[id] = false;
      state.progress[id] = 0;
      syncWaveform(id, 0);
      updateTime(id, 0);
      const btn = document.querySelector(`.pbtn[data-idx="${id}"]`);
      if (btn) btn.innerHTML = playIcon;
    });
  });
}

function resetAllAudioState() {
  Object.keys(state.interval).forEach(id => {
    if (state.interval[id]) clearInterval(state.interval[id]);
    state.interval[id] = null;
    state.playing[id] = false;
    state.progress[id] = 0;
  });
}

window.resetAudioPlayers = resetAllAudioState;

window.refreshInteractiveElements = function refreshInteractiveElements(root = document) {
  bindHoverTargets(root);
  bindRevealTargets(root);
  buildWaveforms(root);
  bindDynamicAudio(root);
};
window.initializeAudioPlayers = window.refreshInteractiveElements;
