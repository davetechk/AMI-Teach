// AMI-Teach — Guardian dashboard logic

import { requireAuth, signOut } from './auth.js';
import { supabase } from './supabase-client.js';

/* ═══════════════════════════════════════════
   SECTION A — AUTH GUARD
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  showSkeletons();

  const profile = await requireAuth(['guardian']);
  if (!profile) return;

  populateProfile(profile);
  hideSkeletons();

  initSidebarNav();
  initMobileSidebar();
  initDependentCards();
  initModeSelector();
  initChildChips();
  initSummaryFilter();
  initCountUp();

  document.getElementById('signout-btn').addEventListener('click', signOut);

  await loadGuardianData(profile.id, profile);
});

/* ═══════════════════════════════════════════
   SECTION B — POPULATE UI WITH PROFILE
═══════════════════════════════════════════ */

function getInitials(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function populateProfile(profile) {
  const initials  = getInitials(profile.full_name);
  const firstName = (profile.full_name || '').trim().split(/\s+/)[0];

  const sidebarAvatar   = document.getElementById('sidebar-avatar');
  const sidebarName     = document.getElementById('sidebar-user-name');
  const topbarAvatar    = document.getElementById('topbar-avatar');
  const topbarName      = document.getElementById('topbar-user-name');
  const greetingHeading = document.getElementById('greeting-heading');

  if (sidebarAvatar) sidebarAvatar.textContent = initials;
  if (sidebarName)   sidebarName.textContent   = profile.full_name;
  if (topbarAvatar)  topbarAvatar.textContent  = initials;
  if (topbarName)    topbarName.textContent    = profile.full_name;

  if (greetingHeading) {
    const hour     = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    greetingHeading.innerHTML = greeting + ', <span class="em">' + firstName + '.</span>';
  }
}

/* ═══════════════════════════════════════════
   SECTION C — SIDEBAR NAVIGATION
═══════════════════════════════════════════ */

const PANEL_TITLES = {
  overview:  'Guardian Portal',
  children:  'My Children',
  summaries: 'Lesson Summaries',
  book:      'Book a Session',
  reports:   'Progress Reports',
  payments:  'Payments & Invoices',
  spending:  'Spending Overview',
  settings:  'Settings',
};

function initSidebarNav() {
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  const panels   = document.querySelectorAll('.dash-panel');
  const titleEl  = document.getElementById('topbar-title');

  function activatePanel(panelId) {
    navItems.forEach(item => item.classList.remove('active'));
    panels.forEach(panel => { panel.style.display = 'none'; });

    const targetItem  = document.querySelector('[data-panel="' + panelId + '"]');
    const targetPanel = document.getElementById('panel-' + panelId);

    if (targetItem)  targetItem.classList.add('active');
    if (targetPanel) targetPanel.style.display = '';
    if (titleEl)     titleEl.textContent = PANEL_TITLES[panelId] || 'Guardian Portal';

    if (panelId === 'children' || panelId === 'overview') {
      setTimeout(animateProgressBars, 50);
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const panelId = this.dataset.panel;
      activatePanel(panelId);
      closeMobileSidebar();
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('panel-' + hash)) {
    activatePanel(hash);
  } else {
    setTimeout(animateProgressBars, 300);
  }
}

/* ═══════════════════════════════════════════
   SECTION D — MOBILE SIDEBAR TOGGLE
═══════════════════════════════════════════ */

function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-btn');

  menuBtn.addEventListener('click', function() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  overlay.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   SECTION F — DEPENDENT CARD INTERACTIONS
═══════════════════════════════════════════ */

function initDependentCards() {
  document.querySelectorAll('.dependent-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('button')) return;
      document.querySelectorAll('.dependent-card').forEach(function(c) {
        c.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION G — MODE SELECTOR
═══════════════════════════════════════════ */

function initModeSelector() {
  const modeSelector = document.getElementById('mode-selector');
  if (!modeSelector) return;
  modeSelector.querySelectorAll('.mode-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      modeSelector.querySelectorAll('.mode-option').forEach(function(o) {
        o.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION H — CHILD CHIP SELECTOR
═══════════════════════════════════════════ */

function initChildChips() {
  const chipRow = document.getElementById('child-chip-row');
  if (!chipRow) return;
  chipRow.querySelectorAll('.child-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      chipRow.querySelectorAll('.child-chip').forEach(function(c) {
        c.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION I — SUMMARY FILTER
═══════════════════════════════════════════ */

function initSummaryFilter() {
  const filters = document.querySelectorAll('#summary-filters .filter-chip');
  const items   = document.querySelectorAll('#summary-list .summary-item');

  filters.forEach(function(chip) {
    chip.addEventListener('click', function() {
      filters.forEach(function(c) { c.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.dataset.filter;

      items.forEach(function(item) {
        if (filter === 'all') {
          item.style.display = '';
        } else if (filter === 'unread') {
          item.style.display = item.classList.contains('summary-unread') ? '' : 'none';
        } else if (filter === 'week') {
          item.style.display = item.dataset.week === 'current' ? '' : 'none';
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION J — PROGRESS BAR ANIMATION
═══════════════════════════════════════════ */

let barsAnimated = false;

function animateProgressBars() {
  if (barsAnimated) return;
  barsAnimated = true;

  document.querySelectorAll('.dep-progress-fill').forEach(function(bar, idx) {
    const target = parseFloat(bar.dataset.width) || 0;
    setTimeout(function() { bar.style.width = target + '%'; }, idx * 80);
  });

  document.querySelectorAll('.stc-fill').forEach(function(bar, idx) {
    const target = parseFloat(bar.dataset.width) || 0;
    setTimeout(function() { bar.style.width = target + '%'; }, idx * 100 + 200);
  });
}

/* ═══════════════════════════════════════════
   SECTION K — COUNT UP ANIMATIONS
═══════════════════════════════════════════ */

function initCountUp() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!target || isNaN(target)) return;
      observer.unobserve(el);

      const startTime = performance.now();
      const duration  = 1400;

      function ease(t) { return 1 - Math.pow(1 - t, 3); }

      (function tick(now) {
        const t = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.round(ease(t) * target);
        if (t < 1) requestAnimationFrame(tick);
      })(startTime);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.dash-card-value[data-target]').forEach(function(el) {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════
   SECTION N — SKELETON LOADERS
═══════════════════════════════════════════ */

function showSkeletons() {
  document.querySelectorAll('.dash-card').forEach(function(card) {
    card.dataset.originalContent = card.innerHTML;
    card.innerHTML =
      '<div class="skeleton skeleton-text short" style="margin-bottom:1rem"></div>' +
      '<div class="skeleton skeleton-card"></div>';
  });
}

function hideSkeletons() {
  document.querySelectorAll('.dash-card').forEach(function(card) {
    if (card.dataset.originalContent) {
      card.innerHTML = card.dataset.originalContent;
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.3s ease';
      requestAnimationFrame(function() { card.style.opacity = '1'; });
      delete card.dataset.originalContent;
    }
  });
  initCountUp();
}

/* ═══════════════════════════════════════════
   SECTION M — LOAD GUARDIAN DATA FROM SUPABASE
═══════════════════════════════════════════ */

async function loadGuardianData(profileId, profile) {
  try {
    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (guardianError || !guardian) return;

    const dependentIds = guardian.dependent_ids || [];
    if (dependentIds.length === 0) return;

    const [
      { data: summaries },
      { data: sessions },
      { data: transactions },
    ] = await Promise.all([
      supabase
        .from('lesson_summaries')
        .select('*, sessions(*), teachers(profiles(full_name))')
        .in('student_id', dependentIds)
        .order('submitted_at', { ascending: false })
        .limit(10),

      supabase
        .from('sessions')
        .select('*, teachers(profiles(full_name))')
        .in('student_id', dependentIds)
        .eq('status', 'upcoming')
        .order('scheduled_at', { ascending: true }),

      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    if (summaries && summaries.length > 0) {
      console.log('AMI-Teach: Lesson summaries loaded —', summaries.length);
    }

    if (sessions && sessions.length > 0) {
      console.log('AMI-Teach: Upcoming sessions loaded —', sessions.length);
    }

    if (transactions && transactions.length > 0) {
      console.log('AMI-Teach: Transactions loaded —', transactions.length);
    }

  } catch (err) {
    console.error('AMI-Teach loadGuardianData:', err);
  }
}
