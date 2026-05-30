/* ── LOCALE ── */
const LOCALE_KEY = 'siteLocale';
const initialLocale = localStorage.getItem(LOCALE_KEY) || ((navigator.language || '').slice(0, 2).toLowerCase() === 'ar' ? 'ar' : 'en');

const resources = {
  en: {
    translation: {
      meta: {
        home: { title: 'Jawad Khmaysa — Voice Artist & Graphic Designer' },
        projects: { title: 'All Projects — Jawad Khmaysa' },
        samples: { title: 'Voice Samples — Jawad Khmaysa' }
      },
      nav: ['About', 'Projects', 'Samples', 'Socials', 'Contact'],
      toggle: 'AR', book: 'Book a Session',
      home: {
        hero: {
          availability: 'Available for Selected Projects · From Palestine <svg class="chip-pin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/></svg>',
          name: 'Jawad Khmaysa', role: 'Voice & Visual Direction',
          headline: 'Hi, I\'m',
          samples: 'Hear Samples ↓', book: 'Book a Session'
        },
        about: {
          chip: 'About',
          title: 'Where <span class="hg">design</span><br/>meets craft<br/>and touches voice.',
          p1: 'I move between voice, branding, and product storytelling. The common thread is clarity.',
          p2: 'My work stretches from identity systems and motion to app concepts and narration, with one rule: the idea has to arrive clean.',
          skills: ['Voice Performance', 'Graphic Design', 'Brand Direction', 'Motion Design', 'Product Development', 'Videography'],
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
          levels: ['Arabic Dialect', 'Formal Arabic', 'Gulf, Egyptian, Iraqi...'],
          formats: [['Commercial', 'Radio · TV'], ['Documentary', 'Film'], ['E-Learning', 'Education'], ['Product', 'App · SaaS']],
          samples: [
            { label: 'Sample 01 · Arabic Commercial', title: 'Ratteb Omorak', sub: 'Radio Spot · 30s · Levantine Arabic' },
            { label: 'Sample 02 · English Narration', title: 'Brand Story', sub: 'Documentary Tone · 45s · English' }
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
            { meta: '01 — Featured Product', title: '<span class="hw">Grafly</span>', desc: 'A gamified Arabic-first design education platform. Duolingo-style learning for designers, built in React Native with Supabase.', tags: ['Product', 'React Native', 'Arabic-First', 'Education'] },
            { meta: '02', title: 'Ratteb Omorak', tags: ['Brand', 'Copy'] },
            { meta: '03', title: 'Critiqa', tags: ['AI Tool', 'Design'] }
          ],
          rows: [
            { meta: '04', title: 'PPU Incubator Podcast', tags: ['Content', 'Strategy'] },
            { meta: '05', title: 'Dark Cinema Portfolio', tags: ['Web', 'Motion'] },
            { meta: '06', title: 'Request Portfolio ↗', tags: ['+12 Projects'] }
          ]
        },
        socials: {
          chip: 'Channels',
          title: 'Watch the work.<br/><span class="hm">And follow the process.</span>',
          sub: 'Voice clips, work notes, and short updates from the studio and daily life.',
          cards: [
            { kicker: 'YouTube', name: 'Jawad Khmaysa', desc: 'Longer samples, project breakdowns, and behind-the-scenes moments.', arr: 'Open' },
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
          eyebrow: 'All Projects',
          title: 'Design, voice, product, and brand work.',
          sub: 'A broader view of selected projects across product design, identity, content, web, and voice-led creative systems.',
          primary: 'Listen to Samples', secondary: 'Start a Project'
        },
        cards: [
          { meta: '01 / Product', title: '<span class="hw">Grafly</span>', desc: 'Arabic-first design education platform with gamified learning paths, product strategy, and mobile app direction.', tags: ['React Native', 'Education', 'Arabic UX'] },
          { meta: '02 / Brand', title: 'Ratteb Omorak', desc: 'Service brand system, messaging, visual direction, and practical identity assets for a cleaning services business.', tags: ['Identity', 'Copy', 'Service Brand'] },
          { meta: '03 / AI Tool', title: 'Critiqa', desc: 'Concept and interface direction for an AI critique assistant built around clearer creative feedback.', tags: ['AI', 'UX', 'Design Tool'] },
          { meta: '04 / Content', title: 'PPU Incubator Podcast', desc: 'Content strategy and production support for entrepreneurial stories, conversations, and program visibility.', tags: ['Podcast', 'Strategy'] },
          { meta: '05 / Web', title: 'Dark Cinema Portfolio', desc: 'A motion-forward web direction built around cinematic contrast, strong typography, and immersive presentation.', tags: ['Web', 'Motion'] },
          { meta: '06 / Voice', title: 'Commercial Voice Packages', desc: 'Script interpretation, recording, and delivery for Arabic and English commercial, educational, and product projects.', tags: ['Arabic', 'English', 'VO'] }
        ]
      },
      samples: {
        hero: {
          eyebrow: 'Voice Sample Library',
          title: 'More range for serious clients.',
          sub: 'A dedicated listening page for clients who need more than two homepage highlights before booking a session.',
          primary: 'Request Custom Demo', secondary: 'View Projects'
        },
        cards: [
          { label: 'Arabic Commercial', title: 'Ratteb Omorak', sub: 'Radio spot · 30s · Levantine Arabic' },
          { label: 'English Narration', title: 'Brand Story', sub: 'Documentary tone · 45s · English' },
          { label: 'Arabic Commercial', title: 'Ratteb Omorak', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Product Demo', title: 'App Walkthrough', sub: 'Clear product delivery · 40s · English' },
          { label: 'Arabic Commercial', title: 'Ratteb Omorak', sub: 'Radio spot · Levantine Arabic' },
          { label: 'Cinematic Read', title: 'Opening Line', sub: 'Low, cinematic read · 35s · Arabic/English' }
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
          title: 'مصمم ومعلّق صوتي<br/>أبني تجارب واضحة<br/>بصوت وشكل متقن.',
          p1: 'أعمل بين التعليق الصوتي، الهوية البصرية، وتصميم المنتجات الرقمية. هدفي أن تصل الفكرة بسرعة وبأسلوب مهني.',
          p2: 'أتعامل مع كل مشروع كحكاية تحتاج صوتاً مناسباً، صورة قوية، وتنفيذاً مرتباً يخدم الهدف بدون تعقيد.',
          skills: ['الأداء الصوتي', 'التصميم الجرافيكي', 'توجيه الهوية', 'الحركة البصرية', 'تطوير المفهوم', 'التصوير'],
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
          levels: ['لهجة عربية', 'فصحى رسمية', "خليجي، مصري، عراقي ..."],
          formats: [['إعلانات', 'إذاعة · تلفاز'], ['وثائقيات', 'أفلام'], ['تعليم إلكتروني', 'تعليمي'], ['منتجات', 'تطبيقات · SaaS']],
          samples: [
            { label: 'النموذج 01 · إعلان عربي', title: 'رتّب أمورك', sub: 'إعلان إذاعي · 30 ثانية · لهجة شامية' },
            { label: 'النموذج 02 · سرد إنجليزي', title: 'Brand Story', sub: 'نبرة وثائقية · 45 ثانية · إنجليزية' }
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
            { meta: '01 — منتج رئيسي', title: '<span class="hw">Grafly</span>', desc: 'منصة لتعلّم التصميم بالعربية أولاً، مبنية كمسار عملي وممتع في الوقت نفسه.', tags: ['منتج', 'React Native', 'عربي أولاً', 'تعليم'] },
            { meta: '02', title: 'رتّب أمورك', tags: ['علامة', 'نصوص'] },
            { meta: '03', title: 'Critiqa', tags: ['ذكاء اصطناعي', 'تصميم'] }
          ],
          rows: [
            { meta: '04', title: 'بودكاست حاضنة جامعة بوليتكنك', tags: ['محتوى', 'استراتيجية'] },
            { meta: '05', title: 'ملف سينمائي داكن', tags: ['ويب', 'حركة'] },
            { meta: '06', title: 'طلب الملف الكامل ↗', tags: ['+12 مشروعًا'] }
          ]
        },
        socials: {
          chip: 'القنوات',
          title: 'شاهد العمل.<br/><span class="hm">وتابع الطريقة.</span>',
          sub: 'مقاطع صوتية، ملاحظات عمل، وتحديثات قصيرة من الاستوديو والحياة اليومية.',
          cards: [
            { kicker: 'YouTube', name: 'Jawad Khmaysa', desc: 'نماذج أطول، تفكيك للمشاريع، ولحظات من خلف الكواليس.', arr: 'افتح' },
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
          eyebrow: 'كل المشاريع',
          title: 'تصميم وصوت ومنتج وهوية بصرية.',
          sub: 'نظرة أشمل على مشاريع مختارة في تصميم المنتج والهوية والمحتوى والويب والأنظمة الإبداعية الصوتية.',
          primary: 'استمع للنماذج', secondary: 'ابدأ مشروعًا'
        },
        cards: [
          { meta: '01 / منتج', title: '<span class="hw">Grafly</span>', desc: 'منصة لتعلّم التصميم بالعربية أولاً مع مسارات ممتعة واستراتيجية منتج وتوجيه تطبيق جوال.', tags: ['React Native', 'تعليم', 'واجهة عربية'] },
          { meta: '02 / هوية', title: 'رتّب أمورك', desc: 'نظام هوية خدمة مع رسائل واضحة وتوجيه بصري وأصول هوية عملية لخدمة تنظيف.', tags: ['هوية', 'نصوص', 'علامة خدمة'] },
          { meta: '03 / أداة ذكاء', title: 'Critiqa', desc: 'مفهوم وتوجيه واجهة لمساعد نقد ذكي مبني حول تغذية راجعة إبداعية أوضح.', tags: ['ذكاء اصطناعي', 'UX', 'أداة تصميم'] },
          { meta: '04 / محتوى', title: 'بودكاست حاضنة بوليتكنك', desc: 'استراتيجية محتوى ودعم إنتاجي لقصص ريادية ومحادثات وإبراز برامج.', tags: ['بودكاست', 'استراتيجية'] },
          { meta: '05 / ويب', title: 'ملف سينمائي داكن', desc: 'توجيه ويب متقدم مبني على التباين السينمائي والطباعة القوية والعرض الغامر.', tags: ['ويب', 'حركة'] },
          { meta: '06 / صوت', title: 'باقات صوت تجاري', desc: 'تفسير نصوص وتسجيل وتسليم لمشاريع عربية وإنجليزية تجارية وتعليمية ومنتجية.', tags: ['عربي', 'إنجليزي', 'صوت'] }
        ]
      },
      samples: {
        hero: {
          eyebrow: 'مكتبة النماذج الصوتية',
          title: 'نطاق أوسع للعملاء الجادين.',
          sub: 'صفحة استماع مخصصة للعملاء الذين يحتاجون أكثر من نموذجين قبل الحجز.',
          primary: 'طلب ديمو مخصص', secondary: 'عرض المشاريع'
        },
        cards: [
          { label: 'إعلان عربي', title: 'رتّب أمورك', sub: 'إعلان إذاعي · 30ث · لهجة شامية' },
          { label: 'سرد إنجليزي', title: 'Brand Story', sub: 'نبرة وثائقية · 45ث · إنجليزية' },
          { label: 'إعلان عربي', title: 'رتّب أمورك', sub: 'إعلان إذاعي · لهجة شامية' },
          { label: 'عرض منتج', title: 'جولة تطبيق', sub: 'إيصال واضح · 40ث · إنجليزية' },
          { label: 'إعلان عربي', title: 'رتّب أمورك', sub: 'إعلان إذاعي · لهجة شامية' },
          { label: 'قراءة سينمائية', title: 'الجملة الافتتاحية', sub: 'قراءة هادئة · 35ث · عربي/إنجليزي' }
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
  setList('#work .wcard-sm .wn', [work.featured[1].meta, work.featured[2].meta]);
  setList('#work .wcard-sm .wt', [work.featured[1].title, work.featured[2].title]);
  setList('#work .wcard-sm .wtag', [...work.featured[1].tags, ...work.featured[2].tags]);
  setList('#work .wcard-list .wn', work.rows.map(r => r.meta));
  setList('#work .wcard-list .wt', work.rows.map(r => r.title));
  setList('#work .wcard-list .wtag', work.rows.flatMap(r => r.tags));

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
  setText('.page-title', p.hero.title);
  setText('.page-sub', p.hero.sub);
  setText('.page-actions .btn-gold', p.hero.primary);
  setText('.page-actions .btn-ghost', p.hero.secondary);
  setList('.project-meta', p.cards.map(c => c.meta));
  setList('.project-card .wt', p.cards.map(c => c.title), true);
  setList('.project-desc', p.cards.map(c => c.desc));
  setList('.project-card .wtag', p.cards.flatMap(c => c.tags));
  setText('footer .fc', i18next.language === 'ar' ? '© 2026 · المشاريع' : '© 2026 · Projects');
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

i18next.init({ lng: initialLocale, fallbackLng: 'en', interpolation: { escapeValue: false }, resources }, () => {
  applyLocale(i18next.language || initialLocale);
  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeNavMenu();
      applyLocale(i18next.language === 'ar' ? 'en' : 'ar');
    });
  });
});

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
  });
}

/* ── CURSOR ── */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
if (cur && cur2) {
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

/* ── SKILL BARS ── */
const sobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-bar').forEach(b => b.style.width = b.dataset.w + '%');
      sobs.unobserve(e.target);
    }
  });
}, { threshold: .3 });
document.querySelectorAll('.skills-card').forEach(el => sobs.observe(el));

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
  var map = {
    0: voices + encodeURIComponent('رتب أمورك تنظيف بيوت مكاتب شركات.wav'),
    2: voices + encodeURIComponent('رتب أمورك - المسجد.wav'),
    4: voices + encodeURIComponent('رتب أمورك - لأن النظافة.wav')
  };
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

const playerButtons = [...document.querySelectorAll('.pbtn')];

playerButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const id = parseInt(this.dataset.idx);
    const dur = parseInt(this.dataset.dur);
    state.playing[id] = state.playing[id] || false;
    state.progress[id] = state.progress[id] || 0;

    /* stop all other players */
    playerButtons.forEach(other => {
      const j = parseInt(other.dataset.idx);
      if (j === id) return;
      if (!state.playing[j]) return;
      state.playing[j] = false;
      state.progress[j] = 0;
      clearInterval(state.interval[j]);
      const oa = document.getElementById('audio' + j);
      if (oa) oa.pause();
      other.innerHTML = playIcon;
      syncWaveform(j, 0);
      updateTime(j, 0);
    });

    state.playing[id] = !state.playing[id];
    this.innerHTML = state.playing[id] ? pauseIcon : playIcon;

    if (state.playing[id]) {
      const audio = document.getElementById('audio' + id);
      if (audio && audio.getAttribute('src')) {
        audio.play().catch(() => startSimulation(id, dur, this));
      } else {
        startSimulation(id, dur, this);
      }
    } else {
      clearInterval(state.interval[id]);
      const audio = document.getElementById('audio' + id);
      if (audio) audio.pause();
    }
  });
});

function bindDynamicAudio(root = document) {
  root.querySelectorAll('audio[id^="audio"]').forEach(audio => {
    if (audio.dataset.dynamicAudioBound === 'true') return;
    audio.dataset.dynamicAudioBound = 'true';
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

  root.querySelectorAll('.pbtn').forEach(btn => {
    if (btn.dataset.dynamicPlayerBound === 'true') return;
    btn.dataset.dynamicPlayerBound = 'true';
    btn.addEventListener('click', function () {
      const id = parseInt(this.dataset.idx);
      const dur = parseInt(this.dataset.dur);
      state.playing[id] = state.playing[id] || false;
      state.progress[id] = state.progress[id] || 0;

      document.querySelectorAll('.pbtn').forEach(other => {
        const j = parseInt(other.dataset.idx);
        if (j === id || !state.playing[j]) return;
        state.playing[j] = false;
        state.progress[j] = 0;
        clearInterval(state.interval[j]);
        const oa = document.getElementById('audio' + j);
        if (oa) oa.pause();
        other.innerHTML = playIcon;
        syncWaveform(j, 0);
        updateTime(j, 0);
      });

      state.playing[id] = !state.playing[id];
      this.innerHTML = state.playing[id] ? pauseIcon : playIcon;

      if (state.playing[id]) {
        const audio = document.getElementById('audio' + id);
        if (audio && audio.getAttribute('src')) {
          audio.play().catch(() => startSimulation(id, dur, this));
        } else {
          startSimulation(id, dur, this);
        }
      } else {
        clearInterval(state.interval[id]);
        const audio = document.getElementById('audio' + id);
        if (audio) audio.pause();
      }
    });
  });
}

window.refreshInteractiveElements = function refreshInteractiveElements(root = document) {
  bindHoverTargets(root);
  bindRevealTargets(root);
  buildWaveforms(root);
  bindDynamicAudio(root);
};
window.initializeAudioPlayers = window.refreshInteractiveElements;
