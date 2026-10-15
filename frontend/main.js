/* ── Translations ─────────────────────────────── */
const i18n = {
  en: {
    nav_about: "About", nav_skills: "Skills", nav_projects: "Projects", nav_contact: "Contact",
    hero_available: "Available for work",
    role_devops: "DevOps Engineer", role_sysadmin: "Systems Administrator",
    role_python: "Windows · macOS · Microsoft 365", role_helpdesk: "IT Support Specialist", role_cyber: "Networking & Connectivity",
    hero_desc: "I help people get their technology working. I support users and devices, troubleshoot Windows, macOS and network issues, and keep business systems reliable.",
    hero_cta_work: "See my work", hero_cta_contact: "Get in touch",
    about_title: "Who I am",
    about_p1: "I'm an IT support specialist based in Brno, Czech Republic, with 2+ years of enterprise IT experience. I help colleagues resolve everyday hardware, software, account and connectivity issues across Windows and macOS environments.",
    about_p2: "My hands-on work includes L1–L3 support, laptop and peripheral setup, Microsoft 365, Active Directory, DNS/DHCP, LAN/WAN troubleshooting and network administration with Cisco and MikroTik. I also automate routine support tasks with Python and maintain servers, VoIP and security systems.",
    about_p3: "I learn fast, document everything, and care about making systems that actually work in production — not just on my machine.",
    stat_helpdesk: "Helpdesk experience", stat_cicd: "Automated pipelines",
    stat_cisco: "+ MikroTik networking", stat_docker: "Containerised deployments",
    skills_title: "What I work with",
    skills_support: "IT Support & End-User Systems", skills_sys: "Systems Administration",
    skills_devops: "DevOps & Cloud", skills_dev: "Development & Automation",
    skills_network: "Networking",
    projects_title: "Things I've built",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Portfolio CI/CD Pipeline",
    proj1_desc: "This site. Built from scratch as a hands-on DevOps project — FastAPI backend, static HTML/CSS frontend, Nginx reverse proxy, all containerised with Docker Compose. Fully automated CI/CD pipeline via GitHub Actions: pytest runs on every push, Docker image builds, and the server redeploys automatically on green CI.",
    proj2_tag: "Networking · Systems", proj2_title: "Network Infrastructure Setup",
    proj2_desc: "Designed and configured enterprise network infrastructure including VLAN segmentation, VPN tunnels, firewall rules, and routing on Cisco and MikroTik hardware. Managed user access, server services, and ensured uptime across the environment.",
    proj3_tag: "Python · Automation", proj3_title: "IT Helpdesk Automation",
    proj3_desc: "Python scripts built during L1–L3 helpdesk work to automate repetitive tasks — user account provisioning, log parsing, service monitoring, and alerting. Reduced manual workload and improved response times across the support workflow.",
    proj_github: "GitHub →",
    contact_title: "Let's work together",
    contact_sub: "Based in Brno and open to IT support and systems administration roles. Choose a channel and get in touch.",
    contact_fab: "Contact me", contact_choose: "Choose a channel", contact_phone: "Phone",
    footer_built: "Built with FastAPI · Docker · GitHub Actions"
  },

  ua: {
    nav_about: "Про мене", nav_skills: "Навички", nav_projects: "Проєкти", nav_contact: "Контакт",
    hero_available: "Відкритий до роботи",
    role_devops: "DevOps-інженер", role_sysadmin: "Системний адміністратор",
    role_python: "Windows · macOS · Microsoft 365", role_helpdesk: "Фахівець IT-підтримки", role_cyber: "Мережі та зв’язок",
    hero_desc: "Допомагаю людям ефективно користуватися технікою: підтримую користувачів і пристрої, діагностую проблеми Windows, macOS та мереж і дбаю про стабільність систем.",
    hero_cta_work: "Мої проєкти", hero_cta_contact: "Написати мені",
    about_title: "Хто я",
    about_p1: "Я фахівець з IT-підтримки з Брно, Чехія, маю понад два роки досвіду в корпоративному IT. Допомагаю колегам вирішувати щоденні проблеми з обладнанням, програмами, обліковими записами та підключенням у Windows і macOS.",
    about_p2: "Маю практичний досвід підтримки L1–L3, підготовки ноутбуків і периферії, Microsoft 365, Active Directory, DNS/DHCP, діагностики LAN/WAN та адміністрування мереж Cisco і MikroTik. Також автоматизую рутинні задачі підтримки на Python та обслуговую сервери, VoIP і системи безпеки.",
    about_p3: "Швидко навчаюся, документую все і прагну створювати системи, які справді працюють в production — а не лише на моїй машині.",
    stat_helpdesk: "Досвід підтримки", stat_cicd: "Автоматизовані пайплайни",
    stat_cisco: "+ Мережі MikroTik", stat_docker: "Контейнеризовані деплої",
    skills_title: "З чим я працюю",
    skills_support: "IT-підтримка та робочі пристрої", skills_sys: "Системне адміністрування",
    skills_devops: "DevOps та хмара", skills_dev: "Розробка та автоматизація",
    skills_network: "Мережі",
    projects_title: "Що я побудував",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "CI/CD Пайплайн Портфоліо",
    proj1_desc: "Цей сайт. Побудований з нуля як практичний DevOps-проєкт — FastAPI бекенд, статичний HTML/CSS фронтенд, Nginx зворотній проксі, все контейнеризовано в Docker Compose. Повністю автоматизований CI/CD через GitHub Actions.",
    proj2_tag: "Мережі · Системи", proj2_title: "Налаштування Мережевої Інфраструктури",
    proj2_desc: "Розробив та налаштував корпоративну мережеву інфраструктуру: сегментацію VLAN, VPN-тунелі, правила фаєрволу та маршрутизацію на обладнанні Cisco та MikroTik.",
    proj3_tag: "Python · Автоматизація", proj3_title: "Автоматизація IT-підтримки",
    proj3_desc: "Python-скрипти для автоматизації рутинних завдань під час роботи в L1–L3 підтримці — створення облікових записів, парсинг логів, моніторинг сервісів та сповіщення.",
    proj_github: "GitHub →",
    contact_title: "Давайте працювати разом",
    contact_sub: "Знаходжуся в Брно та розглядаю позиції в IT-підтримці й системному адмініструванні. Оберіть зручний спосіб зв’язку.",
    contact_fab: "Зв’язатися", contact_choose: "Оберіть спосіб зв’язку", contact_phone: "Телефон",
    footer_built: "Побудовано з FastAPI · Docker · GitHub Actions"
  },

  cs: {
    nav_about: "O mně", nav_skills: "Dovednosti", nav_projects: "Projekty", nav_contact: "Kontakt",
    hero_available: "Hledám práci",
    role_devops: "DevOps Engineer", role_sysadmin: "Správce systémů",
    role_python: "Windows · macOS · Microsoft 365", role_helpdesk: "Specialista IT podpory", role_cyber: "Sítě a konektivita",
    hero_desc: "Pomáhám lidem používat technologie bez problémů. Podporuji uživatele a zařízení, řeším problémy ve Windows, macOS a sítích a udržuji systémy spolehlivé.",
    hero_cta_work: "Moje projekty", hero_cta_contact: "Kontaktujte mě",
    about_title: "Kdo jsem",
    about_p1: "Jsem specialista IT podpory z Brna s více než dvěma lety zkušeností v podnikovém IT. Pomáhám kolegům řešit běžné problémy s hardwarem, softwarem, účty a připojením ve Windows a macOS.",
    about_p2: "Mám praktické zkušenosti s podporou L1–L3, přípravou notebooků a periferií, Microsoft 365, Active Directory, DNS/DHCP, diagnostikou LAN/WAN a správou sítí Cisco a MikroTik. Rutinní úkoly podpory také automatizuji v Pythonu a spravuji servery, VoIP a bezpečnostní systémy.",
    about_p3: "Rychle se učím, vše dokumentuji a záleží mi na systémech, které skutečně fungují v produkci.",
    stat_helpdesk: "Zkušenosti s podporou", stat_cicd: "Automatizované pipeline",
    stat_cisco: "+ Sítě MikroTik", stat_docker: "Kontejnerizované nasazení",
    skills_title: "S čím pracuji",
    skills_support: "IT podpora a zařízení uživatelů", skills_sys: "Správa systémů",
    skills_devops: "DevOps a cloud", skills_dev: "Vývoj a automatizace",
    skills_network: "Sítě",
    projects_title: "Co jsem vytvořil",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "CI/CD Pipeline Portfolia",
    proj1_desc: "Tento web. Postaven od základu jako praktický DevOps projekt — FastAPI backend, statický HTML/CSS frontend, Nginx reverzní proxy, vše kontejnerizováno v Docker Compose. Plně automatizovaný CI/CD pipeline přes GitHub Actions.",
    proj2_tag: "Sítě · Systémy", proj2_title: "Nastavení Síťové Infrastruktury",
    proj2_desc: "Navrhl a nakonfiguroval firemní síťovou infrastrukturu včetně segmentace VLAN, VPN tunelů, pravidel firewallu a směrování na zařízeních Cisco a MikroTik.",
    proj3_tag: "Python · Automatizace", proj3_title: "Automatizace IT Podpory",
    proj3_desc: "Python skripty pro automatizaci opakujících se úkolů — vytváření účtů, parsování logů, monitoring služeb a upozornění. Snížení manuální práce a zlepšení doby odezvy.",
    proj_github: "GitHub →",
    contact_title: "Pojďme spolupracovat",
    contact_sub: "Působím v Brně a hledám pozice v IT podpoře a správě systémů. Vyberte si způsob kontaktu.",
    contact_fab: "Kontaktovat", contact_choose: "Vyberte způsob kontaktu", contact_phone: "Telefon",
    footer_built: "Postaveno s FastAPI · Docker · GitHub Actions"
  },

  pl: {
    nav_about: "O mnie", nav_skills: "Umiejętności", nav_projects: "Projekty", nav_contact: "Kontakt",
    hero_available: "Otwarty na pracę",
    role_devops: "Inżynier DevOps", role_sysadmin: "Administrator systemów",
    role_python: "Windows · macOS · Microsoft 365", role_helpdesk: "Specjalista wsparcia IT", role_cyber: "Sieci i łączność",
    hero_desc: "Pomagam ludziom sprawnie korzystać z technologii. Wspieram użytkowników i urządzenia, rozwiązuję problemy z Windows, macOS i siecią oraz dbam o niezawodne systemy.",
    hero_cta_work: "Moje projekty", hero_cta_contact: "Skontaktuj się",
    about_title: "Kim jestem",
    about_p1: "Jestem specjalistą wsparcia IT z Brna, z ponad dwuletnim doświadczeniem w firmowym IT. Pomagam współpracownikom rozwiązywać codzienne problemy ze sprzętem, oprogramowaniem, kontami i łącznością w systemach Windows i macOS.",
    about_p2: "Mam praktyczne doświadczenie we wsparciu L1–L3, przygotowaniu laptopów i urządzeń peryferyjnych, Microsoft 365, Active Directory, DNS/DHCP, diagnostyce LAN/WAN oraz administracji sieciami Cisco i MikroTik. Automatyzuję też rutynowe zadania wsparcia w Pythonie i obsługuję serwery, VoIP oraz systemy bezpieczeństwa.",
    about_p3: "Szybko się uczę, dokumentuję wszystko i zależy mi na systemach, które naprawdę działają na produkcji.",
    stat_helpdesk: "Doświadczenie wsparcia", stat_cicd: "Zautomatyzowane pipeline",
    stat_cisco: "+ Sieci MikroTik", stat_docker: "Wdrożenia kontenerowe",
    skills_title: "Z czym pracuję",
    skills_support: "Wsparcie IT i urządzenia użytkowników", skills_sys: "Administracja systemami",
    skills_devops: "DevOps i chmura", skills_dev: "Programowanie i automatyzacja",
    skills_network: "Sieci",
    projects_title: "Co zbudowałem",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Pipeline CI/CD Portfolio",
    proj1_desc: "Ta strona. Zbudowana od podstaw jako projekt DevOps — backend FastAPI, statyczny frontend HTML/CSS, reverse proxy Nginx, wszystko skonteneryzowane w Docker Compose. W pełni zautomatyzowany CI/CD przez GitHub Actions.",
    proj2_tag: "Sieci · Systemy", proj2_title: "Konfiguracja Infrastruktury Sieciowej",
    proj2_desc: "Zaprojektowałem i skonfigurowałem infrastrukturę sieciową przedsiębiorstwa z segmentacją VLAN, tunelami VPN, regułami firewalla i routingiem na sprzęcie Cisco i MikroTik.",
    proj3_tag: "Python · Automatyzacja", proj3_title: "Automatyzacja Helpdesku IT",
    proj3_desc: "Skrypty Python do automatyzacji powtarzalnych zadań — tworzenie kont użytkowników, parsowanie logów, monitorowanie usług i powiadomienia. Zmniejszenie nakładu pracy i poprawa czasu reakcji.",
    proj_github: "GitHub →",
    contact_title: "Współpracujmy razem",
    contact_sub: "Mieszkam w Brnie i szukam pracy w obszarze wsparcia IT oraz administracji systemami. Wybierz dogodny sposób kontaktu.",
    contact_fab: "Kontakt", contact_choose: "Wybierz sposób kontaktu", contact_phone: "Telefon",
    footer_built: "Zbudowane z FastAPI · Docker · GitHub Actions"
  },

  de: {
    nav_about: "Über mich", nav_skills: "Fähigkeiten", nav_projects: "Projekte", nav_contact: "Kontakt",
    hero_available: "Offen für Stellen",
    role_devops: "DevOps Engineer", role_sysadmin: "Systemadministrator",
    role_python: "Windows · macOS · Microsoft 365", role_helpdesk: "IT-Support-Spezialist", role_cyber: "Netzwerke & Konnektivität",
    hero_desc: "Ich helfe Menschen, ihre Technik zuverlässig zu nutzen. Ich unterstütze Anwender und Geräte, löse Probleme mit Windows, macOS und Netzwerken und halte Geschäftssysteme am Laufen.",
    hero_cta_work: "Meine Projekte", hero_cta_contact: "Kontakt aufnehmen",
    about_title: "Wer ich bin",
    about_p1: "Ich bin IT-Support-Spezialist aus Brünn mit mehr als zwei Jahren Erfahrung in der Unternehmens-IT. Ich helfe Kolleginnen und Kollegen bei alltäglichen Hardware-, Software-, Konto- und Verbindungsproblemen unter Windows und macOS.",
    about_p2: "Meine praktische Erfahrung umfasst L1–L3-Support, die Einrichtung von Laptops und Peripheriegeräten, Microsoft 365, Active Directory, DNS/DHCP, LAN/WAN-Diagnose und die Netzwerkverwaltung mit Cisco und MikroTik. Außerdem automatisiere ich Support-Aufgaben mit Python und betreue Server, VoIP und Sicherheitssysteme.",
    about_p3: "Ich lerne schnell, dokumentiere alles und kümmere mich um Systeme, die tatsächlich in der Produktion funktionieren.",
    stat_helpdesk: "Helpdesk-Erfahrung", stat_cicd: "Automatisierte Pipelines",
    stat_cisco: "+ MikroTik Netzwerke", stat_docker: "Containerisierte Deployments",
    skills_title: "Womit ich arbeite",
    skills_support: "IT-Support & Endgeräte", skills_sys: "Systemadministration",
    skills_devops: "DevOps & Cloud", skills_dev: "Entwicklung & Automatisierung",
    skills_network: "Netzwerke",
    projects_title: "Was ich gebaut habe",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Portfolio CI/CD-Pipeline",
    proj1_desc: "Diese Website. Von Grund auf als praktisches DevOps-Projekt entwickelt — FastAPI-Backend, statisches HTML/CSS-Frontend, Nginx-Reverse-Proxy, alles containerisiert mit Docker Compose. Vollständig automatisierte CI/CD-Pipeline über GitHub Actions.",
    proj2_tag: "Netzwerke · Systeme", proj2_title: "Netzwerkinfrastruktur-Setup",
    proj2_desc: "Entwurf und Konfiguration der Unternehmensnetzwerkinfrastruktur einschließlich VLAN-Segmentierung, VPN-Tunneln, Firewall-Regeln und Routing auf Cisco- und MikroTik-Hardware.",
    proj3_tag: "Python · Automatisierung", proj3_title: "IT-Helpdesk-Automatisierung",
    proj3_desc: "Python-Skripte zur Automatisierung wiederkehrender Aufgaben — Benutzerkontenverwaltung, Log-Parsing, Service-Monitoring und Benachrichtigungen. Reduzierung des manuellen Aufwands.",
    proj_github: "GitHub →",
    contact_title: "Zusammenarbeiten",
    contact_sub: "Ich bin in Brünn und suche eine Stelle im IT-Support oder in der Systemadministration. Wählen Sie einen Kontaktweg.",
    contact_fab: "Kontakt", contact_choose: "Kontaktweg auswählen", contact_phone: "Telefon",
    footer_built: "Erstellt mit FastAPI · Docker · GitHub Actions"
  }
};

/* ── Language detection & switching ──────────── */
function detectLanguage() {
  const saved = localStorage.getItem('lang');
  if (saved && i18n[saved]) return saved;
  const browser = navigator.language.split('-')[0];
  const map = { uk: 'ua', cs: 'cs', pl: 'pl', de: 'de' };
  return map[browser] || 'en';
}

let currentLang = detectLanguage();

function applyLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.documentElement.lang = lang;
  document.body.classList.add('lang-switching');

  setTimeout(() => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    document.body.classList.remove('lang-switching');
  }, 200);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

applyLanguage(currentLang);

/* ── Custom cursor ────────────────────────────── */
if (window.innerWidth > 768) {
  const cursor     = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursor.className     = 'cursor';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursor, cursorRing);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();
}

/* ── Scroll-based nav ─────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Active nav link ──────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ── Scroll reveal ────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.reveal-child').forEach(el => el.classList.add('visible'));
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-section').forEach(s => revealObserver.observe(s));

/* ── Quick contact menu ───────────────────────── */
const contactWidget = document.getElementById('contactWidget');
const contactFab = document.getElementById('contactFab');
const contactPopover = document.getElementById('contactPopover');

function setContactMenuOpen(open) {
  if (!contactFab || !contactPopover) return;
  if ((contactFab.getAttribute('aria-expanded') === 'true') === open) return;
  contactPopover.hidden = !open;
  contactFab.setAttribute('aria-expanded', String(open));
  if (open) contactPopover.querySelector('a')?.focus();
  else contactFab.focus();
}

contactFab?.addEventListener('click', () => {
  setContactMenuOpen(contactFab.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('click', event => {
  if (contactWidget && !contactWidget.contains(event.target)) setContactMenuOpen(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && contactFab?.getAttribute('aria-expanded') === 'true') {
    setContactMenuOpen(false);
  }
});

/* ── Terminal typewriter ──────────────────────── */
const termLines = [
  { type: 'cmd',     text: 'docker compose up -d' },
  { type: 'out',     text: '✔ Network created' },
  { type: 'out',     text: '✔ backend  — running on :8000' },
  { type: 'success', text: '✔ nginx    — listening on :80' },
  { type: 'cmd',     text: 'pytest backend/ -v' },
  { type: 'success', text: 'PASSED test_health [ 100% ]' },
  { type: 'cmd',     text: 'git push origin main' },
  { type: 'info',    text: '→ CI/CD pipeline triggered' },
  { type: 'success', text: '✔ Deployed successfully' },
];

function initTerminal() {
  const termBody = document.getElementById('termBody');
  if (!termBody) return;

  termLines.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 't-line';

    if (line.type === 'cmd') {
      p.innerHTML = `<span class="t-prompt">$</span> ${line.text}`;
    } else if (line.type === 'success') {
      p.innerHTML = `<span class="t-out t-success">${line.text}</span>`;
    } else if (line.type === 'info') {
      p.innerHTML = `<span class="t-out t-info">${line.text}</span>`;
    } else {
      p.innerHTML = `<span class="t-out">${line.text}</span>`;
    }

    termBody.appendChild(p);
    setTimeout(() => p.classList.add('visible'), 800 + i * 240);
  });

  setTimeout(() => {
    const cur = document.createElement('p');
    cur.innerHTML = `<span class="t-prompt">$</span><span class="t-cursor"></span>`;
    cur.className = 't-line';
    termBody.appendChild(cur);
    setTimeout(() => cur.classList.add('visible'), 100);
  }, 800 + termLines.length * 240);
}

window.addEventListener('load', initTerminal);

/* ── Mobile burger ────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks2 = document.querySelector('.nav-links');

if (burger) {
  burger.addEventListener('click', () => {
    const open = navLinks2.style.display === 'flex';
    navLinks2.style.display = open ? 'none' : 'flex';
    navLinks2.style.flexDirection = 'column';
    navLinks2.style.position = 'absolute';
    navLinks2.style.top = '60px';
    navLinks2.style.left = '0';
    navLinks2.style.right = '0';
    navLinks2.style.background = 'var(--gray)';
    navLinks2.style.padding = '20px 24px';
    navLinks2.style.gap = '16px';
    navLinks2.style.borderBottom = '1px solid var(--gray2)';
  });
}
