/* ── LOCALE ── */
const LOCALE_KEY = 'siteLocale';

// Storage throws outright when a browser blocks site data, and an uncaught throw
// here would stop the reveal observer, leaving every .r section invisible.
function readStorage(key) {
  try { return localStorage.getItem(key); } catch (error) { return null; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { /* preference just isn't remembered */ }
}

const initialLocale = readStorage(LOCALE_KEY) || ((navigator.language || '').slice(0, 2).toLowerCase() === 'ar' ? 'ar' : 'en');

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
        tabs: ['Visual IDs & Prints', 'Social Media', 'Video'],
        sections: [
          {
            eyebrow: '01 / Identity & Print',
            title: 'Visual IDs & Prints',
            sub: 'Complete brand identity systems and print collateral — logo marks, type scales, colour systems, booklets, and usage guides. Click any card to open the full document.'
          },
          {
            eyebrow: '02 / Social',
            title: 'Social Media',
            sub: 'Campaign visuals, branded post series, and content-system design for social platforms. Click any post to view it full size.',
            empty: 'New social campaigns coming soon.'
          },
          {
            eyebrow: '03 / Motion',
            title: 'Video',
            sub: 'Cinematography, motion content, and branded video production for commercial and social use.',
            empty: 'New motion work coming soon.'
          }
        ],
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
          { label: 'Arabic Narration', title: 'Companion to the Top', sub: 'Motivational narration · Levantine Arabic' },
          { label: 'Arabic Commercial', title: 'Abu Rabie — From Pan to Plate', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Arabic Commercial', title: 'The Ottoman Grip', sub: 'Brand campaign · Levantine Arabic' },
          { label: 'Arabic Commercial', title: 'Levantine Sweets', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Arabic Narration', title: 'Every Moment Has Its Rose', sub: 'Lifestyle read · Levantine Arabic' }
        ]
      }
    }
  },
  ar: {
    translation: {
      meta: {
        home: { title: 'جواد خمايسة — معلّق صوتي ومصمم جرافيك' },
        projects: { title: 'المشاريع — جواد خمايسة' },
        samples: { title: 'النماذج الصوتية — جواد خمايسة' }
      },
      nav: ['من أنا', 'المشاريع', 'النماذج', 'تابعني', 'تواصل'],
      toggle: 'EN', book: 'احجز جلسة',
      home: {
        hero: {
          availability: 'أستقبل مشاريع مختارة · من فلسطين إلى العالم <svg class="chip-pin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>',
          name: 'جــــــــــــــــــــــــــــواد خـــــمايـــــــــــسة',
          role: 'معلّق صوتي ومصمم جرافيك',
          headline: 'مرحباً، أنا',
          samples: 'استمع إلى النماذج ↓', book: 'احجز جلسة'
        },
        about: {
          chip: 'من أنا',
          title: 'مصمم ومعلّق صوتي،<br/>أصنع <span class="hg">تجارب</span> واضحة<br/>بالصوت والصورة.',
          p1: 'أعمل في التعليق الصوتي والهوية البصرية وتصميم المنتجات الرقمية، وغايتي في كل ذلك أن تصل الفكرة سريعًا وبصورة احترافية.',
          p2: 'أرى كل مشروع حكايةً تحتاج إلى صوت يليق بها، وصورة تُقنع، وتنفيذ متقن يخدم الهدف دون تكلّف.',
          skills: ['الأداء الصوتي', 'التصميم الجرافيكي', 'توجيه الهوية البصرية', 'تصوير الفيديو'],
          products: [
            { status: 'نشط', title: 'Grafly', desc: 'تطبيق لتعلّم التصميم بالعربية' },
            { status: 'هوية', title: 'رتّب أمورك', desc: 'هوية بصرية لشركة خدمات تنظيف' }
          ]
        },
        voice: {
          chip: 'الصوت',
          title: 'استمع، ثم <span class="hw">قرّر.</span>',
          sub: 'نموذجان يكفيان لانطباع أول، وإن أردت المزيد فالمكتبة الكاملة في صفحة النماذج.',
          langs: ['الشامية', 'الفصحى', 'لهجات عربية'],
          levels: ['لهجة محكية', 'العربية الرسمية', 'تنوّع إقليمي'],
          formats: [['إعلانات', 'إذاعة · تلفزيون'], ['وثائقيات', 'أفلام'], ['تعليم إلكتروني', 'محتوى تعليمي'], ['عروض منتجات', 'تطبيقات · منصات رقمية']],
          samples: [
            { label: 'نموذج 01 · إعلان تجاري', title: 'رتّب أمورك', sub: 'إعلان إذاعي · باللهجة الشامية' },
            { label: 'نموذج 02 · سرد صوتي', title: 'رفيق دربك نحو القمة', sub: 'سرد تحفيزي · باللهجة الشامية' }
          ],
          cta: {
            title: 'هل يحتاج مشروعك<br/>إلى <span class="hw">صوت</span>؟',
            sub: 'إعلانات، ووثائقيات، ومحتوى تعليمي، وعروض منتجات — بالعربية والإنجليزية.',
            button: 'المزيد من النماذج', secondary: 'اطلب عرض سعر'
          },
          studio: {
            title: 'الاستوديو',
            items: ['استوديو منزلي بميكروفون احترافي', 'تسجيل نقي في غرفة معالجة صوتيًا', 'تسليم سريع', 'تعديلات مشمولة']
          },
          stat: 'أداء بلغتين',
          formatsTitle: 'مجالات العمل'
        },
        work: {
          chip: 'أعمال مختارة',
          title: 'أبعد من <span class="hm">المايك.</span>',
          all: 'جميع المشاريع',
          featured: [
            { meta: '01 — منتج مميّز', title: '<span class="hw">Grafly</span>', desc: 'منصة عربية لتعلّم التصميم، صُمّمت لتكون رحلة عملية وممتعة في آنٍ واحد.', tags: ['منتج', 'بالعربية أولًا', 'تعليم'] },
            { meta: '02 — هوية بصرية', title: 'رتّب أمورك', desc: '«نهتم بما لا تراه.» هوية بصرية متكاملة لشركة خدمات تنظيف: الشعار والألوان ودليل الاستخدام.', tags: ['هوية بصرية', 'دليل العلامة'] }
          ]
        },
        socials: {
          chip: 'تابعني',
          title: 'شاهد الأعمال.<br/><span class="hm">وتابع كواليسها.</span>',
          sub: 'مقاطع صوتية، وملاحظات من العمل، وتحديثات سريعة من الاستوديو ومن يومياتي.',
          cards: [
            { kicker: 'YouTube', name: 'Jawad Khamaysa', desc: 'نماذج أطول، وشرح لكيفية بناء المشاريع، ولقطات من خلف الكواليس.', arr: 'زيارة' },
            { kicker: 'Instagram', name: '@jawad.khamaysa', desc: 'مقاطع قصيرة، وأعمال بصرية، ولحظات من الاستوديو، وتحديثات أولًا بأول.', arr: 'زيارة' }
          ]
        },
        contact: {
          chip: 'تواصل',
          title: 'لنجعل فكرتك <span class="hw">مسموعة.</span>',
          sub: 'احجز جلسة تسجيل، أو اطلب نموذجًا مخصصًا، أو حدّثني عن مشروعك القادم.',
          findMe: 'تجدني هنا',
          cta: {
            title: 'جاهز<br/><span class="hw">متى كنت جاهزًا.</span>',
            sub: 'تنفيذ سريع، وتسليم نظيف، وتعديلات مشمولة، لتصل القراءة تمامًا كما تريدها.',
            button: 'أرسل رسالة ↗'
          },
          labels: ['البريد الإلكتروني', 'إنستغرام', 'يوتيوب', 'واتساب'],
          values: ['jawad.kh.vo@gmail.com', '@jawad.khamaysa', 'Jawad Khamaysa', '+972 595 540 726'],
          bottom: [['الموقع', '<svg style="display:inline-block;vertical-align:-2px;margin-left:5px;flex-shrink:0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>فلسطين'], ['الحالة', 'متاح للتعاون'], ['التخصص', 'صوت · تصميم · منتجات رقمية']]
        },
        footer: '© 2026 · صوت · تصميم · فلسطين',
        marquee: ['إعلانات تجارية', 'وثائقيات', 'تعليم إلكتروني', 'إعلانات إذاعية', 'عروض منتجات', 'أفلام ترويجية', 'تعليق صوتي', 'العربية · English']
      },
      projects: {
        tabs: ['الهويات البصرية والمطبوعات', 'منصات التواصل', 'الفيديو'],
        sections: [
          {
            eyebrow: '01 / هوية ومطبوعات',
            title: 'الهويات البصرية والمطبوعات',
            sub: 'أنظمة هوية بصرية متكاملة ومطبوعات: شعارات، وأنظمة خطوط وألوان، وكتيّبات، وأدلة استخدام. اضغط على أي بطاقة لتصفّح المستند كاملًا.'
          },
          {
            eyebrow: '02 / منصات التواصل',
            title: 'منصات التواصل',
            sub: 'تصاميم حملات، وسلاسل منشورات تحمل هوية العلامة، وأنظمة محتوى لمنصات التواصل الاجتماعي. اضغط على أي منشور لعرضه بحجمه الكامل.',
            empty: 'حملات جديدة قريبًا.'
          },
          {
            eyebrow: '03 / فيديو وموشن',
            title: 'الفيديو',
            sub: 'تصوير سينمائي، وموشن جرافيك، وإنتاج فيديو يحمل هوية العلامة، للإعلانات ومنصات التواصل.',
            empty: 'أعمال فيديو جديدة قريبًا.'
          }
        ],
        hero: {
          eyebrow: 'الأعمال',
          title: 'هويات بصرية،<br>ومحتوى، وفيديو.',
          sub: 'هويات بصرية، وحملات على منصات التواصل، وإنتاج فيديو — بتصميم واضح وأثر يدوم.',
          primary: 'استمع إلى النماذج', secondary: 'ابدأ مشروعك'
        },
        comingSoon: {
          badge: 'قيد الإعداد',
          title: 'قريبًا',
          sub: 'أعمل حاليًا على تجهيز أعمال جديدة في الهوية البصرية ومنصات التواصل والفيديو. وإلى ذلك الحين، استمع إلى النماذج الصوتية أو تواصل معي.',
          primary: 'استمع إلى النماذج', secondary: 'ابدأ مشروعك'
        }
      },
      samples: {
        hero: {
          eyebrow: 'مكتبة النماذج الصوتية',
          title: 'تنوّع أكبر لتجد الصوت المناسب.',
          sub: 'إن لم يكفِك نموذجان في الصفحة الرئيسية، فهنا المكتبة كاملة لتستمع إليها قبل أن تحجز.',
          primary: 'اطلب نموذجًا مخصصًا', secondary: 'تصفّح المشاريع'
        },
        cards: [
          { label: 'إعلان تجاري', title: 'رتّب أمورك — بيوت ومكاتب', sub: 'إعلان إذاعي · باللهجة الشامية' },
          { label: 'إعلان تجاري', title: 'رتّب أمورك — المسجد', sub: 'إعلان إذاعي · باللهجة الشامية' },
          { label: 'إعلان تجاري', title: 'رتّب أمورك — لأن النظافة', sub: 'إعلان إذاعي · باللهجة الشامية' },
          { label: 'سرد صوتي', title: 'العيلة', sub: 'سرد · باللهجة الشامية' },
          { label: 'سرد صوتي', title: 'رفيق دربك نحو القمة', sub: 'سرد تحفيزي · باللهجة الشامية' },
          { label: 'إعلان تجاري', title: 'أبو ربيع — من الطنجرة للصحن', sub: 'إعلان إذاعي · باللهجة الشامية' },
          { label: 'إعلان تجاري', title: 'القبضة العثمانية', sub: 'حملة إعلانية · باللهجة الشامية' },
          { label: 'إعلان تجاري', title: 'الحلويات الشامية', sub: 'إعلان إذاعي · باللهجة الشامية' },
          { label: 'سرد صوتي', title: 'لكل لحظة وردتها', sub: 'قراءة بطابع حياتي · باللهجة الشامية' }
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
  document.querySelector('.hero-scroll')?.setAttribute('aria-label', i18next.language === 'ar' ? 'انتقل إلى قسم من أنا' : 'Scroll to About');

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
  if (p.tabs) setList('.cat-tab', p.tabs);
  // Scoped per section rather than by index: the CMS replaces a grid's contents
  // outright, so an empty-state div is there for one section and gone for another.
  ['#visual-ids', '#social-media', '#video'].forEach((scope, index) => {
    const section = (p.sections || [])[index];
    if (!section) return;
    setText(`${scope} .section-eyebrow`, section.eyebrow);
    setText(`${scope} .section-h`, section.title);
    setText(`${scope} .section-sub`, section.sub);
    if (section.empty) setText(`${scope} .posts-empty`, section.empty);
  });
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
  writeStorage(LOCALE_KEY, locale);
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
        const next = i18next.language === 'ar' ? 'en' : 'ar';
        // Where the browser can, cross-fade the whole page between languages
        // instead of swapping every string in place in one hard cut.
        if (!document.startViewTransition || prefersReducedMotion) {
          applyLocale(next);
          return;
        }
        const root = document.documentElement;
        root.classList.add('vt-locale');
        document.startViewTransition(() => applyLocale(next)).finished
          .finally(() => root.classList.remove('vt-locale'));
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

/* ── MOTION ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isRTL = () => document.documentElement.dir === 'rtl';

// What the cursor ring treats as clickable. Static cards are left out on
// purpose, so the ring only ever swells over something that responds.
const CLICKABLE = 'a, button, .wf, [role="button"]';
// Controls that lean toward the pointer.
const MAGNETIC = '.btn-gold, .btn-ghost, .btn-outline, .ncta, .lang-toggle, .pbtn';

const hero = document.getElementById('hero');
const heroPhoto = hero?.querySelector('.hero-photo');
const heroCopy = hero?.querySelector('.hero-left-col');

/* Cursor: the dot sits exactly on the pointer, the ring trails behind it, and
   the trailing loop sleeps once the ring has caught up. */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
if (cur && cur2 && finePointer && !prefersReducedMotion) {
  let mx = 0, my = 0, rx = 0, ry = 0, ringFrame = 0;
  const place = (el, x, y) => { el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
  const trail = () => {
    rx += (mx - rx) * .2; ry += (my - ry) * .2;
    place(cur2, rx, ry);
    ringFrame = Math.abs(mx - rx) + Math.abs(my - ry) > .1 ? requestAnimationFrame(trail) : 0;
  };
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!document.body.classList.contains('cursor-on')) {
      rx = mx; ry = my;
      document.body.classList.add('cursor-on');
    }
    place(cur, mx, my);
    if (!ringFrame) ringFrame = requestAnimationFrame(trail);
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    document.body.classList.toggle('ch', !!e.target.closest?.(CLICKABLE));
  }, { passive: true });
  document.addEventListener('pointerdown', () => document.body.classList.add('cursor-down'));
  document.addEventListener('pointerup', () => document.body.classList.remove('cursor-down'));
  document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
}

/* Pointer-driven details, batched into one frame per pointer move: buttons
   lean toward the cursor, cards pool a soft light under it, and the hero
   carries a gold key light that follows it. */
if (finePointer && !prefersReducedMotion) {
  let lastEvent = null, frame = 0, magnet = null;
  const onFrame = () => {
    frame = 0;
    const e = lastEvent;
    const target = e.target instanceof Element ? e.target : null;

    const pull = target?.closest(MAGNETIC) || null;
    if (pull !== magnet) {
      if (magnet) magnet.style.translate = '';
      magnet = pull;
    }
    if (pull) {
      const r = pull.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      pull.style.translate = `${(dx * .22).toFixed(1)}px ${(dy * .3).toFixed(1)}px`;
    }

    const card = target?.closest('.card, .pc');
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
      card.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
    }

    if (hero) {
      const inHero = !!target?.closest('#hero');
      hero.classList.toggle('is-lit', inHero);
      if (inHero) {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--hx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        hero.style.setProperty('--hy', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    }
  };
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    lastEvent = e;
    if (!frame) frame = requestAnimationFrame(onFrame);
  }, { passive: true });
}

/* Nav pill: one soft capsule that glides between links on hover and comes to
   rest on the current page or section. */
function initNavPill() {
  const bar = navEl?.querySelector('.np');
  const list = navEl?.querySelector('.nlinks');
  if (!bar || !list) return () => {};
  const pill = document.createElement('span');
  pill.className = 'nav-pill';
  pill.setAttribute('aria-hidden', 'true');
  bar.prepend(pill);
  navEl.classList.add('has-pill');

  let hovered = null;
  const rest = () => {
    const link = hovered || list.querySelector('a.is-active');
    if (!link || getComputedStyle(pill).display === 'none') {
      pill.classList.remove('is-on');
      return;
    }
    const a = link.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    // Appearing from nothing it should fade in where it is, not slide in
    // from wherever it last was.
    const appearing = !pill.classList.contains('is-on');
    if (appearing) pill.style.transition = 'opacity .35s var(--ease)';
    pill.style.width = `${a.width}px`;
    pill.style.height = `${a.height}px`;
    pill.style.transform = `translate3d(${a.left - b.left}px, ${a.top - b.top}px, 0)`;
    pill.classList.add('is-on');
    if (appearing) requestAnimationFrame(() => { pill.style.transition = ''; });
  };

  list.addEventListener('pointerover', e => {
    const link = e.target.closest('a');
    if (link) { hovered = link; rest(); }
  });
  list.addEventListener('pointerleave', () => { hovered = null; rest(); });
  list.addEventListener('focusin', e => { hovered = e.target.closest('a'); rest(); });
  list.addEventListener('focusout', () => { hovered = null; rest(); });
  // Link widths change when the language switches, so follow the list's size.
  if ('ResizeObserver' in window) new ResizeObserver(rest).observe(list);
  window.addEventListener('resize', rest);
  return rest;
}

/* Marks the link whose section sits across the middle of the screen. Links to
   other pages are ignored; they're marked by aria-current instead. */
function initScrollSpy(selector, activeClass, onChange) {
  const links = Array.from(document.querySelectorAll(selector));
  const targets = new Map();
  links.forEach(link => {
    const url = new URL(link.getAttribute('href') || '', location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (section) targets.set(section, link);
  });
  if (!targets.size || !('IntersectionObserver' in window)) return;
  const inView = new Set();
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? inView.add(entry.target) : inView.delete(entry.target));
    let current = null;
    targets.forEach((link, section) => { if (inView.has(section)) current = link; });
    links.forEach(link => link.classList.toggle(activeClass, link === current));
    onChange?.();
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach((link, section) => spy.observe(section));
}

if (navEl) {
  navEl.querySelectorAll('.nlinks a[aria-current="page"]').forEach(link => link.classList.add('is-active'));
  const restNavPill = initNavPill();
  initScrollSpy('.nlinks a', 'is-active', restNavPill);
  restNavPill();

  const progress = document.createElement('span');
  progress.className = 'nav-progress';
  progress.setAttribute('aria-hidden', 'true');
  navEl.querySelector('.np')?.appendChild(progress);
  // Anyone tabbing into a tucked-away nav gets it back.
  navEl.addEventListener('focusin', () => navEl.classList.remove('nav-hide'));
}
initScrollSpy('.cat-tab', 'active');

/* Scroll: one frame per scroll for the nav state, reading progress and the
   hero's parallax (the photo drifts slower than the page, the copy lifts and
   fades as it leaves). */
let lastScrollY = scrollY;
let scrollFrame = 0;
function onScrollFrame() {
  scrollFrame = 0;
  const y = Math.max(0, scrollY);
  if (navEl) {
    navEl.classList.toggle('sc', y > 50);
    const delta = y - lastScrollY;
    if (Math.abs(delta) > 6) {
      const keep = navEl.classList.contains('open') || navEl.contains(document.activeElement);
      navEl.classList.toggle('nav-hide', delta > 0 && y > 240 && !keep);
      lastScrollY = y;
    }
    if (y < 240) navEl.classList.remove('nav-hide');
    const max = document.documentElement.scrollHeight - innerHeight;
    navEl.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
  }
  if (heroPhoto && !prefersReducedMotion && y < innerHeight * 1.2) {
    heroPhoto.style.translate = `0 ${(y * .14).toFixed(1)}px`;
    if (heroCopy) {
      heroCopy.style.translate = `0 ${(y * -.08).toFixed(1)}px`;
      heroCopy.style.opacity = Math.max(0, 1 - y / (innerHeight * .75)).toFixed(3);
    }
  }
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(onScrollFrame);
}, { passive: true });
onScrollFrame();

/* ── REVEAL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
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
  pts.forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'wb';
    b.style.height = h + '%';
    b.style.setProperty('--i', i);
    el.appendChild(b);
  });
  // Hovering previews where a click would seek to.
  const bars = Array.from(el.children);
  el.addEventListener('pointermove', e => {
    const reach = Math.round(waveformFraction(el, e.clientX) * bars.length);
    bars.forEach((b, i) => b.classList.toggle('pv', i < reach));
  });
  el.addEventListener('pointerleave', () => bars.forEach(b => b.classList.remove('pv')));
  });
}

// The bars run right-to-left on the Arabic site, so measure from that edge.
function waveformFraction(wf, clientX) {
  const r = wf.getBoundingClientRect();
  const x = isRTL() ? r.right - clientX : clientX - r.left;
  return Math.min(1, Math.max(0, x / r.width));
}

buildWaveforms();

/* ── AUDIO PLAYERS ── */
const TICK = 80;
const playIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
const state = { playing: {}, progress: {}, interval: {} };

function setPlayingUI(btn, playing) {
  if (!btn) return;
  btn.innerHTML = playing ? pauseIcon : playIcon;
  btn.setAttribute('aria-label', playing ? 'Pause sample' : 'Play sample');
  btn.closest('.pc')?.classList.toggle('is-playing', playing);
}

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
      setPlayingUI(btn, false);
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
    companion: voices + encodeURIComponent('رفيق دربك نحو القمة.wav'),
    abuRabie: voices + encodeURIComponent('Abu Rabie - From Pan to Plate.wav'),
    ottomanGrip: voices + encodeURIComponent('The Ottoman Grip.wav'),
    sweets: voices + encodeURIComponent('Levantine Sweets.wav'),
    rose: voices + encodeURIComponent('Every Moment Has Its Rose.wav')
  };
  var page = document.body.dataset.page;
  var map = page === 'samples'
    ? { 0: files.cleaning, 1: files.mosque, 2: files.faith, 3: files.family, 4: files.companion, 5: files.abuRabie, 6: files.ottomanGrip, 7: files.sweets, 8: files.rose }
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
    setPlayingUI(btn, false);
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
    setPlayingUI(other, false);
    syncWaveform(j, 0);
    updateTime(j, 0);
  });

  state.playing[id] = !state.playing[id];
  setPlayingUI(btn, state.playing[id]);

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

/* Clicking the waveform seeks there, starting the sample if it was idle. */
function seekSample(id, fraction) {
  const btn = document.querySelector(`.pbtn[data-idx="${id}"]`);
  if (!btn) return;
  const dur = parseInt(btn.dataset.dur, 10) || 30;
  if (!state.playing[id]) btn.click();
  const audio = document.getElementById('audio' + id);
  const apply = () => {
    if (audio && audio.duration) audio.currentTime = fraction * audio.duration;
    state.progress[id] = Math.floor(fraction * dur * (1000 / TICK));
  };
  apply();
  // A sample that hasn't loaded yet has no duration to seek within until it does.
  if (audio && audio.getAttribute('src') && !audio.duration) {
    audio.addEventListener('loadedmetadata', apply, { once: true });
  }
  syncWaveform(id, fraction);
  updateTime(id, fraction * dur);
}

document.addEventListener('click', e => {
  const wf = e.target.closest('.wf');
  if (!wf) return;
  const id = parseInt((wf.id || '').replace('wf', ''), 10);
  if (Number.isFinite(id)) seekSample(id, waveformFraction(wf, e.clientX));
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
      setPlayingUI(btn, false);
    });
  });
}

// Called before the CMS re-renders the cards. A real <audio> that was playing
// never gets an interval, so walk the playing flags too, or the new button would
// think it is still playing and swallow the first click.
function resetAllAudioState() {
  const ids = new Set([...Object.keys(state.playing), ...Object.keys(state.interval)]);
  ids.forEach(id => {
    if (state.interval[id]) clearInterval(state.interval[id]);
    state.interval[id] = null;
    state.playing[id] = false;
    state.progress[id] = 0;
    document.getElementById('audio' + id)?.pause();
  });
}

window.resetAudioPlayers = resetAllAudioState;

window.refreshInteractiveElements = function refreshInteractiveElements(root = document) {
  bindRevealTargets(root);
  buildWaveforms(root);
  bindDynamicAudio(root);
};
window.initializeAudioPlayers = window.refreshInteractiveElements;
