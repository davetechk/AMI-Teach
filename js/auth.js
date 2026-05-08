// AMI-Teach — Auth logic: form utilities, validation, login, registration, guards

import { supabase, checkSession, redirectByRole } from './supabase-client.js';

/* ═══════════════════════════════════════════
   SECTION A — FORM UTILITIES
═══════════════════════════════════════════ */

const _originalBtnText = new Map();

export function showError(fieldId, message) {
  const errEl   = document.getElementById(fieldId + '-error');
  const inputEl = document.getElementById(fieldId);
  if (errEl)   { errEl.textContent = message; errEl.classList.add('field-error-visible'); }
  if (inputEl) { inputEl.classList.add('input-error'); }
}

export function clearError(fieldId) {
  const errEl   = document.getElementById(fieldId + '-error');
  const inputEl = document.getElementById(fieldId);
  if (errEl)   { errEl.textContent = ''; errEl.classList.remove('field-error-visible'); }
  if (inputEl) { inputEl.classList.remove('input-error'); }
}

export function showFormError(formId, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  const el = form.querySelector('.form-error');
  if (el) { el.textContent = message; el.classList.add('visible'); }
}

function clearFormError(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const el = form.querySelector('.form-error');
  if (el) { el.textContent = ''; el.classList.remove('visible'); }
}

export function setLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (isLoading) {
    if (!_originalBtnText.has(btnId)) _originalBtnText.set(btnId, btn.textContent);
    btn.textContent = 'Processing...';
    btn.disabled = true;
    btn.classList.add('btn-loading');
  } else {
    btn.textContent = _originalBtnText.get(btnId) || 'Submit';
    btn.disabled = false;
    btn.classList.remove('btn-loading');
  }
}

/* ═══════════════════════════════════════════
   SECTION B — VALIDATION
═══════════════════════════════════════════ */

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password) {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  return { valid: true, message: '' };
}

export function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
  if (/^0[7-9]\d{9}$/.test(cleaned)) return { valid: true, message: '' };
  return { valid: false, message: 'Enter a valid Nigerian phone number (e.g. 08012345678)' };
}

/* ═══════════════════════════════════════════
   INTERNAL HELPERS
═══════════════════════════════════════════ */

function _eyeIcon() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function _eyeOffIcon() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

function _initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.innerHTML = _eyeIcon();
    btn.addEventListener('click', () => {
      const input   = btn.closest('.input-password-wrapper').querySelector('input');
      const showing = input.type === 'text';
      input.type    = showing ? 'password' : 'text';
      btn.innerHTML = showing ? _eyeIcon() : _eyeOffIcon();
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });
}

function _clearAllOnFocus(form) {
  form.querySelectorAll('.form-input').forEach(input => {
    if (input.id) input.addEventListener('focus', () => clearError(input.id));
  });
}

/* ═══════════════════════════════════════════
   SECTION C — LOGIN
═══════════════════════════════════════════ */

export function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  _initPasswordToggles();
  _clearAllOnFocus(form);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearFormError('login-form');

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let valid = true;
    if (!validateEmail(email))   { showError('login-email', 'Enter a valid email address'); valid = false; }
    if (!password.length)        { showError('login-password', 'Password is required'); valid = false; }
    if (!valid) return;

    setLoading('login-btn', true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading('login-btn', false);
      showFormError('login-form', error.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      setLoading('login-btn', false);
      showFormError('login-form', 'Account setup incomplete. Please contact support.');
      return;
    }

    redirectByRole(profile.role);
  });
}

/* ═══════════════════════════════════════════
   SECTION D — STUDENT REGISTRATION
═══════════════════════════════════════════ */

export function initStudentRegister() {
  const form = document.getElementById('student-register-form');
  if (!form) return;

  _initPasswordToggles();
  _clearAllOnFocus(form);

  document.querySelectorAll('.exam-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearFormError('student-register-form');

    const name    = document.getElementById('student-name').value.trim();
    const phone   = document.getElementById('student-phone').value.trim();
    const email   = document.getElementById('student-email').value.trim();
    const pw      = document.getElementById('student-password').value;
    const pwC     = document.getElementById('student-confirm-password').value;
    const terms   = document.getElementById('student-terms').checked;
    const exams   = [...document.querySelectorAll('.exam-chip.selected')].map(c => c.dataset.exam);

    let valid = true;
    if (!name || name.length < 3)  { showError('student-name', 'Full name must be at least 3 characters'); valid = false; }
    const phoneR = validatePhone(phone);
    if (!phoneR.valid)             { showError('student-phone', phoneR.message); valid = false; }
    if (!validateEmail(email))     { showError('student-email', 'Enter a valid email address'); valid = false; }
    const pwR = validatePassword(pw);
    if (!pwR.valid)                { showError('student-password', pwR.message); valid = false; }
    if (pw !== pwC)                { showError('student-confirm-password', 'Passwords do not match'); valid = false; }
    if (!exams.length)             { showError('student-exams', 'Select at least one exam target'); valid = false; }
    if (!terms)                    { showError('student-terms', 'You must agree to the Terms of Service'); valid = false; }
    if (!valid) return;

    setLoading('student-register-btn', true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pw });
    if (authError) {
      setLoading('student-register-btn', false);
      showFormError('student-register-form', authError.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({ user_id: authData.user.id, role: 'student', full_name: name, email, phone })
      .select()
      .single();

    if (profileError) {
      setLoading('student-register-btn', false);
      showFormError('student-register-form', 'Profile creation failed. Please try again.');
      return;
    }

    await supabase.from('students').insert({ profile_id: profile.id, exam_targets: exams });

    window.location.href = '/pages/dashboards/student.html';
  });
}

/* ═══════════════════════════════════════════
   SECTION E — GUARDIAN REGISTRATION
═══════════════════════════════════════════ */

export function initGuardianRegister() {
  const form = document.getElementById('guardian-register-form');
  if (!form) return;

  _initPasswordToggles();
  _clearAllOnFocus(form);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearFormError('guardian-register-form');

    const name     = document.getElementById('guardian-name').value.trim();
    const phone    = document.getElementById('guardian-phone').value.trim();
    const email    = document.getElementById('guardian-email').value.trim();
    const location = document.getElementById('guardian-location').value.trim();
    const pw       = document.getElementById('guardian-password').value;
    const pwC      = document.getElementById('guardian-confirm-password').value;
    const terms    = document.getElementById('guardian-terms').checked;

    let valid = true;
    if (!name || name.length < 3)  { showError('guardian-name', 'Full name must be at least 3 characters'); valid = false; }
    const phoneR = validatePhone(phone);
    if (!phoneR.valid)             { showError('guardian-phone', phoneR.message); valid = false; }
    if (!validateEmail(email))     { showError('guardian-email', 'Enter a valid email address'); valid = false; }
    const pwR = validatePassword(pw);
    if (!pwR.valid)                { showError('guardian-password', pwR.message); valid = false; }
    if (pw !== pwC)                { showError('guardian-confirm-password', 'Passwords do not match'); valid = false; }
    if (!terms)                    { showError('guardian-terms', 'You must agree to the Terms of Service'); valid = false; }
    if (!valid) return;

    setLoading('guardian-register-btn', true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pw });
    if (authError) {
      setLoading('guardian-register-btn', false);
      showFormError('guardian-register-form', authError.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({ user_id: authData.user.id, role: 'guardian', full_name: name, email, phone })
      .select()
      .single();

    if (profileError) {
      setLoading('guardian-register-btn', false);
      showFormError('guardian-register-form', 'Profile creation failed. Please try again.');
      return;
    }

    await supabase.from('guardians').insert({ profile_id: profile.id, dependent_ids: [] });

    window.location.href = '/pages/dashboards/guardian.html';
  });
}

/* ═══════════════════════════════════════════
   SECTION F — TEACHER REGISTRATION
═══════════════════════════════════════════ */

export function initTeacherRegister() {
  const form = document.getElementById('teacher-register-form');
  if (!form) return;

  _initPasswordToggles();
  _clearAllOnFocus(form);

  document.querySelectorAll('.subject-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearFormError('teacher-register-form');

    const name     = document.getElementById('teacher-name').value.trim();
    const phone    = document.getElementById('teacher-phone').value.trim();
    const email    = document.getElementById('teacher-email').value.trim();
    const pw       = document.getElementById('teacher-password').value;
    const pwC      = document.getElementById('teacher-confirm-password').value;
    const rate     = parseInt(document.getElementById('teacher-rate').value, 10);
    const terms    = document.getElementById('teacher-terms').checked;
    const subjects = [...document.querySelectorAll('.subject-chip.selected')].map(c => c.dataset.subject);

    let valid = true;
    if (!name || name.length < 3)   { showError('teacher-name', 'Full name must be at least 3 characters'); valid = false; }
    const phoneR = validatePhone(phone);
    if (!phoneR.valid)              { showError('teacher-phone', phoneR.message); valid = false; }
    if (!validateEmail(email))      { showError('teacher-email', 'Enter a valid email address'); valid = false; }
    const pwR = validatePassword(pw);
    if (!pwR.valid)                 { showError('teacher-password', pwR.message); valid = false; }
    if (pw !== pwC)                 { showError('teacher-confirm-password', 'Passwords do not match'); valid = false; }
    if (!subjects.length)           { showError('teacher-subjects', 'Select at least one subject'); valid = false; }
    if (!rate || rate < 1000)       { showError('teacher-rate', 'Minimum hourly rate is ₦1,000'); valid = false; }
    if (!terms)                     { showError('teacher-terms', 'You must agree to the Terms of Service'); valid = false; }
    if (!valid) return;

    setLoading('teacher-register-btn', true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pw });
    if (authError) {
      setLoading('teacher-register-btn', false);
      showFormError('teacher-register-form', authError.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({ user_id: authData.user.id, role: 'teacher', full_name: name, email, phone })
      .select()
      .single();

    if (profileError) {
      setLoading('teacher-register-btn', false);
      showFormError('teacher-register-form', 'Profile creation failed. Please try again.');
      return;
    }

    await supabase.from('teachers').insert({
      profile_id:            profile.id,
      subjects,
      vetting_status:        'pending',
      mastery_score:         null,
      hourly_rate:           rate,
      is_premium_specialist: false,
    });

    window.location.href = '/pages/dashboards/teacher.html';
  });
}

/* ═══════════════════════════════════════════
   SECTION G — SIGN OUT
═══════════════════════════════════════════ */

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/pages/auth/login.html';
}

/* ═══════════════════════════════════════════
   SECTION H — AUTH GUARD
═══════════════════════════════════════════ */

export async function requireAuth(allowedRoles = []) {
  const result = await checkSession();
  if (!result) {
    window.location.href = '/pages/auth/login.html';
    return null;
  }
  const { profile } = result;
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    window.location.href = '/pages/auth/login.html';
    return null;
  }
  return profile;
}
