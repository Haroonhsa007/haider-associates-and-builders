import { icon } from '../components/ui.js';

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@haiderassociates.pk', icon: 'shield-check' },
  { role: 'Manager', email: 'manager@haiderassociates.pk', icon: 'briefcase-business' },
  { role: 'Agent', email: 'agent@haiderassociates.pk', icon: 'badge-user' },
];

export function loginPage() {
  return `<div class="login-wrap">
    <p class="login-kicker">HAIDER OS</p>
    <h1 id="page-title" tabindex="-1">Welcome back</h1>
    <p>Sign in to the private demo workspace for Haider Associates & Builders.</p>
    <form class="login-form" data-login-form novalidate>
      <div class="form-field"><label for="login-email">Email address</label><input id="login-email" name="email" type="email" value="admin@haiderassociates.pk" autocomplete="username" required /><span class="field-error" id="login-email-error" role="alert"></span></div>
      <div class="form-field"><label for="login-password">Password</label><div class="password-field"><input id="login-password" name="password" type="password" value="demo123" autocomplete="current-password" required /><button type="button" class="icon-btn" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></div><span class="field-error" id="login-password-error" role="alert"></span></div>
      <button class="btn btn-primary btn-block" type="submit">Sign in to HAIDER OS</button>
      <p class="form-error" data-login-error role="alert"></p>
    </form>
    <div class="demo-access"><p>Demo access</p>${demoAccounts.map(account => `<button type="button" data-demo-login="${account.email}">${icon(account.icon)}<span><strong>${account.role}</strong><small>${account.email}</small></span>${icon('arrow-right')}</button>`).join('')}</div>
    <div class="security-note">${icon('info')}<p>This is a local frontend demonstration. Authentication and role permissions are not production security.</p></div>
  </div>`;
}

