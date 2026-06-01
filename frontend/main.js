/* ── Translations ─────────────────────────────── */
const i18n = {
  en: {
    nav_about: "About", nav_skills: "Skills", nav_projects: "Projects", nav_contact: "Contact",
    hero_available: "Available for work",
    role_devops: "DevOps Engineer", role_sysadmin: "Systems Administrator",
    role_python: "Python Developer", role_helpdesk: "IT Helpdesk L1–L3", role_cyber: "Cybersecurity",
    hero_desc: "I build, automate, and secure infrastructure. From bare-metal server configuration to containerised CI/CD pipelines — I make systems work reliably.",
    hero_cta_work: "See my work", hero_cta_contact: "Get in touch",
    about_title: "Who I am",
    about_p1: "I'm a systems-minded engineer based in Czech Republic with hands-on experience across the full IT stack — from plugging in network cables to writing Python automation scripts and deploying containerised applications.",
    about_p2: "My background spans IT helpdesk (L1–L3), network administration with Cisco and MikroTik, VPN and VLAN configuration, server and user service management, and cybersecurity fundamentals. More recently I've been pushing into DevOps — building CI/CD pipelines, working with Docker, and getting comfortable with cloud infrastructure.",
    about_p3: "I learn fast, document everything, and care about making systems that actually work in production — not just on my machine.",
    stat_helpdesk: "Helpdesk experience", stat_cicd: "Automated pipelines",
    stat_cisco: "+ MikroTik networking", stat_docker: "Containerised deployments",
    skills_title: "What I work with",
    skills_devops: "DevOps & Cloud", skills_dev: "Development",
    skills_network: "Networking", skills_sys: "Systems & Security",
    projects_title: "Things I've built",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Portfolio CI/CD Pipeline",
    proj1_desc: "This site. Built from scratch as a hands-on DevOps project — FastAPI backend, static HTML/CSS frontend, Nginx reverse proxy, all containerised with Docker Compose. Fully automated CI/CD pipeline via GitHub Actions: pytest runs on every push, Docker image builds, and the server redeploys automatically on green CI.",
    proj2_tag: "Networking · Systems", proj2_title: "Network Infrastructure Setup",
    proj2_desc: "Designed and configured enterprise network infrastructure including VLAN segmentation, VPN tunnels, firewall rules, and routing on Cisco and MikroTik hardware. Managed user access, server services, and ensured uptime across the environment.",
    proj3_tag: "Python · Automation", proj3_title: "IT Helpdesk Automation",
    proj3_desc: "Python scripts built during L1–L3 helpdesk work to automate repetitive tasks — user account provisioning, log parsing, service monitoring, and alerting. Reduced manual workload and improved response times across the support workflow.",
    proj_github: "GitHub →",
    contact_title: "Let's work together",
    contact_sub: "Open to DevOps, sysadmin, or Python developer roles. Drop me a message.",
    footer_built: "Built with FastAPI · Docker · GitHub Actions"
  },

  ua: {
    nav_about: "Про мене", nav_skills: "Навички", nav_projects: "Проєкти", nav_contact: "Контакт",
    hero_available: "Відкритий до роботи",
    role_devops: "DevOps Інженер", role_sysadmin: "Системний Адміністратор",
    role_python: "Python Розробник", role_helpdesk: "IT Підтримка L1–L3", role_cyber: "Кібербезпека",
    hero_desc: "Я будую, автоматизую та захищаю інфраструктуру. Від налаштування серверів до контейнеризованих CI/CD пайплайнів — я роблю системи надійними.",
    hero_cta_work: "Мої проєкти", hero_cta_contact: "Написати мені",
    about_title: "Хто я",
    about_p1: "Я інженер з системним мисленням, що базується в Чехії. Маю практичний досвід у повному IT-стеку — від підключення мережевого обладнання до написання скриптів автоматизації на Python та розгортання контейнеризованих застосунків.",
    about_p2: "Мій досвід охоплює IT-підтримку (L1–L3), адміністрування мереж Cisco та MikroTik, налаштування VPN та VLAN, управління серверами та користувачами, а також основи кібербезпеки. Останнім часом я активно розвиваюся в напрямку DevOps — будую CI/CD пайплайни, працюю з Docker та хмарною інфраструктурою.",
    about_p3: "Швидко навчаюся, документую все і прагну створювати системи, які справді працюють в production — а не лише на моїй машині.",
    stat_helpdesk: "Досвід підтримки", stat_cicd: "Автоматизовані пайплайни",
    stat_cisco: "+ Мережі MikroTik", stat_docker: "Контейнеризовані деплої",
    skills_title: "З чим я працюю",
    skills_devops: "DevOps та Хмара", skills_dev: "Розробка",
    skills_network: "Мережі", skills_sys: "Системи та Безпека",
    projects_title: "Що я побудував",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "CI/CD Пайплайн Портфоліо",
    proj1_desc: "Цей сайт. Побудований з нуля як практичний DevOps-проєкт — FastAPI бекенд, статичний HTML/CSS фронтенд, Nginx зворотній проксі, все контейнеризовано в Docker Compose. Повністю автоматизований CI/CD через GitHub Actions.",
    proj2_tag: "Мережі · Системи", proj2_title: "Налаштування Мережевої Інфраструктури",
    proj2_desc: "Розробив та налаштував корпоративну мережеву інфраструктуру: сегментацію VLAN, VPN-тунелі, правила фаєрволу та маршрутизацію на обладнанні Cisco та MikroTik.",
    proj3_tag: "Python · Автоматизація", proj3_title: "Автоматизація IT-підтримки",
    proj3_desc: "Python-скрипти для автоматизації рутинних завдань під час роботи в L1–L3 підтримці — створення облікових записів, парсинг логів, моніторинг сервісів та сповіщення.",
    proj_github: "GitHub →",
    contact_title: "Давайте працювати разом",
    contact_sub: "Розглядаю позиції DevOps, системного адміністратора або Python-розробника.",
    footer_built: "Побудовано з FastAPI · Docker · GitHub Actions"
  },

  cs: {
    nav_about: "O mně", nav_skills: "Dovednosti", nav_projects: "Projekty", nav_contact: "Kontakt",
    hero_available: "Hledám práci",
    role_devops: "DevOps Inženýr", role_sysadmin: "Správce systémů",
    role_python: "Python Vývojář", role_helpdesk: "IT Podpora L1–L3", role_cyber: "Kybernetická bezpečnost",
    hero_desc: "Buduju, automatizuji a zabezpečuji infrastrukturu. Od konfigurace serverů po kontejnerizované CI/CD pipeline — starám se o spolehlivé fungování systémů.",
    hero_cta_work: "Moje projekty", hero_cta_contact: "Kontaktujte mě",
    about_title: "Kdo jsem",
    about_p1: "Jsem inženýr se systémovým myšlením žijící v České republice. Mám praktické zkušenosti s celým IT stackem — od zapojení síťových kabelů po psaní automatizačních skriptů v Pythonu a nasazování kontejnerizovaných aplikací.",
    about_p2: "Moje zkušenosti zahrnují IT podporu (L1–L3), správu sítí Cisco a MikroTik, konfiguraci VPN a VLAN, správu serverů a uživatelů a základy kybernetické bezpečnosti. V poslední době se věnuji DevOps — CI/CD pipeline, Docker a cloudová infrastruktura.",
    about_p3: "Rychle se učím, vše dokumentuji a záleží mi na systémech, které skutečně fungují v produkci.",
    stat_helpdesk: "Zkušenosti s podporou", stat_cicd: "Automatizované pipeline",
    stat_cisco: "+ Sítě MikroTik", stat_docker: "Kontejnerizované nasazení",
    skills_title: "S čím pracuji",
    skills_devops: "DevOps a Cloud", skills_dev: "Vývoj",
    skills_network: "Sítě", skills_sys: "Systémy a Bezpečnost",
    projects_title: "Co jsem vytvořil",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "CI/CD Pipeline Portfolia",
    proj1_desc: "Tento web. Postaven od základu jako praktický DevOps projekt — FastAPI backend, statický HTML/CSS frontend, Nginx reverzní proxy, vše kontejnerizováno v Docker Compose. Plně automatizovaný CI/CD pipeline přes GitHub Actions.",
    proj2_tag: "Sítě · Systémy", proj2_title: "Nastavení Síťové Infrastruktury",
    proj2_desc: "Navrhl a nakonfiguroval firemní síťovou infrastrukturu včetně segmentace VLAN, VPN tunelů, pravidel firewallu a směrování na zařízeních Cisco a MikroTik.",
    proj3_tag: "Python · Automatizace", proj3_title: "Automatizace IT Podpory",
    proj3_desc: "Python skripty pro automatizaci opakujících se úkolů — vytváření účtů, parsování logů, monitoring služeb a upozornění. Snížení manuální práce a zlepšení doby odezvy.",
    proj_github: "GitHub →",
    contact_title: "Pojďme spolupracovat",
    contact_sub: "Hledám pozice DevOps, správce systémů nebo Python vývojáře.",
    footer_built: "Postaveno s FastAPI · Docker · GitHub Actions"
  },

  pl: {
    nav_about: "O mnie", nav_skills: "Umiejętności", nav_projects: "Projekty", nav_contact: "Kontakt",
    hero_available: "Otwarty na pracę",
    role_devops: "Inżynier DevOps", role_sysadmin: "Administrator Systemów",
    role_python: "Programista Python", role_helpdesk: "IT Helpdesk L1–L3", role_cyber: "Cyberbezpieczeństwo",
    hero_desc: "Buduję, automatyzuję i zabezpieczam infrastrukturę. Od konfiguracji serwerów po skonteneryzowane pipeline CI/CD — dbam o niezawodność systemów.",
    hero_cta_work: "Moje projekty", hero_cta_contact: "Skontaktuj się",
    about_title: "Kim jestem",
    about_p1: "Jestem inżynierem z myśleniem systemowym mieszkającym w Czechach. Posiadam praktyczne doświadczenie w całym stosie IT — od podłączania kabli sieciowych po pisanie skryptów automatyzacji w Pythonie i wdrażanie skonteneryzowanych aplikacji.",
    about_p2: "Moje doświadczenie obejmuje wsparcie IT (L1–L3), administrację sieciami Cisco i MikroTik, konfigurację VPN i VLAN, zarządzanie serwerami i użytkownikami oraz podstawy cyberbezpieczeństwa. Ostatnio rozwijam się w kierunku DevOps.",
    about_p3: "Szybko się uczę, dokumentuję wszystko i zależy mi na systemach, które naprawdę działają na produkcji.",
    stat_helpdesk: "Doświadczenie wsparcia", stat_cicd: "Zautomatyzowane pipeline",
    stat_cisco: "+ Sieci MikroTik", stat_docker: "Wdrożenia kontenerowe",
    skills_title: "Z czym pracuję",
    skills_devops: "DevOps i Chmura", skills_dev: "Programowanie",
    skills_network: "Sieci", skills_sys: "Systemy i Bezpieczeństwo",
    projects_title: "Co zbudowałem",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Pipeline CI/CD Portfolio",
    proj1_desc: "Ta strona. Zbudowana od podstaw jako projekt DevOps — backend FastAPI, statyczny frontend HTML/CSS, reverse proxy Nginx, wszystko skonteneryzowane w Docker Compose. W pełni zautomatyzowany CI/CD przez GitHub Actions.",
    proj2_tag: "Sieci · Systemy", proj2_title: "Konfiguracja Infrastruktury Sieciowej",
    proj2_desc: "Zaprojektowałem i skonfigurowałem infrastrukturę sieciową przedsiębiorstwa z segmentacją VLAN, tunelami VPN, regułami firewalla i routingiem na sprzęcie Cisco i MikroTik.",
    proj3_tag: "Python · Automatyzacja", proj3_title: "Automatyzacja Helpdesku IT",
    proj3_desc: "Skrypty Python do automatyzacji powtarzalnych zadań — tworzenie kont użytkowników, parsowanie logów, monitorowanie usług i powiadomienia. Zmniejszenie nakładu pracy i poprawa czasu reakcji.",
    proj_github: "GitHub →",
    contact_title: "Współpracujmy razem",
    contact_sub: "Szukam stanowisk DevOps, administratora systemów lub programisty Python.",
    footer_built: "Zbudowane z FastAPI · Docker · GitHub Actions"
  },

  de: {
    nav_about: "Über mich", nav_skills: "Fähigkeiten", nav_projects: "Projekte", nav_contact: "Kontakt",
    hero_available: "Offen für Stellen",
    role_devops: "DevOps Engineer", role_sysadmin: "Systemadministrator",
    role_python: "Python Entwickler", role_helpdesk: "IT Helpdesk L1–L3", role_cyber: "Cybersicherheit",
    hero_desc: "Ich baue, automatisiere und sichere Infrastrukturen. Von der Server-Konfiguration bis zu containerisierten CI/CD-Pipelines — ich sorge für zuverlässige Systeme.",
    hero_cta_work: "Meine Projekte", hero_cta_contact: "Kontakt aufnehmen",
    about_title: "Wer ich bin",
    about_p1: "Ich bin ein systemorientierter Ingenieur mit Sitz in der Tschechischen Republik und praktischer Erfahrung im gesamten IT-Stack — vom Anschließen von Netzwerkkabeln bis zum Schreiben von Python-Automatisierungsskripten und Bereitstellen von containerisierten Anwendungen.",
    about_p2: "Mein Hintergrund umfasst IT-Support (L1–L3), Netzwerkadministration mit Cisco und MikroTik, VPN- und VLAN-Konfiguration, Server- und Benutzerverwaltung sowie Grundlagen der Cybersicherheit. In letzter Zeit entwickle ich mich im Bereich DevOps weiter.",
    about_p3: "Ich lerne schnell, dokumentiere alles und kümmere mich um Systeme, die tatsächlich in der Produktion funktionieren.",
    stat_helpdesk: "Helpdesk-Erfahrung", stat_cicd: "Automatisierte Pipelines",
    stat_cisco: "+ MikroTik Netzwerke", stat_docker: "Containerisierte Deployments",
    skills_title: "Womit ich arbeite",
    skills_devops: "DevOps & Cloud", skills_dev: "Entwicklung",
    skills_network: "Netzwerke", skills_sys: "Systeme & Sicherheit",
    projects_title: "Was ich gebaut habe",
    proj1_tag: "DevOps · Python · Docker", proj1_title: "Portfolio CI/CD-Pipeline",
    proj1_desc: "Diese Website. Von Grund auf als praktisches DevOps-Projekt entwickelt — FastAPI-Backend, statisches HTML/CSS-Frontend, Nginx-Reverse-Proxy, alles containerisiert mit Docker Compose. Vollständig automatisierte CI/CD-Pipeline über GitHub Actions.",
    proj2_tag: "Netzwerke · Systeme", proj2_title: "Netzwerkinfrastruktur-Setup",
    proj2_desc: "Entwurf und Konfiguration der Unternehmensnetzwerkinfrastruktur einschließlich VLAN-Segmentierung, VPN-Tunneln, Firewall-Regeln und Routing auf Cisco- und MikroTik-Hardware.",
    proj3_tag: "Python · Automatisierung", proj3_title: "IT-Helpdesk-Automatisierung",
    proj3_desc: "Python-Skripte zur Automatisierung wiederkehrender Aufgaben — Benutzerkontenverwaltung, Log-Parsing, Service-Monitoring und Benachrichtigungen. Reduzierung des manuellen Aufwands.",
    proj_github: "GitHub →",
    contact_title: "Zusammenarbeiten",
    contact_sub: "Offen für DevOps-, Systemadministrator- oder Python-Entwickler-Stellen.",
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

const termBody = document.getElementById('termBody');

if (termBody) {
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

    setTimeout(() => p.classList.add('visible'), 600 + i * 220);
  });

  // cursor at end
  setTimeout(() => {
    const cur = document.createElement('p');
    cur.innerHTML = `<span class="t-prompt">$</span><span class="t-cursor"></span>`;
    cur.className = 't-line';
    termBody.appendChild(cur);
    setTimeout(() => cur.classList.add('visible'), 100);
  }, 600 + termLines.length * 220);
}

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
