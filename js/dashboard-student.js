// AMI-Teach — Student dashboard logic

import { requireAuth, signOut } from './auth.js';
import { supabase } from './supabase-client.js';

/* ═══════════════════════════════════════════
   SECTION A — AUTH GUARD
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  showSkeletons();

  const profile = await requireAuth(['student']);
  if (!profile) return;

  populateProfile(profile);
  hideSkeletons();

  initSidebarNav();
  initMobileSidebar();
  initTopicChecklist();
  animateTrackerRings();
  initFilterChips();

  document.getElementById('signout-btn').addEventListener('click', signOut);

  await loadStudentData(profile.id);
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
  dashboard: 'Dashboard',
  tracker:   'Syllabus Tracker',
  book:      'Book a Session',
  sessions:  'My Sessions',
  graph:     'Knowledge Graph',
  reports:   'Progress Reports',
  billing:   'Billing & Payments',
  settings:  'Settings',
};

function initSidebarNav() {
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  const panels   = document.querySelectorAll('.dash-panel');
  const titleEl  = document.getElementById('topbar-title');

  function activatePanel(panelId) {
    navItems.forEach(item => item.classList.remove('active'));
    panels.forEach(panel  => { panel.style.display = 'none'; });

    const targetItem  = document.querySelector('[data-panel="' + panelId + '"]');
    const targetPanel = document.getElementById('panel-' + panelId);

    if (targetItem)  targetItem.classList.add('active');
    if (targetPanel) targetPanel.style.display = '';
    if (titleEl)     titleEl.textContent = PANEL_TITLES[panelId] || 'Dashboard';

    if (panelId === 'tracker') {
      setTimeout(animateTrackerRings, 50);
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
  }
}

/* ═══════════════════════════════════════════
   SECTION D — MOBILE SIDEBAR TOGGLE
═══════════════════════════════════════════ */

function initMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const menuBtn  = document.getElementById('menu-btn');

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
   SECTION E — ANIMATE TRACKER RINGS
═══════════════════════════════════════════ */

let ringsAnimated = false;

function animateTrackerRings() {
  const fillCircle = document.getElementById('tracker-fill');
  if (!fillCircle || ringsAnimated) return;
  ringsAnimated = true;

  const circumference = 2 * Math.PI * 34;
  const pct           = 78;
  const targetOffset  = circumference - (pct / 100 * circumference);
  const startTime     = performance.now();
  const duration      = 1200;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function frame(now) {
    const t       = Math.min((now - startTime) / duration, 1);
    const current = circumference - ease(t) * (circumference - targetOffset);
    fillCircle.style.strokeDashoffset = current;
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  document.querySelectorAll('.stc-fill').forEach(function(bar, idx) {
    const targetWidth = parseFloat(bar.dataset.width) || 0;
    setTimeout(function() {
      bar.style.width = targetWidth + '%';
    }, idx * 100);
  });
}

/* ═══════════════════════════════════════════
   SECTION F — TOPIC CHECKLIST INTERACTION
═══════════════════════════════════════════ */

function initTopicChecklist() {
  document.querySelectorAll('.topic-item').forEach(function(item) {
    item.addEventListener('click', function() {
      this.classList.toggle('done');
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION G — COUNT UP ANIMATIONS
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
   SECTION H — SESSION FILTER CHIPS
═══════════════════════════════════════════ */

function initFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.filter-chip').forEach(function(c) {
        c.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════
   SECTION I — SKELETON LOADERS
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
      requestAnimationFrame(function() {
        card.style.opacity = '1';
      });
      delete card.dataset.originalContent;
    }
  });
  initCountUp();
}

/* ═══════════════════════════════════════════
   SECTION J — LOAD STUDENT DATA FROM SUPABASE
═══════════════════════════════════════════ */

async function loadStudentData(profileId) {
  try {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (studentError || !student) return;

    const [{ data: sessions }, { data: progress }] = await Promise.all([
      supabase
        .from('sessions')
        .select('*, teachers(profiles(full_name))')
        .eq('student_id', student.id)
        .eq('status', 'upcoming')
        .order('scheduled_at', { ascending: true })
        .limit(5),
      supabase
        .from('student_progress')
        .select('*, syllabus_topics(*)')
        .eq('student_id', student.id),
    ]);

    if (sessions && sessions.length > 0) {
      updateUpcomingSessions(sessions);
    }

    if (progress && progress.length > 0) {
      updateProgressUI(progress);
    }

  } catch (err) {
    console.error('AMI-Teach loadStudentData:', err);
  }
}

function updateUpcomingSessions(sessions) {
  /* Placeholder for dynamic session rendering — replaces static HTML when real data exists */
  console.log('Sessions loaded:', sessions.length);
}

function updateProgressUI(progress) {
  const completed = progress.filter(function(p) { return p.is_completed; }).length;
  const total     = progress.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const trackerPct = document.getElementById('tracker-pct');
  if (trackerPct) trackerPct.textContent = pct + '%';
}
