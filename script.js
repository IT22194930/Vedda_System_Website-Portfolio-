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
