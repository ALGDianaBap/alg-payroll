<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ALG · DXT Payroll Portal</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<style>
:root {
  --ink: #1a1a2e; --ink-mid: #2d2d4a; --ink-soft: #4a4a6a;
  --paper: #f8f7f4; --paper-warm: #f2efe8; --paper-card: #ffffff;
  --gold: #c9a84c; --gold-light: #e8d5a3; --gold-pale: #faf5e8;
  --teal: #2a7f7f; --rose: #c94c4c; --rose-light: #fce8e8;
  --green: #2a7f5a; --green-light: #e8f5ef;
  --border: #e2ddd4;
  --shadow-sm: 0 1px 3px rgba(26,26,46,.08);
  --shadow-md: 0 4px 16px rgba(26,26,46,.10);
  --shadow-lg: 0 12px 40px rgba(26,26,46,.14);
  --radius: 12px; --radius-sm: 8px;
}
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'DM Sans',sans-serif; background:var(--paper); color:var(--ink); min-height:100vh; font-size:15px; line-height:1.6; }

/* ── DARK SCREENS (auth / security) ── */
.dark-screen {
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:var(--ink); position:relative; overflow:hidden;
}
.dark-screen::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse 60% 50% at 20% 80%,rgba(201,168,76,.18) 0%,transparent 60%),
              radial-gradient(ellipse 50% 60% at 80% 20%,rgba(42,127,127,.14) 0%,transparent 60%);
}
.auth-card {
  background:var(--paper-card); border-radius:20px; padding:48px 44px;
  width:420px; box-shadow:var(--shadow-lg); position:relative; z-index:1;
  animation:fadeUp .4s ease;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
.auth-logo-mark {
  width:34px; height:34px; background:var(--ink); border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  font-family:'DM Serif Display',serif; font-size:17px; color:var(--gold);
}
.auth-logo-name { font-family:'DM Serif Display',serif; font-size:19px; color:var(--ink); }
.auth-tagline { font-size:12px; color:var(--ink-soft); margin-bottom:32px; letter-spacing:.03em; }
.auth-title { font-family:'DM Serif Display',serif; font-size:24px; margin-bottom:22px; letter-spacing:-.4px; }
.auth-error {
  background:var(--rose-light); color:var(--rose); border-radius:var(--radius-sm);
  padding:10px 14px; font-size:13px; margin-bottom:14px; display:none;
}
.auth-switch { text-align:center; margin-top:18px; font-size:13px; color:var(--ink-soft); }
.auth-switch a { color:var(--gold); font-weight:600; cursor:pointer; text-decoration:none; }

/* security card variant */
.sec-card { text-align:center; }
.sec-icon { font-size:46px; display:block; margin-bottom:14px; }
.sec-title { font-family:'DM Serif Display',serif; font-size:22px; margin-bottom:10px; }
.sec-sub { font-size:14px; color:var(--ink-soft); line-height:1.7; margin-bottom:26px; }
.approval-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--gold-pale); color:#7a5a10; border:1px solid var(--gold-light);
  border-radius:20px; padding:5px 16px; font-size:13px; font-weight:600; margin-bottom:18px;
}

/* OTP inputs */
.otp-row { display:flex; gap:10px; justify-content:center; margin-bottom:20px; }
.otp-box {
  width:50px; height:58px; text-align:center; font-size:22px;
  font-family:'JetBrains Mono',monospace; font-weight:700;
  border:2px solid var(--border); border-radius:10px;
  background:var(--paper); color:var(--ink); outline:none; transition:border-color .2s;
}
.otp-box:focus { border-color:var(--gold); background:white; box-shadow:0 0 0 3px rgba(201,168,76,.12); }

/* ── FORMS ── */
.form-group { margin-bottom:16px; }
.form-group label {
  display:block; font-size:11px; font-weight:700;
  text-transform:uppercase; letter-spacing:.08em; color:var(--ink-soft); margin-bottom:5px;
}
.form-group input, .form-group select, .form-group textarea {
  width:100%; padding:11px 13px; border:1.5px solid var(--border); border-radius:var(--radius-sm);
  font-family:'DM Sans',sans-serif; font-size:14px; color:var(--ink);
  background:var(--paper); outline:none; transition:border-color .2s, box-shadow .2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,.12); background:white;
}
.form-group textarea { resize:vertical; min-height:76px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

/* ── BUTTONS ── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  padding:11px 20px; border-radius:var(--radius-sm); font-family:'DM Sans',sans-serif;
  font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all .18s;
  text-decoration:none; white-space:nowrap;
}
.btn-primary { background:var(--ink); color:white; }
.btn-primary:hover:not(:disabled) { background:var(--ink-mid); transform:translateY(-1px); box-shadow:var(--shadow-md); }
.btn-primary:disabled { opacity:.5; cursor:not-allowed; }
.btn-full { width:100%; padding:13px; font-size:15px; }
.btn-gold { background:var(--gold); color:var(--ink); }
.btn-gold:hover { background:#b8963e; transform:translateY(-1px); }
.btn-outline { background:transparent; color:var(--ink); border:1.5px solid var(--border); }
.btn-outline:hover { border-color:var(--ink); }
.btn-ghost { background:transparent; color:var(--ink-soft); padding:8px 14px; }
.btn-ghost:hover { background:var(--paper); color:var(--ink); }
.btn-success { background:var(--green); color:white; }
.btn-success:hover { background:#1f6645; }
.btn-danger { background:var(--rose); color:white; }
.btn-sm { padding:7px 13px; font-size:13px; }

/* ── APP LAYOUT ── */
.app-layout { display:grid; grid-template-columns:240px 1fr; min-height:100vh; }

/* sidebar */
.sidebar {
  background:var(--ink); color:white; display:flex; flex-direction:column;
  position:sticky; top:0; height:100vh; overflow-y:auto;
}
.sidebar-header { padding:26px 22px 18px; border-bottom:1px solid rgba(255,255,255,.06); }
.sidebar-logo { display:flex; align-items:center; gap:9px; margin-bottom:3px; }
.sidebar-logo-mark {
  width:30px; height:30px; background:var(--gold); border-radius:7px;
  display:flex; align-items:center; justify-content:center;
  font-family:'DM Serif Display',serif; font-size:15px; color:var(--ink);
}
.sidebar-logo-name { font-family:'DM Serif Display',serif; font-size:17px; color:white; }
.sidebar-subtitle { font-size:10px; color:rgba(255,255,255,.3); text-transform:uppercase; letter-spacing:.08em; }
.sidebar-user { padding:14px 22px; border-bottom:1px solid rgba(255,255,255,.06); }
.sidebar-user-name { font-weight:600; font-size:14px; }
.sidebar-user-role { font-size:11px; color:rgba(255,255,255,.38); text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }
.sidebar-nav { padding:14px 10px; flex:1; }
.nav-label {
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.12em;
  color:rgba(255,255,255,.22); padding:0 12px; margin:14px 0 5px;
}
.nav-item {
  display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:var(--radius-sm);
  color:rgba(255,255,255,.58); font-size:14px; font-weight:500; cursor:pointer;
  transition:all .13s; margin-bottom:2px;
}
.nav-item:hover { background:rgba(255,255,255,.06); color:white; }
.nav-item.active { background:rgba(201,168,76,.15); color:var(--gold); }
.nav-icon { font-size:15px; width:20px; text-align:center; }
.sidebar-footer { padding:14px 10px; border-top:1px solid rgba(255,255,255,.06); }
.sidebar-footer .nav-item:hover { color:#ffb3b3; background:rgba(201,76,76,.1); }

/* main */
.main-content { background:var(--paper); overflow-y:auto; }
.page-header {
  padding:28px 36px 22px; border-bottom:1px solid var(--border);
  background:var(--paper-card); display:flex; align-items:flex-start;
  justify-content:space-between; gap:16px;
}
.page-title { font-family:'DM Serif Display',serif; font-size:26px; letter-spacing:-.4px; }
.page-subtitle { font-size:13px; color:var(--ink-soft); margin-top:3px; }
.page-body { padding:28px 36px; }

/* cards */
.card { background:var(--paper-card); border-radius:var(--radius); border:1px solid var(--border); box-shadow:var(--shadow-sm); }
.card-header { padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.card-title { font-family:'DM Serif Display',serif; font-size:17px; }
.card-body { padding:22px; }

/* badges */
.badge {
  display:inline-flex; align-items:center; gap:4px; padding:3px 9px;
  border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
}
.badge-pending { background:var(--gold-pale); color:#8a6a1a; border:1px solid var(--gold-light); }
.badge-paid { background:var(--green-light); color:var(--green); border:1px solid #b8dfc9; }
.badge-draft { background:var(--paper-warm); color:var(--ink-soft); border:1px solid var(--border); }
.badge-alg { background:#e8f0fe; color:#2a52be; border:1px solid #c5d4f8; }
.badge-dxt { background:#f3e8fe; color:#6a2abe; border:1px solid #dac5f8; }
.badge-flag { background:#fff3cd; color:#856404; border:1px solid #ffc107; }

/* tables */
.data-table { width:100%; border-collapse:collapse; }
.data-table th {
  text-align:left; font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:var(--ink-soft); padding:11px 14px;
  border-bottom:1.5px solid var(--border); background:var(--paper);
}
.data-table td { padding:13px 14px; border-bottom:1px solid var(--border); font-size:14px; vertical-align:middle; }
.data-table tr:last-child td { border-bottom:none; }
.data-table tr:hover td { background:var(--paper); }

/* stats */
.stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:14px; margin-bottom:24px; }
.stat-card { background:var(--paper-card); border:1px solid var(--border); border-radius:var(--radius); padding:18px 20px; }
.stat-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-soft); margin-bottom:7px; }
.stat-value { font-family:'DM Serif Display',serif; font-size:30px; color:var(--ink); letter-spacing:-1px; line-height:1; }
.stat-sub { font-size:12px; color:var(--ink-soft); margin-top:3px; }

/* invoice cards */
.inv-card {
  background:var(--paper-card); border:1px solid var(--border); border-radius:var(--radius);
  padding:18px 22px; margin-bottom:10px; display:flex; align-items:center;
  gap:14px; cursor:pointer; transition:box-shadow .18s;
}
.inv-card:hover { box-shadow:var(--shadow-md); }
.inv-card-main { flex:1; }
.inv-card-name { font-weight:600; font-size:15px; }
.inv-card-sub { font-size:12px; color:var(--ink-soft); margin-top:2px; }
.inv-card-amount { font-family:'DM Serif Display',serif; font-size:21px; letter-spacing:-.4px; }
.inv-card-amt-label { font-size:11px; color:var(--ink-soft); text-align:right; }

/* payment method buttons */
.pm-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
.pm-btn {
  border:2px solid var(--border); border-radius:var(--radius-sm); padding:13px 8px;
  text-align:center; cursor:pointer; transition:all .18s; background:var(--paper);
}
.pm-btn:hover { border-color:var(--gold); }
.pm-btn.selected { border-color:var(--gold); background:var(--gold-pale); }
.pm-icon { font-size:22px; margin-bottom:5px; }
.pm-name { font-size:13px; font-weight:600; color:var(--ink); }
.pm-sub { font-size:11px; color:var(--ink-soft); margin-top:1px; }

/* invoice builder */
.li-table { width:100%; border-collapse:collapse; }
.li-table th {
  font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em;
  color:var(--ink-soft); padding:8px 8px; border-bottom:2px solid var(--border); text-align:left;
}
.li-table td { padding:6px 4px; }
.li-table input, .li-table select {
  width:100%; padding:8px 9px; border:1.5px solid var(--border); border-radius:6px;
  font-family:'DM Sans',sans-serif; font-size:13px; color:var(--ink); background:var(--paper); outline:none;
}
.li-table input:focus, .li-table select:focus { border-color:var(--gold); background:white; }
.li-total-field { background:var(--paper-warm) !important; font-family:'JetBrains Mono',monospace !important; font-weight:600 !important; }

.totals-block { display:flex; flex-direction:column; align-items:flex-end; gap:7px; padding-top:14px; border-top:2px solid var(--border); margin-top:6px; }
.total-row { display:flex; gap:28px; font-size:14px; }
.total-label { color:var(--ink-soft); min-width:120px; text-align:right; }
.total-val { font-family:'JetBrains Mono',monospace; min-width:90px; text-align:right; }
.total-row.grand { font-size:17px; font-weight:700; }
.total-row.grand .total-val { color:var(--green); font-size:19px; }

/* invoice preview */
.inv-preview { background:white; padding:36px; max-width:660px; }
.inv-p-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; }
.inv-p-co { font-family:'DM Serif Display',serif; font-size:20px; }
.inv-p-addr { font-size:12px; color:var(--ink-soft); line-height:1.8; margin-top:3px; }
.inv-p-num-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-soft); }
.inv-p-num { font-family:'DM Serif Display',serif; font-size:19px; color:var(--gold); margin-top:3px; }
.inv-p-date { font-size:13px; color:var(--ink-soft); margin-top:3px; }
.inv-parties { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-bottom:28px; }
.inv-party-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-soft); margin-bottom:6px; }
.inv-party-name { font-weight:600; font-size:14px; }
.inv-party-addr { font-size:13px; color:var(--ink-soft); line-height:1.7; margin-top:2px; }
.inv-p-table { width:100%; border-collapse:collapse; margin-bottom:20px; }
.inv-p-table th { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-soft); padding:9px 10px; border-bottom:2px solid var(--border); text-align:left; }
.inv-p-table td { padding:11px 10px; border-bottom:1px solid var(--border); font-size:13px; }
.inv-p-table tr:last-child td { border-bottom:none; }
.inv-p-table .num { text-align:right; font-family:'JetBrains Mono',monospace; }
.inv-p-totals { display:flex; flex-direction:column; align-items:flex-end; gap:7px; }
.inv-p-trow { display:flex; gap:36px; font-size:13px; }
.inv-p-tlabel { color:var(--ink-soft); min-width:90px; text-align:right; }
.inv-p-tval { font-family:'JetBrains Mono',monospace; min-width:80px; text-align:right; }
.inv-p-trow.grand { font-size:15px; font-weight:700; padding-top:8px; border-top:2px solid var(--ink); }
.inv-p-trow.grand .inv-p-tval { color:var(--green); }

/* modal */
.modal-overlay {
  position:fixed; inset:0; background:rgba(26,26,46,.52);
  display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px;
  animation:fadeIn .18s ease;
}
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.modal {
  background:var(--paper-card); border-radius:16px; width:100%;
  max-width:680px; max-height:90vh; overflow-y:auto;
  box-shadow:var(--shadow-lg); animation:slideUp .22s ease;
}
@keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.modal-header {
  padding:22px 26px 18px; border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; background:var(--paper-card); z-index:1;
}
.modal-title { font-family:'DM Serif Display',serif; font-size:20px; }
.modal-body { padding:22px 26px; }
.modal-footer {
  padding:14px 26px; border-top:1px solid var(--border);
  display:flex; justify-content:flex-end; gap:9px;
  background:var(--paper); border-radius:0 0 16px 16px;
}
.close-btn { background:none; border:none; font-size:20px; color:var(--ink-soft); cursor:pointer; padding:2px 5px; border-radius:4px; }
.close-btn:hover { background:var(--paper); color:var(--ink); }

/* toast */
#toast-area { position:fixed; bottom:22px; right:22px; z-index:9999; display:flex; flex-direction:column; gap:7px; }
.toast {
  background:var(--ink); color:white; padding:11px 16px; border-radius:10px;
  font-size:14px; box-shadow:var(--shadow-lg); display:flex; align-items:center; gap:9px;
  animation:slideInR .25s ease; min-width:260px;
}
.toast.success { background:var(--green); }
.toast.error { background:var(--rose); }
.toast.info { background:var(--teal); }
@keyframes slideInR { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

/* misc */
.divider { height:1px; background:var(--border); margin:18px 0; }
.text-muted { color:var(--ink-soft); font-size:13px; }
.text-mono { font-family:'JetBrains Mono',monospace; }
.mb-4 { margin-bottom:14px; }
.mb-6 { margin-bottom:22px; }
.hidden { display:none !important; }
.spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
@keyframes spin { to{transform:rotate(360deg)} }
.empty-state { text-align:center; padding:52px 20px; color:var(--ink-soft); }
.empty-state .es-icon { font-size:44px; margin-bottom:14px; opacity:.4; }
.empty-state .es-title { font-family:'DM Serif Display',serif; font-size:19px; color:var(--ink); margin-bottom:6px; }
.win-notice {
  padding:11px 14px; border-radius:var(--radius-sm); font-size:13px;
  margin-bottom:18px; display:flex; align-items:center; gap:9px;
  background:var(--gold-pale); border:1px solid var(--gold-light); color:#7a5a10;
}
.win-notice.open { background:var(--green-light); border-color:#b8dfc9; color:var(--green); }
.exc-block {
  background:#fff8e6; border:1.5px solid var(--gold-light);
  border-radius:var(--radius-sm); padding:13px 15px; margin-top:10px;
}
.exc-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#8a6a1a; margin-bottom:8px; }
.avatar {
  width:34px; height:34px; border-radius:50%; background:var(--gold-pale);
  border:2px solid var(--gold-light); display:flex; align-items:center; justify-content:center;
  font-family:'DM Serif Display',serif; font-size:14px; color:var(--gold); flex-shrink:0;
}
.pay-info-box { background:var(--paper); border:1px solid var(--border); border-radius:var(--radius-sm); padding:13px 15px; margin-top:14px; }
.pay-info-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-soft); margin-bottom:7px; }
.sec-checklist-item { display:flex; align-items:center; gap:10px; font-size:14px; margin-bottom:9px; }
.rules-block {
  background:var(--ink); color:#e8e8e8; border-radius:var(--radius-sm);
  padding:18px; font-family:'JetBrains Mono',monospace; font-size:11.5px;
  line-height:1.85; overflow-x:auto; white-space:pre; margin-top:12px;
}
@media print {
  .sidebar, .page-header .btn, .modal-footer { display:none !important; }
  .inv-preview { border:none; padding:0; }
}
</style>
</head>
<body>

<!-- ══ AUTH ══ -->
<div id="screen-auth" class="dark-screen">
  <div class="auth-card">
    <div class="auth-logo">
      <div class="auth-logo-mark">P</div>
      <div class="auth-logo-name">Payroll Portal</div>
    </div>
    <div class="auth-tagline">Auto Legal Group · DealerXT — Internal Staff Only</div>

    <!-- Login -->
    <div id="view-login">
      <div class="auth-title">Welcome back</div>
      <div class="auth-error" id="login-err"></div>
      <div class="form-group"><label>Email</label><input type="email" id="login-email" placeholder="your@email.com" autocomplete="email"></div>
      <div class="form-group"><label>Password</label><input type="password" id="login-pw" placeholder="••••••••" autocomplete="current-password"></div>
      <button class="btn btn-primary btn-full" id="login-btn" onclick="doLogin()">Sign in</button>
      <div class="auth-switch">New here? <a onclick="switchView('register')">Create your account</a></div>
    </div>

    <!-- Register -->
    <div id="view-register" class="hidden">
      <div class="auth-title">Create account</div>
      <div class="auth-error" id="reg-err"></div>
      <div class="form-group"><label>Full name</label><input type="text" id="reg-name" placeholder="Your full name"></div>
      <div class="form-group"><label>Email</label><input type="email" id="reg-email" placeholder="your@email.com"></div>
      <div class="form-group"><label>Password <span style="font-weight:400;text-transform:none;letter-spacing:0">(min 8 chars, 1 uppercase, 1 number)</span></label><input type="password" id="reg-pw" placeholder="••••••••"></div>
      <button class="btn btn-primary btn-full" id="reg-btn" onclick="doRegister()">Create account</button>
      <div class="auth-switch">Already have an account? <a onclick="switchView('login')">Sign in</a></div>
    </div>
  </div>
</div>

<!-- ══ VERIFY EMAIL ══ -->
<div id="screen-verify" class="dark-screen hidden">
  <div class="auth-card sec-card">
    <span class="sec-icon">📧</span>
    <div class="sec-title">Verify your email</div>
    <div class="sec-sub">We sent a verification link to <strong id="verify-email"></strong>.<br>Click the link in your inbox, then return here.</div>
    <button class="btn btn-primary btn-full mb-4" onclick="checkVerified()">I've verified — continue</button>
    <button class="btn btn-ghost btn-full" onclick="resendVerify()">Resend verification email</button>
    <div style="margin-top:14px"><a onclick="doLogout()" style="font-size:13px;color:var(--ink-soft);cursor:pointer;text-decoration:underline">Sign out</a></div>
  </div>
</div>

<!-- ══ PENDING APPROVAL ══ -->
<div id="screen-approval" class="dark-screen hidden">
  <div class="auth-card sec-card">
    <span class="sec-icon">⏳</span>
    <div class="approval-badge">⚑ Awaiting Admin Approval</div>
    <div class="sec-title">Almost there!</div>
    <div class="sec-sub">Your account is pending approval by <strong>Ali R.</strong><br>You'll be notified via Slack once activated.<br>This usually takes less than one business day.</div>
    <button class="btn btn-ghost btn-full" onclick="checkApproval()">Check approval status</button>
    <div style="margin-top:14px"><a onclick="doLogout()" style="font-size:13px;color:var(--ink-soft);cursor:pointer;text-decoration:underline">Sign out</a></div>
  </div>
</div>

<!-- ══ 2FA ══ -->
<div id="screen-2fa" class="dark-screen hidden">
  <div class="auth-card sec-card">
    <span class="sec-icon">🔐</span>
    <div class="sec-title">Two-step verification</div>
    <div class="sec-sub">A 6-digit code was sent to your Slack DM (<strong id="twofa-email"></strong>).<br>Enter it below. Expires in <strong id="otp-timer">10:00</strong>.</div>
    <div class="auth-error" id="otp-err"></div>
    <div class="otp-row" id="otp-row">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
      <input class="otp-box" maxlength="1" type="text" inputmode="numeric">
    </div>
    <button class="btn btn-primary btn-full mb-4" id="otp-btn" onclick="verifyOTP()">Verify code</button>
    <button class="btn btn-ghost btn-full" onclick="resendOTP()">Resend code</button>
    <div style="margin-top:14px"><a onclick="doLogout()" style="font-size:13px;color:var(--ink-soft);cursor:pointer;text-decoration:underline">Sign out</a></div>
  </div>
</div>

<!-- ══ APP ══ -->
<div id="screen-app" class="hidden">
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="sidebar-logo-mark">P</div>
          <div class="sidebar-logo-name">Payroll Portal</div>
        </div>
        <div class="sidebar-subtitle">ALG · DXT</div>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-user-name" id="sb-name">—</div>
        <div class="sidebar-user-role" id="sb-role">—</div>
      </div>
      <nav class="sidebar-nav">
        <div id="nav-staff">
          <div class="nav-label">Invoices</div>
          <div class="nav-item active" id="ni-my-invoices" onclick="goPage('my-invoices')"><span class="nav-icon">📄</span> My Invoices</div>
          <div class="nav-item" id="ni-new-invoice" onclick="goPage('new-invoice')"><span class="nav-icon">✏️</span> New Invoice</div>
          <div class="nav-label">Account</div>
          <div class="nav-item" id="ni-profile" onclick="goPage('profile')"><span class="nav-icon">👤</span> My Profile</div>
        </div>
        <div id="nav-admin" class="hidden">
          <div class="nav-label">Dashboard</div>
          <div class="nav-item" id="ni-admin-dashboard" onclick="goPage('admin-dashboard')"><span class="nav-icon">📊</span> Overview</div>
          <div class="nav-item" id="ni-admin-invoices" onclick="goPage('admin-invoices')"><span class="nav-icon">📋</span> All Invoices</div>
          <div class="nav-label">Management</div>
          <div class="nav-item" id="ni-admin-users" onclick="goPage('admin-users')"><span class="nav-icon">👥</span> Staff</div>
          <div id="nav-ops" class="hidden">
            <div class="nav-label">Operations</div>
            <div class="nav-item" id="ni-ops-view" onclick="goPage('ops-view')"><span class="nav-icon">✅</span> Submission Status</div>
          </div>
          <div id="nav-settings" class="hidden">
            <div class="nav-label">System</div>
            <div class="nav-item" id="ni-admin-settings" onclick="goPage('admin-settings')"><span class="nav-icon">⚙️</span> Settings</div>
          </div>
          <div id="nav-settings-ops" class="hidden">
            <div class="nav-label">System</div>
            <div class="nav-item" id="ni-admin-settings-ops" onclick="goPage('admin-settings')"><span class="nav-icon">⚙️</span> Settings</div>
          </div>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="nav-item" onclick="doLogout()"><span class="nav-icon">🚪</span> Sign out</div>
      </div>
    </aside>
    <main class="main-content" id="main"></main>
  </div>
</div>

<div id="modal-area"></div>
<div id="toast-area"></div>

<script>
// ══════════════════════════════════════════
// FIREBASE INIT
// ══════════════════════════════════════════
firebase.initializeApp({
  apiKey: "%%FIREBASE_API_KEY%%",
  authDomain: "%%FIREBASE_AUTH_DOMAIN%%",
  projectId: "%%FIREBASE_PROJECT_ID%%",
  storageBucket: "%%FIREBASE_PROJECT_ID%%.firebasestorage.app",
  messagingSenderId: "%%FIREBASE_MESSAGING_SENDER_ID%%",
  appId: "%%FIREBASE_APP_ID%%"
});
const auth = firebase.auth();
const db   = firebase.firestore();
const FS   = firebase.firestore.FieldValue;

// ══════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════
const SLACK_CH = "C09RYSEKVBQ";
const COMPANIES = {
  ALG: { name:"Auto Legal Group, LLP", address:"6203 San Ignacio Ave #110\nSan Jose, California 95119\nUnited States" },
  DXT: { name:"Auto Compliance Team, LLC (DXT)", address:"6203 San Ignacio Ave #110\nSan Jose, California 95119\nUnited States" }
};
const DESCRIPTORS = [
  "Virtual Assistant Services - ALG","Virtual Assistant Services - DXT",
  "Legal Assistant Services","Case Management Services","Administrative Services",
  "Performance Bonus","Sales Commission"
];
const PAY_METHODS = ["PayPal","Remitly","Payoneer","Zelle","ACH / Wire Transfer","Other"];
const ADMIN_EMAILS  = ["diana@dealerxt.com","alir@autolegalgroup.com"];
const PAYER_EMAILS  = ["alir@autolegalgroup.com"];
const OPS_EMAIL     = "diana@dealerxt.com";
const EMAIL_SLACKID = {
  "alir@autolegalgroup.com":"U09PUC0EBLJ","diana@dealerxt.com":"U09PN032H5H",
  "daimon@dealerxt.com":"U09PSN4UY86","franklin@dealerxt.com":"U09PDA2L5V5",
  "aquiles@dealerxt.com":"U09PSN7R4VC","nelly@dealerxt.com":"U09PYAFMZM2",
  "samir@autolegalgroup.com":"U09PDBV7287","daniel@autolegalgroup.com":"U09Q7NJ7C5P",
  "pedro@autolegalgroup.com":"U09QP4Z4KUG","jorge@autolegalgroup.com":"U09PRBULA5B",
  "gabriel@autolegalgroup.com":"U09QP4ZKY0G","linda@autolegalgroup.com":"U09PYC93DNY",
  "viena@autolegalgroup.com":"U09Q7NGHA0H","amir@autolegalgroup.com":"U09PQU2F737"
};

// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let CU = null;   // currentUser (Firebase)
let UD = null;   // userDoc (Firestore)
let curPage = "";
let otpCode = null, otpExpiry = null, otpAttempts = 0, otpTimer = null;
let loginFails = {};  // rate limiting
let liCount = 0;

// ══════════════════════════════════════════
// SCREEN SWITCHER
// ══════════════════════════════════════════
function showScreen(name) {
  ["auth","verify","approval","2fa","app"].forEach(s => {
    const el = document.getElementById("screen-" + s);
    if (el) el.classList.add("hidden");
    if (el && s === "auth") el.style.display = "none";
  });
  const target = document.getElementById("screen-" + name);
  if (!target) return;
  if (name === "auth") { target.style.display = "flex"; target.classList.remove("hidden"); }
  else target.classList.remove("hidden");
}

function switchView(v) {
  document.getElementById("view-login").classList.toggle("hidden", v !== "login");
  document.getElementById("view-register").classList.toggle("hidden", v !== "register");
}

// ══════════════════════════════════════════
// AUTH STATE LISTENER
// ══════════════════════════════════════════
auth.onAuthStateChanged(async user => {
  if (!user) { CU = null; UD = null; showScreen("auth"); return; }
  CU = user;

  // Email verification temporarily disabled for initial setup
  // Re-enable by uncommenting the block below after first admin accounts are created
  /*
  if (!user.emailVerified) {
    document.getElementById("verify-email").textContent = user.email;
    showScreen("verify"); return;
  }
  */

  UD = await getUserDoc(user.uid);
  if (!UD) { UD = { name: user.email, email: user.email, role:"staff", approved:false }; }

  if (UD.role === "staff" && !UD.approved) { showScreen("approval"); return; }

  // 2FA check — TEMPORARILY BYPASSED until Slack token is configured
  sessionStorage.removeItem("needs2fa");
  launchApp();
});

// ══════════════════════════════════════════
// AUTH FUNCTIONS
// ══════════════════════════════════════════
async function doLogin() {
  const email = (document.getElementById("login-email").value || "").trim().toLowerCase();
  const pw    = document.getElementById("login-pw").value;
  const btn   = document.getElementById("login-btn");
  const err   = document.getElementById("login-err");
  err.style.display = "none";

  // Rate limit
  const now = Date.now();
  if (!loginFails[email]) loginFails[email] = { n:0, t:now };
  const lf = loginFails[email];
  if (now - lf.t > 15*60*1000) { lf.n = 0; lf.t = now; }
  if (lf.n >= 5) {
    const wait = Math.ceil((15*60*1000-(now-lf.t))/60000);
    err.textContent = `Too many attempts. Wait ${wait} min and try again.`;
    err.style.display = "block"; return;
  }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    // 2FA temporarily bypassed — remove next 2 lines and uncomment sessionStorage lines when Slack token is set
    // sessionStorage.setItem("needs2fa", "pending");
    const cred = await auth.signInWithEmailAndPassword(email, pw);
    // sessionStorage.setItem("needs2fa", cred.user.uid);
    lf.n = 0;
  } catch(e) {
    lf.n++;
    sessionStorage.removeItem("needs2fa");
    err.textContent = fmtErr(e.code);
    err.style.display = "block";
    btn.innerHTML = "Sign in";
    btn.disabled = false;
  }
}

async function doRegister() {
  const name  = (document.getElementById("reg-name").value || "").trim();
  const email = (document.getElementById("reg-email").value || "").trim().toLowerCase();
  const pw    = document.getElementById("reg-pw").value;
  const btn   = document.getElementById("reg-btn");
  const err   = document.getElementById("reg-err");
  err.style.display = "none";

  if (!name || !email || !pw) { err.textContent = "Please fill in all fields."; err.style.display = "block"; return; }
  if (pw.length < 8) { err.textContent = "Password must be at least 8 characters."; err.style.display = "block"; return; }
  if (!/[A-Z]/.test(pw)) { err.textContent = "Password must include at least one uppercase letter."; err.style.display = "block"; return; }
  if (!/[0-9]/.test(pw)) { err.textContent = "Password must include at least one number."; err.style.display = "block"; return; }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pw);
    const isAdmin  = ADMIN_EMAILS.includes(email);
    const isPayer  = PAYER_EMAILS.includes(email);
    const isOps    = email === OPS_EMAIL;

    await db.collection("users").doc(cred.user.uid).set({
      name, email, role: isAdmin ? "admin" : "staff",
      isOps: isOps, isPayer: isPayer,
      approved: isAdmin, // admins auto-approved
      createdAt: FS.serverTimestamp(),
      paymentMethod:"", paymentRecipient:"", paymentDetail:"",
      exceptionMethod:"", exceptionDetail:"", exceptionApproved:false,
      slackId: EMAIL_SLACKID[email] || ""
    });

    // await cred.user.sendEmailVerification(); // temporarily disabled

    if (!isAdmin) {
      sendSlack(SLACK_CH, `🆕 *New account registration*\n*Name:* ${name}\n*Email:* ${email}\n_Approve in Payroll Portal → Staff tab._`);
    }
  } catch(e) {
    err.textContent = fmtErr(e.code);
    err.style.display = "block";
    btn.innerHTML = "Create account";
    btn.disabled = false;
  }
}

function doLogout() {
  sessionStorage.removeItem("needs2fa");
  if (otpTimer) clearInterval(otpTimer);
  auth.signOut();
}

async function checkVerified() {
  await CU.reload();
  if (CU.emailVerified) {
    UD = await getUserDoc(CU.uid);
    if (UD?.role === "staff" && !UD?.approved) { showScreen("approval"); return; }
    sessionStorage.setItem("needs2fa", CU.uid);
    start2FA();
  } else {
    toast("Email not yet verified — check your inbox", "error");
  }
}

async function resendVerify() {
  try { await CU.sendEmailVerification(); toast("Verification email resent!", "success"); }
  catch(e) { toast("Please wait before requesting another email", "error"); }
}

async function checkApproval() {
  UD = await getUserDoc(CU.uid);
  if (UD?.approved) {
    sessionStorage.setItem("needs2fa", CU.uid);
    start2FA();
  } else {
    toast("Not yet approved — Ali R. will notify you via Slack", "info");
  }
}

function fmtErr(code) {
  return ({
    "auth/user-not-found":"No account found with this email.",
    "auth/wrong-password":"Incorrect password.",
    "auth/invalid-credential":"Invalid email or password.",
    "auth/email-already-in-use":"An account with this email already exists.",
    "auth/weak-password":"Password must be at least 8 characters.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/too-many-requests":"Too many attempts. Please wait and try again."
  })[code] || "Something went wrong. Please try again.";
}

// ══════════════════════════════════════════
// 2FA
// ══════════════════════════════════════════
function genOTP() { return String(Math.floor(100000 + Math.random()*900000)); }

async function start2FA() {
  otpCode     = genOTP();
  otpExpiry   = Date.now() + 10*60*1000;
  otpAttempts = 0;

  await db.collection("users").doc(CU.uid).update({
    otpHash: btoa(otpCode + CU.uid), otpExpiry: otpExpiry
  });

  // Send via Slack DM
  const slackId = UD?.slackId || EMAIL_SLACKID[CU.email] || null;
  if (slackId) {
    sendSlackDM(slackId, `🔐 *ALG Payroll Portal — Login Code*\n\nYour verification code is:\n*${otpCode}*\n\nExpires in 10 minutes. Do not share this code.`);
  } else {
    // Dev fallback — print to console
    console.log("%c🔐 DEV OTP: " + otpCode, "font-size:20px;color:orange;font-weight:bold");
  }

  document.getElementById("twofa-email").textContent = CU.email;
  showScreen("2fa");
  startOTPTimer();
  setupOTPBoxes();
}

function startOTPTimer() {
  if (otpTimer) clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    const rem = otpExpiry - Date.now();
    if (rem <= 0) {
      clearInterval(otpTimer);
      document.getElementById("otp-timer").textContent = "Expired";
      document.getElementById("otp-btn").disabled = true;
      return;
    }
    const m = Math.floor(rem/60000), s = Math.floor((rem%60000)/1000);
    document.getElementById("otp-timer").textContent = `${m}:${String(s).padStart(2,"0")}`;
  }, 1000);
}

function setupOTPBoxes() {
  const boxes = document.querySelectorAll(".otp-box");
  boxes.forEach(b => b.value = "");
  boxes.forEach((box, i) => {
    box.oninput = e => {
      const v = e.target.value.replace(/\D/g,"");
      e.target.value = v.slice(-1);
      if (v && i < boxes.length-1) boxes[i+1].focus();
      if (Array.from(boxes).every(b => b.value)) verifyOTP();
    };
    box.onkeydown = e => { if (e.key==="Backspace" && !box.value && i>0) boxes[i-1].focus(); };
    box.onpaste = e => {
      const paste = (e.clipboardData||window.clipboardData).getData("text").replace(/\D/g,"");
      if (paste.length===6) { boxes.forEach((b,j) => b.value=paste[j]||""); verifyOTP(); }
      e.preventDefault();
    };
  });
  boxes[0].focus();
}

async function verifyOTP() {
  const boxes   = document.querySelectorAll(".otp-box");
  const entered = Array.from(boxes).map(b=>b.value).join("");
  const errEl   = document.getElementById("otp-err");
  errEl.style.display = "none";
  if (entered.length < 6) return;

  if (otpAttempts >= 5) {
    errEl.textContent = "Too many attempts. Please request a new code.";
    errEl.style.display = "block"; return;
  }
  otpAttempts++;

  if (Date.now() > otpExpiry) {
    errEl.textContent = "Code has expired. Request a new one.";
    errEl.style.display = "block"; return;
  }

  const snap = await db.collection("users").doc(CU.uid).get();
  const expected = btoa(entered + CU.uid);
  if (snap.data()?.otpHash === expected) {
    await db.collection("users").doc(CU.uid).update({
      otpHash: firebase.firestore.FieldValue.delete(),
      otpExpiry: firebase.firestore.FieldValue.delete(),
      lastLogin: FS.serverTimestamp()
    });
    clearInterval(otpTimer);
    launchApp();
  } else {
    errEl.textContent = `Incorrect code — ${5-otpAttempts} attempt(s) remaining.`;
    errEl.style.display = "block";
    boxes.forEach(b => b.value="");
    boxes[0].focus();
  }
}

async function resendOTP() { await start2FA(); toast("New code sent!", "success"); }

// ══════════════════════════════════════════
// LAUNCH APP
// ══════════════════════════════════════════
function launchApp() {
  showScreen("app");
  document.getElementById("sb-name").textContent = UD?.name || CU.email;
  const isPayer = UD?.isPayer, isOps = UD?.isOps, isAdmin = UD?.role === "admin";
  document.getElementById("sb-role").textContent = isPayer ? "Payroll Admin" : isOps ? "Operations Admin" : isAdmin ? "Admin" : "Staff";

  // Show/hide nav sections
  const staffNav   = document.getElementById("nav-staff");
  const adminNav   = document.getElementById("nav-admin");
  const opsNav     = document.getElementById("nav-ops");
  const settingsNav= document.getElementById("nav-settings");

  if (isOps) {
    staffNav.classList.remove("hidden");
    adminNav.classList.remove("hidden");
    opsNav.classList.remove("hidden");
    document.getElementById("nav-settings-ops").classList.remove("hidden");
    goPage("ops-view");
  } else if (isAdmin) {
    staffNav.classList.add("hidden");
    adminNav.classList.remove("hidden");
    if (isPayer) settingsNav.classList.remove("hidden");
    goPage("admin-dashboard");
  } else {
    staffNav.classList.remove("hidden");
    adminNav.classList.add("hidden");
    goPage("my-invoices");
  }

  checkMondayReminder();
}

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
function goPage(page) {
  curPage = page;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const ni = document.getElementById("ni-" + page);
  if (ni) ni.classList.add("active");
  ({
    "my-invoices":     renderMyInvoices,
    "new-invoice":     renderNewInvoice,
    "profile":         renderProfile,
    "admin-dashboard": renderAdminDashboard,
    "admin-invoices":  renderAdminInvoices,
    "admin-users":     renderAdminUsers,
    "ops-view":        renderOpsView,
    "admin-settings":  renderAdminSettings,
    "admin-settings-ops": renderAdminSettings
  })[page]?.();
}

function setMain(html) { document.getElementById("main").innerHTML = html; }

// ══════════════════════════════════════════
// FIRESTORE HELPERS
// ══════════════════════════════════════════
async function getUserDoc(uid) {
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? { id:snap.id, ...snap.data() } : null;
}
async function getAllUsers() {
  const snap = await db.collection("users").get();
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
async function getMyInvoices() {
  const snap = await db.collection("invoices").where("userId","==",CU.uid).orderBy("createdAt","desc").get();
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
async function getAllInvoices() {
  const snap = await db.collection("invoices").orderBy("createdAt","desc").get();
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

// ══════════════════════════════════════════
// PAGE: MY INVOICES
// ══════════════════════════════════════════
async function renderMyInvoices() {
  setMain(`<div class="page-header"><div><div class="page-title">My Invoices</div><div class="page-subtitle">Your submitted invoices and payment status</div></div><button class="btn btn-gold" onclick="goPage('new-invoice')">✏️ &nbsp;New Invoice</button></div><div class="page-body"><div id="inv-list"><div class="text-muted">Loading…</div></div></div>`);
  const invs = await getMyInvoices();
  const el = document.getElementById("inv-list");
  if (!invs.length) { el.innerHTML = `<div class="empty-state"><div class="es-icon">📄</div><div class="es-title">No invoices yet</div><div class="es-sub">Create your first invoice to get started.</div></div>`; return; }
  el.innerHTML = invs.filter(i=>i.status!=="deleted").map(inv => {
    const badge = inv.status==="paid" ? `<span class="badge badge-paid">✓ Paid</span>` : inv.status==="draft" ? `<span class="badge badge-draft">Draft</span>` : `<span class="badge badge-pending">Pending</span>`;
    const coBadge = inv.billingCompany==="ALG" ? `<span class="badge badge-alg">ALG</span>` : `<span class="badge badge-dxt">DXT</span>`;
    const isDraft   = inv.status === "draft";
    const isPending = inv.status === "pending";
    const isPaid    = inv.status === "paid";
    const actions = isDraft
      ? `<div style="display:flex;gap:7px;margin-top:10px" onclick="event.stopPropagation()">
          <button class="btn btn-primary btn-sm" onclick="editInvoice('${inv.id}')">✏️ Edit</button>
          <button class="btn btn-gold btn-sm" onclick="submitDraft('${inv.id}')">📤 Submit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteInvoice('${inv.id}')">🗑 Delete</button>
        </div>`
      : isPending
      ? `<div style="display:flex;gap:7px;margin-top:10px" onclick="event.stopPropagation()">
          <button class="btn btn-outline btn-sm" onclick="editInvoicePending('${inv.id}')">✏️ Edit</button>
        </div>`
      : "";
    return `<div class="inv-card" onclick="${isDraft||isPending?"":"openInvModal('"+inv.id+"',false)"}">
      <div class="inv-card-main">
        <div class="inv-card-name">${inv.invoiceNumber||"Invoice"}</div>
        <div class="inv-card-sub">${fmtDate(inv.createdAt)} &nbsp;·&nbsp; ${coBadge} &nbsp;${badge}</div>
        <div class="inv-card-sub" style="margin-top:4px">${(inv.lineItems||[]).map(li=>li.description).join(", ")}</div>
        ${actions}
      </div>
      <div style="text-align:right;cursor:${isPaid?"pointer":"default"}" onclick="${isPaid?"openInvModal('"+inv.id+"',false)":""}">
        <div class="inv-card-amount">$${fmtMoney(inv.total)}</div>
        <div class="inv-card-amt-label">USD</div>
      </div>
    </div>`;
  }).join("");
}

// ══════════════════════════════════════════
// PAGE: NEW INVOICE
// ══════════════════════════════════════════
async function renderNewInvoice(editData) {
  liCount = 0;
  const ed = editData || {};
  // Always refresh user doc so latest profile data (address, payment) is used
  UD = await getUserDoc(CU.uid) || UD;
  const today = new Date().toISOString().split("T")[0];
  const isOpen = isWindowOpen();
  const coOpts = Object.entries(COMPANIES).map(([k,v]) => `<option value="${k}" ${(ed.billingCompany||"ALG")===k?"selected":""}>${v.name}</option>`).join("");
  const descOpts = DESCRIPTORS.map(d => `<option value="${d}">${d}</option>`).join("");

  setMain(`
    <div class="page-header">
      <div><div class="page-title">New Invoice</div><div class="page-subtitle">Complete the form and submit for payment</div></div>
    </div>
    <div class="page-body">
      <div class="win-notice ${isOpen?"open":""}">
        ${isOpen?"✅ Invoice window is open (Fri 6pm – Sun 12pm PST)":"🕐 Submission window: Fri 6pm – Sun 12pm PST. You can still submit anytime."}
      </div>

      <div class="card mb-6">
        <div class="card-header"><div class="card-title">Invoice Details</div></div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label>Bill To (Company)</label>
              <select id="inv-co" onchange="updateBillTo()">${coOpts}</select>
            </div>
            <div class="form-group">
              <label>Invoice Date</label>
              <input type="date" id="inv-date" value="${ed.invoiceDate||today}">
            </div>
          </div>
          <div class="form-group">
            <label>Bill To Address</label>
            <div id="inv-bill-to" style="padding:10px 13px;background:var(--paper);border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;color:var(--ink-soft);line-height:1.8">
              Auto Legal Group, LLP<br>6203 San Ignacio Ave #110<br>San Jose, California 95119<br>United States
            </div>
          </div>
          <div class="divider"></div>
          <div class="form-row">
            <div class="form-group">
              <label>Your Name (From)</label>
              <input type="text" id="inv-from-name" value="${UD?.name||""}" placeholder="Full name">
            </div>
            <div class="form-group">
              <label>Your Address</label>
              <textarea id="inv-from-addr">${ed.fromAddress||UD?.address||""}</textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-header">
          <div class="card-title">Line Items</div>
          <button class="btn btn-outline btn-sm" onclick="addLineItem()">+ Add Row</button>
        </div>
        <div class="card-body" style="padding:0">
          <div style="overflow-x:auto">
            <table class="li-table">
              <thead><tr>
                <th style="min-width:220px">Description</th>
                <th style="min-width:120px">Date From</th>
                <th style="min-width:120px">Date To</th>
                <th style="min-width:85px">Rate ($/hr)</th>
                <th style="min-width:70px">Hours</th>
                <th style="min-width:100px">Total</th>
                <th style="width:36px"></th>
              </tr></thead>
              <tbody id="li-body"></tbody>
            </table>
          </div>
          <div style="padding:14px 18px">
            <div class="totals-block" id="totals-block">
              <div class="total-row grand">
                <span class="total-label">Amount Due (USD)</span>
                <span class="total-val" id="grand-total">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-header"><div class="card-title">Notes</div></div>
        <div class="card-body">
          <div class="form-group" style="margin:0">
            <textarea id="inv-notes" placeholder="Any additional notes…">${ed.notes||""}</textarea>
          </div>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-outline" onclick="saveDraft()">Save Draft</button>
        <button class="btn btn-gold" onclick="previewInvoice()">Preview</button>
        <button class="btn btn-primary" onclick="submitInvoice()">Submit Invoice</button>
      </div>
    </div>
  `);

  window._editId = ed.id || null;
  (ed.lineItems || [{}]).forEach(li => addLineItem(li));
}

function updateBillTo() {
  const co = document.getElementById("inv-co")?.value;
  if (!co || !COMPANIES[co]) return;
  document.getElementById("inv-bill-to").innerHTML = COMPANIES[co].name + "<br>" + COMPANIES[co].address.replace(/\n/g,"<br>");
}

function addLineItem(data) {
  data = data || {};
  liCount++;
  const id = liCount;
  const opts = DESCRIPTORS.map(d => `<option value="${d}" ${data.description===d?"selected":""}>${d}</option>`).join("");
  const tr = document.createElement("tr");
  tr.id = "li-" + id;
  tr.innerHTML = `
    <td><select onchange="recalc()">${opts}</select></td>
    <td><input type="date" value="${data.dateFrom||""}" onchange="recalc()"></td>
    <td><input type="date" value="${data.dateTo||""}" onchange="recalc()"></td>
    <td><input type="number" min="0" step="0.01" value="${data.rate||""}" placeholder="0.00" oninput="calcRow(${id});recalc()"></td>
    <td><input type="number" min="0" step="0.5" value="${data.hours||""}" placeholder="0" oninput="calcRow(${id});recalc()"></td>
    <td><input class="li-total-field" id="li-tot-${id}" readonly value="${data.total?"$"+fmtMoney(data.total):""}"></td>
    <td><button onclick="document.getElementById('li-${id}').remove();recalc()" style="background:none;border:none;cursor:pointer;color:var(--rose);font-size:15px;padding:4px">✕</button></td>`;
  document.getElementById("li-body").appendChild(tr);
  if (data.rate && data.hours) calcRow(id);
  recalc();
}

function calcRow(id) {
  const row = document.getElementById("li-" + id);
  if (!row) return;
  const nums = row.querySelectorAll("input[type=number]");
  const tot = (parseFloat(nums[0].value)||0) * (parseFloat(nums[1].value)||0);
  const el = document.getElementById("li-tot-" + id);
  if (el) el.value = tot > 0 ? "$" + fmtMoney(tot) : "";
}

function recalc() {
  let grand = 0;
  document.querySelectorAll("#li-body tr").forEach(row => {
    const nums = row.querySelectorAll("input[type=number]");
    if (nums.length >= 2) grand += (parseFloat(nums[0].value)||0)*(parseFloat(nums[1].value)||0);
  });
  const el = document.getElementById("grand-total");
  if (el) el.textContent = "$" + fmtMoney(grand);
}

function gatherForm() {
  const co = document.getElementById("inv-co")?.value || "ALG";
  const items = [];
  document.querySelectorAll("#li-body tr").forEach(row => {
    const sel  = row.querySelector("select");
    const ins  = row.querySelectorAll("input");
    const rate = parseFloat(ins[2]?.value)||0;
    const hrs  = parseFloat(ins[3]?.value)||0;
    items.push({ description:sel?.value||"", dateFrom:ins[0]?.value||"", dateTo:ins[1]?.value||"", rate, hours:hrs, total:rate*hrs });
  });
  return {
    userId: CU.uid, userName: UD?.name||CU.email, userEmail: CU.email,
    billingCompany: co, billingCompanyName: COMPANIES[co].name,
    invoiceDate: document.getElementById("inv-date")?.value||"",
    fromName: document.getElementById("inv-from-name")?.value||"",
    fromAddress: document.getElementById("inv-from-addr")?.value||"",
    notes: document.getElementById("inv-notes")?.value||"",
    lineItems: items, total: items.reduce((s,li)=>s+li.total,0),
    paymentMethod: UD?.paymentMethod||"", paymentRecipient: UD?.paymentRecipient||"",
    paymentDetail: UD?.paymentDetail||"", exceptionMethod: UD?.exceptionMethod||"",
    exceptionApproved: UD?.exceptionApproved||false
  };
}

async function saveToDb(data) {
  if (window._editId) { await db.collection("invoices").doc(window._editId).update(data); return window._editId; }
  const ref = await db.collection("invoices").add({ ...data, createdAt: FS.serverTimestamp() });
  return ref.id;
}

async function saveDraft() {
  const d = gatherForm(); d.status = "draft";
  await saveToDb(d); toast("Draft saved!", "success");
}

async function submitInvoice() {
  const d = gatherForm();
  if (!d.fromName) { toast("Please enter your name", "error"); return; }
  if (!d.lineItems.length || d.total === 0) { toast("Please add at least one line item", "error"); return; }
  d.status = "pending";
  if (!window._editId) d.invoiceNumber = "INV-" + Date.now().toString().slice(-6);
  await saveToDb(d);
  toast("Invoice submitted!", "success");
  sendSlack(SLACK_CH, `📄 *New invoice submitted*\n*From:* ${d.userName}\n*Invoice:* ${d.invoiceNumber||""}\n*Company:* ${d.billingCompany}\n_Amounts are confidential — view in Payroll Portal._`);
  goPage("my-invoices");
}

function previewInvoice() {
  const d  = gatherForm();
  const co = COMPANIES[d.billingCompany];
  const rows = (d.lineItems||[]).map(li => `<tr><td>${li.description}</td><td>${li.dateFrom?li.dateFrom+" – "+li.dateTo:"—"}</td><td class="num">$${fmtMoney(li.rate)}</td><td class="num">${li.hours}</td><td class="num">$${fmtMoney(li.total)}</td></tr>`).join("");
  showModal("Invoice Preview", `<div class="inv-preview">
    <div class="inv-p-header">
      <div><div class="inv-p-co">${co.name}</div><div class="inv-p-addr">${co.address.replace(/\n/g,"<br>")}</div></div>
      <div style="text-align:right"><div class="inv-p-num-label">Invoice</div><div class="inv-p-num">${d.invoiceNumber||"#—"}</div><div class="inv-p-date">${d.invoiceDate||"—"}</div></div>
    </div>
    <div class="inv-parties">
      <div><div class="inv-party-label">Bill To</div><div class="inv-party-name">${co.name}</div><div class="inv-party-addr">${co.address.replace(/\n/g,"<br>")}</div></div>
      <div><div class="inv-party-label">From</div><div class="inv-party-name">${d.fromName}</div><div class="inv-party-addr">${(d.fromAddress||"").replace(/\n/g,"<br>")}</div></div>
    </div>
    <table class="inv-p-table"><thead><tr><th>Description</th><th>Period</th><th>Rate</th><th>Hours</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="inv-p-totals"><div class="inv-p-trow grand"><span class="inv-p-tlabel">Amount Due (USD)</span><span class="inv-p-tval">$${fmtMoney(d.total)}</span></div></div>
    ${d.notes?`<div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);font-size:11px;color:var(--ink-soft);text-align:center">${d.notes}</div>`:""}
  </div>`, [{label:"🖨️ Print", cls:"btn-outline", action:"window.print()"}]);
}

// ══════════════════════════════════════════
// PAGE: PROFILE
// ══════════════════════════════════════════
function renderProfile() {
  const ud = UD || {};
  const pmOpts = PAY_METHODS.map(m => `<option value="${m}" ${ud.paymentMethod===m?"selected":""}>${m}</option>`).join("");
  const exOpts = PAY_METHODS.map(m => `<option value="${m}" ${ud.exceptionMethod===m?"selected":""}>${m}</option>`).join("");
  const hasEx  = !!ud.exceptionMethod;

  setMain(`
    <div class="page-header"><div><div class="page-title">My Profile</div><div class="page-subtitle">Personal info and payment setup</div></div></div>
    <div class="page-body">
      <div class="card mb-6">
        <div class="card-header"><div class="card-title">Personal Information</div></div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group"><label>Full Name</label><input type="text" id="p-name" value="${ud.name||""}"></div>
            <div class="form-group"><label>Email</label><input type="email" value="${ud.email||""}" disabled style="opacity:.6"></div>
          </div>
          <div class="form-group"><label>Your Address (shown on invoices)</label><textarea id="p-addr">${ud.address||""}</textarea></div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-header"><div class="card-title">Payment Information</div></div>
        <div class="card-body">
          <p class="text-muted mb-4">Select your payment method. If payment goes to someone else's account, enter their name and details.</p>
          <div class="pm-grid">
            ${["PayPal","Remitly","Payoneer"].map(m=>`
              <div class="pm-btn ${ud.paymentMethod===m?"selected":""}" onclick="pickPM(this,'${m}')">
                <div class="pm-icon">${{PayPal:"🔵",Remitly:"🌐",Payoneer:"🟡"}[m]}</div>
                <div class="pm-name">${m}</div>
                <div class="pm-sub">${{PayPal:"via email",Remitly:"international",Payoneer:"via account"}[m]}</div>
              </div>`).join("")}
          </div>
          <input type="hidden" id="p-pm" value="${ud.paymentMethod||""}">
          <div class="form-row">
            <div class="form-group"><label>Payment Recipient Name</label><input type="text" id="p-recip" value="${ud.paymentRecipient||""}" placeholder="Name on account (if not yours)"></div>
            <div class="form-group"><label>Payment Detail (email / account #)</label><input type="text" id="p-detail" value="${ud.paymentDetail||""}" placeholder="e.g. john@email.com"></div>
          </div>
          <div class="divider"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div>
              <div style="font-weight:600;font-size:14px">Exception / Alternate Payment</div>
              <div class="text-muted">Request an alternate payment method — requires Ali R.'s approval.</div>
            </div>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
              <input type="checkbox" id="ex-toggle" ${hasEx?"checked":""} onchange="toggleEx()"> Request exception
            </label>
          </div>
          <div id="ex-fields" class="${hasEx?"":"hidden"}">
            <div class="exc-block">
              <div class="exc-title">⚑ Exception Request &nbsp;${ud.exceptionApproved?'<span class="badge badge-paid">Approved</span>':'<span class="badge badge-pending">Pending Approval</span>'}</div>
              <div class="form-row">
                <div class="form-group" style="margin:0"><label>Alternate Method</label><select id="ex-method">${exOpts}</select></div>
                <div class="form-group" style="margin:0"><label>Alternate Detail</label><input type="text" id="ex-detail" value="${ud.exceptionDetail||""}" placeholder="Account #, email, routing, etc."></div>
              </div>
              <div style="font-size:12px;color:#8a6a1a;margin-top:9px">⚠️ This will be flagged for Ali R.'s approval before use.</div>
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end">
        <button class="btn btn-primary" onclick="saveProfile()">Save Profile</button>
      </div>
    </div>
  `);
}

function pickPM(el, method) {
  document.querySelectorAll(".pm-btn").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("p-pm").value = method;
}

function toggleEx() {
  const checked = document.getElementById("ex-toggle")?.checked;
  document.getElementById("ex-fields")?.classList.toggle("hidden", !checked);
}

async function saveProfile() {
  const updates = {
    name:              document.getElementById("p-name")?.value.trim(),
    address:           document.getElementById("p-addr")?.value.trim(),
    paymentMethod:     document.getElementById("p-pm")?.value,
    paymentRecipient:  document.getElementById("p-recip")?.value.trim(),
    paymentDetail:     document.getElementById("p-detail")?.value.trim(),
    exceptionMethod:   document.getElementById("ex-toggle")?.checked ? document.getElementById("ex-method")?.value : "",
    exceptionDetail:   document.getElementById("ex-toggle")?.checked ? document.getElementById("ex-detail")?.value.trim() : "",
    exceptionApproved: document.getElementById("ex-toggle")?.checked ? (UD.exceptionApproved||false) : false
  };
  await db.collection("users").doc(CU.uid).update(updates);
  UD = { ...UD, ...updates };
  document.getElementById("sb-name").textContent = updates.name;
  toast("Profile saved!", "success");
}

// ══════════════════════════════════════════
// PAGE: ADMIN DASHBOARD
// ══════════════════════════════════════════
async function renderAdminDashboard() {
  setMain(`<div class="page-header"><div><div class="page-title">Payroll Dashboard</div><div class="page-subtitle">Pending invoices and payment activity</div></div></div><div class="page-body"><div class="text-muted">Loading…</div></div>`);
  const [invs, users] = await Promise.all([getAllInvoices(), getAllUsers()]);
  const pending = invs.filter(i=>i.status==="pending");
  const paid    = invs.filter(i=>i.status==="paid");
  const isPayer = UD?.isPayer;

  setMain(`
    <div class="page-header"><div><div class="page-title">Payroll Dashboard</div><div class="page-subtitle">Pending invoices and payment activity</div></div></div>
    <div class="page-body">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Pending Payment</div><div class="stat-value">${pending.length}</div><div class="stat-sub">$${fmtMoney(pending.reduce((s,i)=>s+(i.total||0),0))} total</div></div>
        <div class="stat-card"><div class="stat-label">Paid This Cycle</div><div class="stat-value">${paid.length}</div><div class="stat-sub">$${fmtMoney(paid.reduce((s,i)=>s+(i.total||0),0))} total</div></div>
        <div class="stat-card"><div class="stat-label">Active Staff</div><div class="stat-value">${users.filter(u=>u.role==="staff"&&u.approved).length}</div><div class="stat-sub">registered members</div></div>
        <div class="stat-card"><div class="stat-label">Pending Approval</div><div class="stat-value">${users.filter(u=>!u.approved).length}</div><div class="stat-sub">new accounts</div></div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">⏳ Pending Invoices</div><span class="badge badge-pending">${pending.length} outstanding</span></div>
        ${!pending.length ? `<div class="empty-state"><div class="es-icon">🎉</div><div class="es-title">All clear!</div></div>` :
        `<table class="data-table"><thead><tr>
          <th>Staff Member</th><th>Invoice #</th><th>Date</th><th>Company</th><th>Payment</th><th>Amount</th>
          ${isPayer?"<th>Actions</th>":""}
        </tr></thead><tbody>
          ${pending.map(inv => {
            const hasEx  = inv.exceptionMethod && !inv.exceptionApproved;
            const pmDisp = inv.paymentMethod||(hasEx?`<span class="badge badge-flag">⚑ Exception pending</span>`:"—");
            const payUrl = getPayLink(inv);
            return `<tr style="cursor:pointer" onclick="openInvModal('${inv.id}',true)">
              <td><div style="display:flex;align-items:center;gap:9px"><div class="avatar">${(inv.userName||"?")[0].toUpperCase()}</div><div><div style="font-weight:600">${inv.userName||inv.userEmail}</div><div class="text-muted">${inv.userEmail}</div></div></div></td>
              <td class="text-mono">${inv.invoiceNumber||"—"}</td>
              <td>${inv.invoiceDate||"—"}</td>
              <td>${inv.billingCompany==="ALG"?'<span class="badge badge-alg">ALG</span>':'<span class="badge badge-dxt">DXT</span>'}</td>
              <td>${pmDisp}</td>
              <td style="font-family:'JetBrains Mono',monospace;font-weight:600">$${fmtMoney(inv.total)}</td>
              ${isPayer?`<td onclick="event.stopPropagation()"><div style="display:flex;gap:6px;flex-wrap:wrap">
                ${payUrl?`<a href="${payUrl}" target="_blank" class="btn btn-outline btn-sm">🔗 Pay via ${inv.paymentMethod}</a>`:""}
                <button class="btn btn-success btn-sm" onclick="markPaid('${inv.id}','${(inv.userName||"").replace(/'/g,"\\'")}')">✓ Mark Paid</button>
              </div></td>`:""}
            </tr>`;
          }).join("")}
        </tbody></table>`}
      </div>
    </div>
  `);
}

// ══════════════════════════════════════════
// PAGE: ALL INVOICES
// ══════════════════════════════════════════
async function renderAdminInvoices() {
  setMain(`<div class="page-body"><div class="text-muted">Loading…</div></div>`);
  const invs = await getAllInvoices();
  const isPayer = UD?.isPayer;
  setMain(`
    <div class="page-header"><div><div class="page-title">All Invoices</div><div class="page-subtitle">Complete invoice history</div></div></div>
    <div class="page-body"><div class="card">
      <table class="data-table"><thead><tr>
        <th>Staff</th><th>Invoice #</th><th>Date</th><th>Company</th><th>Status</th><th>Amount</th>${isPayer?"<th>Actions</th>":""}
      </tr></thead><tbody>
        ${invs.map(inv => `<tr style="cursor:pointer" onclick="openInvModal('${inv.id}',${isPayer})">
          <td><div style="font-weight:600">${inv.userName||inv.userEmail}</div><div class="text-muted">${inv.userEmail}</div></td>
          <td class="text-mono">${inv.invoiceNumber||"—"}</td>
          <td>${inv.invoiceDate||"—"}</td>
          <td>${inv.billingCompany==="ALG"?'<span class="badge badge-alg">ALG</span>':'<span class="badge badge-dxt">DXT</span>'}</td>
          <td>${{paid:'<span class="badge badge-paid">✓ Paid</span>',draft:'<span class="badge badge-draft">Draft</span>',pending:'<span class="badge badge-pending">Pending</span>'}[inv.status]||"—"}</td>
          <td class="text-mono" style="font-weight:600">$${fmtMoney(inv.total)}</td>
          ${isPayer?`<td onclick="event.stopPropagation()">${inv.status!=="paid"?`<button class="btn btn-success btn-sm" onclick="markPaid('${inv.id}','${(inv.userName||"").replace(/'/g,"\\'")}')">✓ Mark Paid</button>`:'<span style="color:var(--green);font-size:13px">✓ Paid</span>'}</td>`:""}
        </tr>`).join("")}
      </tbody></table>
    </div></div>
  `);
}

// ══════════════════════════════════════════
// PAGE: STAFF MANAGEMENT
// ══════════════════════════════════════════
async function renderAdminUsers() {
  setMain(`<div class="page-body"><div class="text-muted">Loading…</div></div>`);
  const users = await getAllUsers();
  setMain(`
    <div class="page-header"><div><div class="page-title">Staff</div><div class="page-subtitle">Registered team members and payment setup</div></div></div>
    <div class="page-body"><div class="card">
      <table class="data-table"><thead><tr>
        <th>Name</th><th>Email</th><th>Payment Method</th><th>Recipient</th><th>Status / Actions</th>
      </tr></thead><tbody>
        ${users.map(u => {
          const hasEx   = !!u.exceptionMethod;
          const exOk    = u.exceptionApproved;
          const approved= u.approved;
          return `<tr>
            <td><div style="display:flex;align-items:center;gap:9px"><div class="avatar">${(u.name||"?")[0].toUpperCase()}</div><div style="font-weight:600">${u.name||"—"}</div></div></td>
            <td class="text-muted">${u.email||"—"}</td>
            <td>${u.paymentMethod||'<span class="text-muted">Not set</span>'}${hasEx?`<br><span class="badge badge-flag">⚑ Exception: ${u.exceptionMethod} ${exOk?"✓":""}</span>`:""}</td>
            <td>${u.paymentRecipient||u.name||"—"}</td>
            <td>
              ${!approved
                ? `<button class="btn btn-primary btn-sm" onclick="approveUser('${u.id}','${(u.name||"").replace(/'/g,"\\'")}','${u.email||""}','${u.slackId||""}')">Approve Account</button>`
                : hasEx && !exOk
                ? `<button class="btn btn-gold btn-sm" onclick="approveException('${u.id}','${(u.name||"").replace(/'/g,"\\'")}')">Approve Exception</button>`
                : hasEx && exOk
                ? '<span class="badge badge-paid">Exception Approved</span>'
                : '<span class="badge badge-paid">Active</span>'}
            </td>
          </tr>`;
        }).join("")}
      </tbody></table>
    </div></div>
  `);
}

async function approveUser(uid, name, email, slackId) {
  await db.collection("users").doc(uid).update({ approved: true });
  toast(`Account approved for ${name}`, "success");
  if (slackId) sendSlackDM(slackId, `✅ *Your Payroll Portal account has been approved!*\n\nYou can now sign in and start submitting invoices. Welcome, ${name}!`);
  renderAdminUsers();
}

async function approveException(uid, name) {
  await db.collection("users").doc(uid).update({ exceptionApproved: true });
  toast(`Exception approved for ${name}`, "success");
  renderAdminUsers();
}

// ══════════════════════════════════════════
// PAGE: OPS VIEW (Didi — no amounts)
// ══════════════════════════════════════════
async function renderOpsView() {
  setMain(`<div class="page-body"><div class="text-muted">Loading…</div></div>`);
  const invs    = await getAllInvoices();
  const pending = invs.filter(i=>i.status==="pending");
  const paid    = invs.filter(i=>i.status==="paid");
  setMain(`
    <div class="page-header"><div><div class="page-title">Submission Status</div><div class="page-subtitle">Invoice submissions — amounts are confidential</div></div></div>
    <div class="page-body">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value">${pending.length}</div><div class="stat-sub">awaiting Ali R.</div></div>
        <div class="stat-card"><div class="stat-label">Paid</div><div class="stat-value">${paid.length}</div><div class="stat-sub">confirmed paid</div></div>
      </div>
      <div class="card mb-6">
        <div class="card-header"><div class="card-title">⏳ Pending</div></div>
        ${!pending.length?`<div class="empty-state"><div class="es-icon">✅</div><div class="es-title">All clear!</div></div>`
        :`<table class="data-table"><thead><tr><th>Staff</th><th>Invoice #</th><th>Date</th><th>Company</th><th>Status</th></tr></thead><tbody>
          ${pending.map(inv=>`<tr><td><strong>${inv.userName||inv.userEmail}</strong></td><td class="text-mono">${inv.invoiceNumber||"—"}</td><td>${inv.invoiceDate||"—"}</td><td>${inv.billingCompany==="ALG"?'<span class="badge badge-alg">ALG</span>':'<span class="badge badge-dxt">DXT</span>'}</td><td><span class="badge badge-pending">Pending</span></td></tr>`).join("")}
        </tbody></table>`}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">✅ Paid</div></div>
        ${!paid.length?`<div class="empty-state"><div class="es-icon">📭</div><div class="es-title">No paid invoices yet</div></div>`
        :`<table class="data-table"><thead><tr><th>Staff</th><th>Invoice #</th><th>Date</th><th>Company</th><th>Status</th></tr></thead><tbody>
          ${paid.map(inv=>`<tr><td><strong>${inv.userName||inv.userEmail}</strong></td><td class="text-mono">${inv.invoiceNumber||"—"}</td><td>${inv.invoiceDate||"—"}</td><td>${inv.billingCompany==="ALG"?'<span class="badge badge-alg">ALG</span>':'<span class="badge badge-dxt">DXT</span>'}</td><td><span class="badge badge-paid">✓ Paid</span></td></tr>`).join("")}
        </tbody></table>`}
      </div>
    </div>
  `);
}

// ══════════════════════════════════════════
// PAGE: ADMIN SETTINGS
// ══════════════════════════════════════════
async function renderAdminSettings() {
  let slackToken = "";
  try { const s = await db.collection("settings").doc("slack").get(); if (s.exists) slackToken = s.data().webhookUrl||""; } catch(e){}

  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    function isPayer() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isPayer == true;
    }
    function isApproved() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.approved == true;
    }
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
    match /invoices/{id} {
      allow read: if request.auth != null && isApproved() &&
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null && isApproved() &&
        request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && isApproved() &&
        (resource.data.userId == request.auth.uid || isPayer());
    }
    match /settings/{doc} {
      allow read, write: if request.auth != null && isPayer();
    }
  }
}`;

  setMain(`
    <div class="page-header"><div><div class="page-title">Settings</div><div class="page-subtitle">System configuration — Ali R. only</div></div></div>
    <div class="page-body">
      <div class="card mb-6">
        <div class="card-header"><div class="card-title">🔔 Slack Integration</div></div>
        <div class="card-body">
          <p class="text-muted mb-4">Use a Slack <strong>Incoming Webhook URL</strong> for notifications — no server needed, no CORS issues. This only posts to <strong>#staff-invoices</strong>.</p>
          <div class="form-group"><label>Slack Webhook URL</label><input type="password" id="slack-tok" value="${slackToken}" placeholder="https://hooks.slack.com/services/..."></div>
          <button class="btn btn-primary" onclick="saveSlackToken()">Save Webhook URL</button>
          <div style="margin-top:14px;font-size:13px;color:var(--ink-soft);line-height:1.8;background:var(--paper);border-radius:var(--radius-sm);padding:12px 14px">
            <strong>How to get your Webhook URL:</strong><br>
            1. Go to <a href="https://api.slack.com/apps" target="_blank" style="color:var(--gold)">api.slack.com/apps</a> → click <strong>ALG Payroll Bot</strong><br>
            2. Left sidebar → <strong>Incoming Webhooks</strong> → toggle <strong>On</strong><br>
            3. Click <strong>Add New Webhook to Workspace</strong><br>
            4. Select channel <strong>#staff-invoices</strong> → Allow<br>
            5. Copy the <code style="background:var(--paper-warm);padding:1px 5px;border-radius:3px">https://hooks.slack.com/services/...</code> URL and paste above
          </div>
        </div>
      </div>
      <div class="card mb-6">
        <div class="card-header"><div class="card-title">🔒 Firestore Security Rules</div></div>
        <div class="card-body">
          <p class="text-muted mb-4">Copy and paste these rules into <strong>Firebase Console → Firestore → Rules</strong>. This locks down the database so staff can only access their own data.</p>
          <div class="rules-block" id="rules-block">${rules}</div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="copyRules()">📋 Copy Rules</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">✅ Security Checklist</div></div>
        <div class="card-body">
          ${[
            [true,  "Email verification required on signup"],
            [true,  "Admin approval required for new staff accounts"],
            [true,  "Two-factor authentication via Slack DM on every login"],
            [true,  "Login rate limiting (5 attempts per 15 min)"],
            [true,  "Strong password enforcement (8+ chars, uppercase, number)"],
            [false, "Firestore security rules — paste above into Firebase Console"],
            [true,  "Slack bot token stored in Firestore (not in app code)"],
            [true,  "No payment credentials stored — deep links only"],
          ].map(([ok,label])=>`<div class="sec-checklist-item"><span>${ok?"✅":"⚠️"}</span><span style="${ok?"":"color:var(--rose);font-weight:600"}">${label}</span>${!ok?'<span class="badge badge-flag">Action needed</span>':""}</div>`).join("")}
        </div>
      </div>
    </div>
  `);

  window.saveSlackToken = async () => {
    const url = document.getElementById("slack-tok").value.trim();
    await db.collection("settings").doc("slack").set({ webhookUrl: url }, { merge: true });
    toast("Webhook URL saved!", "success");
  };
  window.copyRules = () => {
    navigator.clipboard.writeText(document.getElementById("rules-block").textContent)
      .then(() => toast("Rules copied to clipboard!", "success"));
  };
}

// ══════════════════════════════════════════
// INVOICE MODAL
// ══════════════════════════════════════════
async function openInvModal(id, isAdmin) {
  const snap = await db.collection("invoices").doc(id).get();
  if (!snap.exists) { toast("Invoice not found", "error"); return; }
  const inv  = { id:snap.id, ...snap.data() };
  const co   = COMPANIES[inv.billingCompany] || COMPANIES.ALG;
  const isPayer = UD?.isPayer && isAdmin;
  const rows    = (inv.lineItems||[]).map(li=>`<tr><td>${li.description}</td><td>${li.dateFrom?li.dateFrom+" – "+li.dateTo:"—"}</td><td class="num">$${fmtMoney(li.rate)}</td><td class="num">${li.hours}</td><td class="num">$${fmtMoney(li.total)}</td></tr>`).join("");
  const statusBadge = inv.status==="paid"?'<span class="badge badge-paid">✓ Paid</span>':'<span class="badge badge-pending">Pending</span>';
  const payInfo = isAdmin ? `<div class="pay-info-box"><div class="pay-info-label">Payment Info</div>
    <div style="font-size:14px"><strong>Method:</strong> ${inv.paymentMethod||"—"}</div>
    <div style="font-size:14px"><strong>Recipient:</strong> ${inv.paymentRecipient||inv.userName||"—"}</div>
    <div style="font-size:14px"><strong>Detail:</strong> ${inv.paymentDetail||"—"}</div>
    ${inv.exceptionMethod?`<div style="margin-top:7px"><span class="badge badge-flag">⚑ Exception: ${inv.exceptionMethod} — ${inv.exceptionDetail||"—"} ${inv.exceptionApproved?"(Approved)":"(Pending approval)"}</span></div>`:""}
  </div>` : "";

  const btns = isPayer && inv.status!=="paid" ? [
    ...(getPayLink(inv)?[{label:`🔗 Pay via ${inv.paymentMethod}`,cls:"btn-outline",action:`window.open('${getPayLink(inv)}','_blank')`}]:[]),
    {label:"✓ Mark as Paid", cls:"btn-success", action:`markPaid('${inv.id}','${(inv.userName||"").replace(/'/g,"\\'")}')` }
  ] : [];

  showModal(`Invoice ${inv.invoiceNumber||""} &nbsp; ${statusBadge}`,
    `<div class="inv-preview" style="border:none;padding:0">
      <div class="inv-p-header">
        <div><div class="inv-p-co">${co.name}</div><div class="inv-p-addr">${co.address.replace(/\n/g,"<br>")}</div></div>
        <div style="text-align:right"><div class="inv-p-num-label">Invoice</div><div class="inv-p-num">${inv.invoiceNumber||"—"}</div><div class="inv-p-date">${inv.invoiceDate||"—"}</div></div>
      </div>
      <div class="inv-parties">
        <div><div class="inv-party-label">Bill To</div><div class="inv-party-name">${co.name}</div><div class="inv-party-addr">${co.address.replace(/\n/g,"<br>")}</div></div>
        <div><div class="inv-party-label">From</div><div class="inv-party-name">${inv.fromName||inv.userName||"—"}</div><div class="inv-party-addr">${(inv.fromAddress||"").replace(/\n/g,"<br>")}</div></div>
      </div>
      <table class="inv-p-table"><thead><tr><th>Description</th><th>Period</th><th>Rate</th><th>Hours</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="inv-p-totals"><div class="inv-p-trow grand"><span class="inv-p-tlabel">Amount Due (USD)</span><span class="inv-p-tval">$${fmtMoney(inv.total)}</span></div></div>
      ${inv.notes?`<div style="margin-top:22px;padding-top:14px;border-top:1px solid var(--border);font-size:11px;color:var(--ink-soft);text-align:center">${inv.notes}</div>`:""}
      ${payInfo}
    </div>`, btns);
}

async function markPaid(id, name) {
  await db.collection("invoices").doc(id).update({ status:"paid", paidAt:FS.serverTimestamp(), paidBy:CU.email });
  closeModal();
  toast(`Marked as paid for ${name}`, "success");
  sendSlack(SLACK_CH, `✅ *Invoice paid*\n*Staff:* ${name}\n_Payment confirmed by Ali R._`);
  goPage(curPage);
}

function getPayLink(inv) {
  const m = ((inv.exceptionApproved ? inv.exceptionMethod : null) || inv.paymentMethod || "").toLowerCase();
  if (m.includes("paypal"))   return "https://www.paypal.com/myaccount/transfer/homepage/pay";
  if (m.includes("remitly"))  return "https://www.remitly.com";
  if (m.includes("payoneer")) return "https://myaccount.payoneer.com/ma/sendmoney";
  if (m.includes("zelle"))    return "https://www.zellepay.com";
  return null;
}

// ── Invoice editing helpers ──
async function editInvoice(id) {
  const snap = await db.collection("invoices").doc(id).get();
  if (!snap.exists) return;
  const inv = { id: snap.id, ...snap.data() };
  window._editId = id;
  renderNewInvoice(inv);
}

async function submitDraft(id) {
  const snap = await db.collection("invoices").doc(id).get();
  if (!snap.exists) return;
  const inv = snap.data();
  const num = inv.invoiceNumber || "INV-" + Date.now().toString().slice(-6);
  await db.collection("invoices").doc(id).update({
    status: "pending",
    invoiceNumber: num,
    submittedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  toast("Invoice submitted!", "success");
  sendSlack(SLACK_CH, `📄 *New invoice submitted*
*From:* ${inv.userName||inv.userEmail}
*Invoice:* ${num}
*Company:* ${inv.billingCompany||""}
_Amounts are confidential — view in Payroll Portal._`);
  renderMyInvoices();
}

async function deleteInvoice(id) {
  if (!confirm("Delete this draft invoice? This cannot be undone.")) return;
  await db.collection("invoices").doc(id).update({ status: "deleted" });
  toast("Draft deleted", "info");
  renderMyInvoices();
}

async function editInvoicePending(id) {
  // Show warning modal first
  showModal("⚠️ Edit Submitted Invoice",
    `<div style="font-size:15px;line-height:1.7;color:var(--ink)">
      <p style="margin-bottom:14px">This invoice has already been submitted for payment.</p>
      <div style="background:var(--rose-light);border:1px solid #f5c4c4;border-radius:var(--radius-sm);padding:14px 16px;color:var(--rose);font-size:14px;margin-bottom:16px">
        ⚠️ <strong>Important:</strong> Any changes made after submission may not be immediately visible on Ali R.'s dashboard and could lead to payment delays. Please notify Ali R. directly if you make changes.
      </div>
      <p style="font-size:13px;color:var(--ink-soft)">Do you want to continue editing?</p>
    </div>`,
    [{ label: "Yes, edit anyway", cls: "btn-danger", action: `proceedEditPending('${id}')` }]
  );
}

window.proceedEditPending = async function(id) {
  closeModal();
  await editInvoice(id);
};

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
function showModal(title, body, btns=[]) {
  document.getElementById("modal-area").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="close-btn" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModal()">Close</button>
          ${btns.map(b=>`<button class="btn ${b.cls||"btn-outline"}" onclick="${b.action}">${b.label}</button>`).join("")}
        </div>
      </div>
    </div>`;
}
function closeModal() { document.getElementById("modal-area").innerHTML = ""; }

// ══════════════════════════════════════════
// SLACK
// ══════════════════════════════════════════
// Slack via Incoming Webhook (no CORS issues) + Firestore queue for DMs
async function getWebhookUrl() {
  try {
    const s = await db.collection("settings").doc("slack").get();
    return s.exists ? s.data().webhookUrl || null : null;
  } catch(e) { return null; }
}

async function sendSlack(channel, text) {
  // Try webhook first (no CORS), fallback to Firestore queue
  const webhookUrl = await getWebhookUrl();
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify({ text })
      });
      console.log("Slack webhook sent OK");
      return;
    } catch(e) { console.warn("Webhook error:", e); }
  }
  // Fallback: write to Firestore notifications queue
  await db.collection("notifications").add({
    channel, text, createdAt: FS.serverTimestamp(), sent: false
  });
  console.log("Notification queued in Firestore");
}

async function sendSlackDM(userId, text) {
  // Queue DM in Firestore (processed server-side or manually)
  await db.collection("notifications").add({
    channel: userId, text, isDM: true,
    createdAt: FS.serverTimestamp(), sent: false
  });
}

// ══════════════════════════════════════════
// MONDAY REMINDER
// ══════════════════════════════════════════
async function checkMondayReminder() {
  if (!UD?.isPayer) return;
  const pst  = new Date(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"}));
  if (pst.getDay()!==1 || pst.getHours()<7) return;
  const key  = "reminder_" + pst.toISOString().split("T")[0];
  if (localStorage.getItem(key)) return;
  const invs = await getAllInvoices();
  const pend = invs.filter(i=>i.status==="pending");
  if (!pend.length) return;
  const names = [...new Set(pend.map(i=>i.userName||i.userEmail))].join(", ");
  await sendSlack(SLACK_CH, `⏰ *Monday Payroll Reminder*\n${pend.length} invoice(s) still outstanding from: ${names}\n_Review in the Payroll Portal._`);
  localStorage.setItem(key,"1");
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function fmtMoney(n) { return (parseFloat(n)||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtDate(ts) { if(!ts) return "—"; const d=ts.toDate?ts.toDate():new Date(ts); return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); }
function isWindowOpen() { const pst=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})); const d=pst.getDay(),h=pst.getHours(); return (d===5&&h>=18)||d===6||(d===0&&h<12); }
function toast(msg, type="info") {
  const icons={success:"✓",error:"✕",info:"ℹ"};
  const t=document.createElement("div"); t.className=`toast ${type}`; t.innerHTML=`<span>${icons[type]}</span> ${msg}`;
  document.getElementById("toast-area").appendChild(t); setTimeout(()=>t.remove(),3500);
}

// Init auth screen visible
document.getElementById("screen-auth").style.display = "flex";
</script>
</body>
</html>
