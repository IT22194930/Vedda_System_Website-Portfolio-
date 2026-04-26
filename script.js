/* ===================================================
   VEDDA CULTURE PRESERVATION — SITE LOGIC
   =================================================== */

// ---- EmailJS Configuration ----
const EMAILJS_PUBLIC_KEY = 'KjD2Nu5tspr9mZQx9';
const EMAILJS_SERVICE_ID = 'service_m2a1b3e';
const EMAILJS_TEMPLATE_ID = 'template_e2h1om8';

// Initialize EmailJS
if (typeof window.emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  window.emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ---- State ----
let currentPage = 'home';
let mobileNavOpen = false;

// ---- Navigation ----
function navigateTo(page) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  
  // Show target section
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
  }

  // Update nav links
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Close mobile nav
  if (mobileNavOpen) toggleMobileNav();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update page state
  currentPage = page;

  // Trigger reveal animations
  setTimeout(triggerReveals, 100);

  // Update URL hash
  history.pushState(null, '', '#' + page);
}

// ---- Mobile Nav Toggle ----
function toggleMobileNav() {
  mobileNavOpen = !mobileNavOpen;
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  
  nav.classList.toggle('open', mobileNavOpen);
  btn.classList.toggle('open', mobileNavOpen);
  
  // Prevent body scroll when mobile nav is open
  document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
}

// ---- Milestones ----
function showMilestone(id) {
  document.querySelectorAll('.milestone-detail').forEach(d => d.classList.remove('active'));
  const detail = document.getElementById('milestone-' + id);
  if (detail) {
    detail.classList.add('active');
    // Add animation
    detail.style.animation = 'none';
    detail.offsetHeight; // Force reflow
    detail.style.animation = '';
  }

  // Update timeline nodes
  document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
  // Find matching node
  const milestoneMap = { proposal: 0, pp1: 1, pp2: 2, final: 3, viva: 4 };
  const nodes = document.querySelectorAll('.timeline-node');
  if (nodes[milestoneMap[id]]) {
    nodes[milestoneMap[id]].classList.add('active');
  }
}

function selectMilestone(id) {
  const dropdown = document.getElementById('milestoneDropdown');
  if (dropdown) {
    dropdown.value = id;
    showMilestone(id);
  }
}

// ---- Contact Form ----
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  const form = e.target;

  // Get form data
  const name = form.querySelector('#contactName').value;
  const email = form.querySelector('#contactEmail').value;
  const subject = form.querySelector('#contactSubject').value;
  const message = form.querySelector('#contactMessage').value;

  // Check if EmailJS is configured
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
    // EmailJS not configured - show demo mode
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Demo: Message Ready
    `;
    btn.style.background = '#377E2F';
    btn.disabled = true;
    
    console.log('EmailJS Demo Mode - Message not sent (credentials not configured):', {
      name, email, subject, message
    });
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
    return;
  }

  // Show loading state
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    Sending...
  `;
  btn.disabled = true;

  if (typeof window.emailjs === 'undefined') {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Email Service Unavailable
    `;
    btn.style.background = '#D32F2F';
    console.error('EmailJS library not loaded. Check the CDN script tag and internet access.');

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
    return;
  }

  // Send email via EmailJS
  window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: 'heshanchamika100@gmail.com', // Recipient email
    name: name,
    email: email,
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    reply_to: email
  }).then(
    (response) => {
      // Success
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Message Sent!
      `;
      btn.style.background = '#027A48';
      console.log('Email sent successfully:', response);
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    },
    (error) => {
      // Error
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Error Sending
      `;
      btn.style.background = '#D32F2F';
      console.error('Error sending email:', error);
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  );
}

// ---- Scroll-triggered reveal animations ----
function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight - 50;
    
    if (visible) {
      // Stagger animation
      setTimeout(() => el.classList.add('visible'), i * 80);
    }
  });
}

// ---- Navbar scroll effect ----
function handleScroll() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  triggerReveals();
}

// ---- Handle browser back/forward ----
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  // Handle initial hash
  const initialPage = window.location.hash.replace('#', '') || 'home';
  if (initialPage !== 'home') {
    navigateTo(initialPage);
  }

  // Initialize milestones (show Proposal by default)
  showMilestone('proposal');

  // Set up scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('hashchange', handleHashChange);

  // Initial reveal
  setTimeout(triggerReveals, 300);
});

// ---- Keyboard navigation support (accessibility) ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNavOpen) {
    toggleMobileNav();
  }
});


/* ===================================================
   SEARCH — Global & Local
   =================================================== */

// ---- Search Index ----
// Each entry: { icon, title, desc, page, pageLabel, action, isLink, href }
const SEARCH_INDEX = [
  // ── Home ──
  { icon: '🏠', title: 'Home', desc: 'Digital Preservation of Sri Lankan Indigenous Vedda Culture', page: 'home', pageLabel: 'Home', action: () => navigateTo('home') },
  { icon: '📷', title: 'Field Research Gallery', desc: 'Vedda community site visits, traditional settlements, artifact documentation', page: 'home', pageLabel: 'Home', action: () => navigateTo('home') },
  { icon: '🔢', title: 'Project Statistics', desc: '< 300 remaining speakers, 4 research components, 3D phonetic modelling, AI powered', page: 'home', pageLabel: 'Home', action: () => navigateTo('home') },

  // ── Domain ──
  { icon: '📚', title: 'Literature Survey', desc: 'Cascaded translation pipelines, low-resource languages, phonemic transcription', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '❗', title: 'Research Problem', desc: 'Vedda language endangered, oral-only, fewer than 300 speakers, no written script', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '🔍', title: 'Research Gap', desc: 'Culturally-Contextualized Translation, gamified adaptive learning, low-resource phonetics, AI artifact documentation', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '🎯', title: 'Research Objectives', desc: 'Real-time translation, adaptive learning, 3D phonetic visualization, artifact identification', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '⚙️', title: 'Methodology', desc: 'Agile methodology, iterative sprints, system foundation, core module development, integration', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '💻', title: 'Technologies Used', desc: 'React, Vite, Node.js, Flask, MongoDB, TensorFlow, Whisper ASR, OpenAI GPT-4, Three.js, Docker, Azure', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '🏗️', title: 'System Architecture', desc: 'Microservices layout, API Gateway, containerised services, REST APIs', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },
  { icon: '📖', title: 'References', desc: 'Academic citations, speech translation pipelines, Sinhala NMT, digital heritage, OAIS, CIDOC CRM', page: 'domain', pageLabel: 'Domain', action: () => navigateTo('domain') },

  // ── Milestones ──
  { icon: '📅', title: 'Project Proposal & Viva', desc: 'Milestone 1 · Report deadline: 15 August 2025 · Presentation: 8–12 September 2025 · Weight: 12%', page: 'milestones', pageLabel: 'Milestones', action: () => { navigateTo('milestones'); setTimeout(() => selectMilestone('proposal'), 200); } },
  { icon: '📊', title: 'Progress Presentation 1 (PP1)', desc: 'Milestone 2 · 5–9 January 2026 · 50% complete demo · Weight: 15%', page: 'milestones', pageLabel: 'Milestones', action: () => { navigateTo('milestones'); setTimeout(() => selectMilestone('pp1'), 200); } },
  { icon: '📊', title: 'Progress Presentation 2 (PP2)', desc: 'Milestone 3 · 9–12 March 2026 · 90% complete integration · Weight: 18%', page: 'milestones', pageLabel: 'Milestones', action: () => { navigateTo('milestones'); setTimeout(() => selectMilestone('pp2'), 200); } },
  { icon: '✅', title: 'Final Assessment', desc: 'Milestone 4 · 27 April – 6 May 2026 · Full system · Weight: 55%', page: 'milestones', pageLabel: 'Milestones', action: () => { navigateTo('milestones'); setTimeout(() => selectMilestone('final'), 200); } },

  // ── Documents ──
  { icon: '📋', title: 'Project Charter', desc: 'Project scope, objectives, team responsibilities, initial research direction', page: 'documents', pageLabel: 'Documents', action: () => navigateTo('documents'), href: 'https://drive.google.com/drive/folders/1xTow8nK7-BVwQ290KuskbXmg9WXXuUZv?usp=sharing' },
  { icon: '📝', title: 'Proposal Document', desc: 'Full research proposal, problem statement, literature survey, objectives, methodology, commercialization plan', page: 'documents', pageLabel: 'Documents', action: () => navigateTo('documents'), href: 'https://drive.google.com/drive/folders/13PlTEwatGwwU9YjFgmElXAXwFGTSV_jK?usp=sharing' },
  { icon: '📊', title: 'Check List Documents', desc: 'Formal assessment checklists submitted across project milestones', page: 'documents', pageLabel: 'Documents', action: () => navigateTo('documents'), href: 'https://drive.google.com/drive/folders/1YONfWzekmCHyx0UoybrH0a6SMKz_B0zw?usp=sharing' },
  { icon: '📕', title: 'Final Report', desc: 'Complete final documentation, individual and group reports, research paper, logbook, supporting materials', page: 'documents', pageLabel: 'Documents', action: () => navigateTo('documents'), href: 'https://drive.google.com/drive/folders/1te-qpNHuyl1yVTougOqLjgJFfVgKzvgW?usp=sharing' },

  // ── Slides ──
  { icon: '🖥️', title: 'Proposal Presentation', desc: 'PPTX slides · Initial project proposal presentation', page: 'slides', pageLabel: 'Slides', action: () => navigateTo('slides'), href: 'https://drive.google.com/drive/folders/1fBH7fp0-nrLK8j6DkLEmVuUSVEUzlwYU?usp=sharing' },
  { icon: '🖥️', title: 'Progress Presentation 1', desc: 'PPTX slides · First progress review presentation', page: 'slides', pageLabel: 'Slides', action: () => navigateTo('slides'), href: 'https://drive.google.com/drive/folders/1g-0_lMEcjjNhtn99g-pXbsEL2cOXYEMG?usp=sharing' },
  { icon: '🖥️', title: 'Progress Presentation 2', desc: 'PPTX slides · Second progress review presentation', page: 'slides', pageLabel: 'Slides', action: () => navigateTo('slides'), href: 'https://drive.google.com/drive/folders/1JGETp13ZVKzlcVcE_iXSpx-PbnMFlngX?usp=sharing' },
  { icon: '🖥️', title: 'Final Presentation', desc: 'PPTX slides · Final assessment presentation', page: 'slides', pageLabel: 'Slides', action: () => navigateTo('slides'), href: 'https://drive.google.com/drive/folders/13JZrAaNvv4PbzjR3NCdB6CtqwFGP-ndX?usp=sharing' },

  // ── About ──
  { icon: '👩‍🏫', title: 'Ms. Hansi De Silva', desc: 'Supervisor · hansi.d@sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },
  { icon: '👩‍🏫', title: 'Ms. Thilini Jayalath', desc: 'Co-Supervisor · thilini.j@sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },
  { icon: '👨‍🎓', title: 'Welikanna S. T.', desc: 'IT22196910 · Gamified Learning · it22196910@my.sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },
  { icon: '👨‍🎓', title: 'Liyanage N. S.', desc: 'IT22144430 · Translator · it22144430@my.sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },
  { icon: '👨‍🎓', title: 'Peiris M. H. C.', desc: 'IT22194930 · Artifacts Preservation · it22194930@my.sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },
  { icon: '👨‍🎓', title: 'Wickramasooriya W. A. A. L.', desc: 'IT22126160 · 3D Phonetics · it22126160@my.sliit.lk', page: 'about', pageLabel: 'About', action: () => navigateTo('about') },

  // ── Contact ──
  { icon: '✉️', title: 'Contact Us', desc: 'Research collaboration, cultural partnerships, academic inquiries · SLIIT Malabe', page: 'contact', pageLabel: 'Contact', action: () => navigateTo('contact') },
  { icon: '📍', title: 'Location', desc: 'SLIIT Sri Lanka Institute of Information Technology, Malabe, Sri Lanka', page: 'contact', pageLabel: 'Contact', action: () => navigateTo('contact') },
];

// ---- Global Search State ----
let searchActive = false;
let searchFocusedIndex = -1;
let searchResults = [];

function openGlobalSearch() {
  const overlay = document.getElementById('globalSearchOverlay');
  const input = document.getElementById('globalSearchInput');
  overlay.classList.add('open');
  searchActive = true;
  document.body.style.overflow = 'hidden';
  // Reset
  searchFocusedIndex = -1;
  setTimeout(() => input.focus(), 50);
  // Show hint on open with no query
  if (!input.value) {
    renderSearchHint();
  }
}

function closeGlobalSearch(e) {
  if (e && e.target !== document.getElementById('globalSearchOverlay')) return;
  _closeGlobalSearch();
}

function _closeGlobalSearch() {
  const overlay = document.getElementById('globalSearchOverlay');
  overlay.classList.remove('open');
  searchActive = false;
  document.body.style.overflow = '';
}

function clearGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  input.value = '';
  input.focus();
  document.getElementById('searchClearBtn').style.display = 'none';
  renderSearchHint();
}

// Hint shown when search is empty
function renderSearchHint() {
  document.getElementById('globalSearchResults').innerHTML = `
    <div class="search-modal__hint">
      <div class="search-hint-item"><kbd>↑</kbd><kbd>↓</kbd> navigate</div>
      <div class="search-hint-item"><kbd>↵</kbd> open</div>
      <div class="search-hint-item"><kbd>Esc</kbd> close</div>
    </div>
  `;
  searchResults = [];
  searchFocusedIndex = -1;
}

// ---- Core search logic ----
function runGlobalSearch(query) {
  const clearBtn = document.getElementById('searchClearBtn');
  clearBtn.style.display = query.length ? 'flex' : 'none';

  if (!query.trim()) {
    renderSearchHint();
    return;
  }

  const q = query.toLowerCase().trim();
  const matched = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.pageLabel.toLowerCase().includes(q)
  );

  searchResults = matched;
  searchFocusedIndex = -1;
  renderGlobalResults(matched, q);
}

function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped.replace(new RegExp(escapedQuery, 'gi'), m => `<mark>${m}</mark>`);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderGlobalResults(results, query) {
  const container = document.getElementById('globalSearchResults');

  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-empty">
        <div class="search-empty__icon">🔍</div>
        <div class="search-empty__title">No results for "${escapeHtml(query)}"</div>
        <div class="search-empty__sub">Try searching for a page, topic, person, or document.</div>
      </div>
    `;
    return;
  }

  // Group results by page
  const groups = {};
  const groupOrder = [];
  results.forEach(r => {
    if (!groups[r.page]) {
      groups[r.page] = [];
      groupOrder.push(r.page);
    }
    groups[r.page].push(r);
  });

  let html = '';
  let globalIdx = 0;
  groupOrder.forEach(page => {
    const items = groups[page];
    const label = items[0].pageLabel;
    html += `<div class="search-group">
      <div class="search-group__label">${label}</div>`;
    items.forEach(item => {
      const idx = globalIdx++;
      html += `<button class="search-result-item" data-idx="${idx}" onclick="activateSearchResult(${idx})">
        <div class="search-result-item__icon">${item.icon}</div>
        <div class="search-result-item__text">
          <div class="search-result-item__title">${highlight(item.title, query)}</div>
          <div class="search-result-item__desc">${highlight(item.desc, query)}</div>
        </div>
        <div class="search-result-item__page">${label}</div>
        <svg class="search-result-item__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>`;
    });
    html += '</div>';
  });

  // Results count
  html += `<div class="search-results-count">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;
  container.innerHTML = html;
}

function activateSearchResult(idx) {
  const item = searchResults[idx];
  if (!item) return;
  // If has external href and is on the same page already, open it
  if (item.href && currentPage === item.page) {
    window.open(item.href, '_blank', 'noopener,noreferrer');
  } else if (item.href) {
    item.action();
    // small delay then open the link
    setTimeout(() => window.open(item.href, '_blank', 'noopener,noreferrer'), 400);
  } else {
    item.action();
  }
  _closeGlobalSearch();
}

// Keyboard navigation in the search modal
function handleSearchKeydown(e) {
  if (!searchResults.length) return;
  const items = document.querySelectorAll('.search-result-item');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    searchFocusedIndex = Math.min(searchFocusedIndex + 1, items.length - 1);
    updateSearchFocus(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    searchFocusedIndex = Math.max(searchFocusedIndex - 1, 0);
    updateSearchFocus(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (searchFocusedIndex >= 0 && searchFocusedIndex < searchResults.length) {
      activateSearchResult(searchFocusedIndex);
    } else if (searchResults.length === 1) {
      activateSearchResult(0);
    }
  }
}

function updateSearchFocus(items) {
  items.forEach((el, i) => {
    el.classList.toggle('active', i === searchFocusedIndex);
  });
  if (searchFocusedIndex >= 0) {
    items[searchFocusedIndex].scrollIntoView({ block: 'nearest' });
  }
}

// Global keyboard shortcut Ctrl+K / Cmd+K
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (searchActive) {
      _closeGlobalSearch();
    } else {
      openGlobalSearch();
    }
  }
  if (e.key === 'Escape' && searchActive) {
    _closeGlobalSearch();
  }
});


/* ---- Local Search: Documents ---- */
function filterDocs(query) {
  const q = query.toLowerCase().trim();
  const items = document.querySelectorAll('#docsList .doc-item');
  let visibleCount = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !q || text.includes(q);
    item.classList.toggle('search-hidden', !match);
    if (match) visibleCount++;
  });

  // Empty state
  let empty = document.getElementById('docsEmptyState');
  if (!empty) {
    empty = document.createElement('div');
    empty.id = 'docsEmptyState';
    empty.className = 'docs-empty-state';
    empty.innerHTML = `<div class="docs-empty-state__icon">📄</div><div class="docs-empty-state__text">No documents match "<span id="docsEmptyQuery"></span>"</div>`;
    document.getElementById('docsList').after(empty);
  }
  empty.classList.toggle('visible', visibleCount === 0 && q.length > 0);
  if (q) {
    const span = document.getElementById('docsEmptyQuery');
    if (span) span.textContent = query;
  }

  // Clear button visibility
  const clearBtn = document.getElementById('docsSearchClear');
  if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
}

/* ---- Local Search: Slides ---- */
function filterSlides(query) {
  const q = query.toLowerCase().trim();
  const items = document.querySelectorAll('#slidesList .doc-item');
  let visibleCount = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !q || text.includes(q);
    item.classList.toggle('search-hidden', !match);
    if (match) visibleCount++;
  });

  // Empty state
  let empty = document.getElementById('slidesEmptyState');
  if (!empty) {
    empty = document.createElement('div');
    empty.id = 'slidesEmptyState';
    empty.className = 'docs-empty-state';
    empty.innerHTML = `<div class="docs-empty-state__icon">🖥️</div><div class="docs-empty-state__text">No presentations match "<span id="slidesEmptyQuery"></span>"</div>`;
    document.getElementById('slidesList').after(empty);
  }
  empty.classList.toggle('visible', visibleCount === 0 && q.length > 0);
  if (q) {
    const span = document.getElementById('slidesEmptyQuery');
    if (span) span.textContent = query;
  }

  const clearBtn = document.getElementById('slidesSearchClear');
  if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
}

/* ---- Local Search: About (Team & Supervisors) ---- */
function filterTeam(query) {
  const q = query.toLowerCase().trim();

  // Filter team cards
  const teamCards = document.querySelectorAll('#aboutSection .team-card');
  const supervisorCards = document.querySelectorAll('#aboutSection .supervisor-card');
  let visibleCount = 0;

  teamCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const match = !q || text.includes(q);
    card.classList.toggle('search-hidden', !match);
    if (match) visibleCount++;
  });

  supervisorCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const match = !q || text.includes(q);
    card.classList.toggle('search-hidden', !match);
    if (match) visibleCount++;
  });

  const noResults = document.getElementById('aboutNoResults');
  if (noResults) {
    noResults.style.display = (visibleCount === 0 && q.length > 0) ? 'block' : 'none';
    if (visibleCount === 0 && q.length > 0) {
      noResults.textContent = `No team members match "${query}".`;
    }
  }

  const clearBtn = document.getElementById('aboutSearchClear');
  if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
}

/* ---- Utility: Clear a local search ---- */
function clearLocalSearch(inputId, filterFn) {
  const input = document.getElementById(inputId);
  if (input) {
    input.value = '';
    input.focus();
    filterFn('');
  }
}
