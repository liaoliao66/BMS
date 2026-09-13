/* 经营管理系统 · 企业微信内嵌 H5 · v1.0.0（WeUI 风格 · 无手机壳 · 无底部 Tab） */
(function () {
  const LEDGER = [
    { id: "dashboard", name: "经营总览", href: "经营台账_总览_wecom.html" },
    { id: "depts", name: "任务台账", href: "部门工作台_wecom.html" },
    { id: "reports", name: "工作周报", href: "经营台账_工作汇报_wecom.html" },
  ];

  const TASK_NAV = [
    { id: "my-tasks", name: "我的任务", href: "任务中心_我的任务_wecom.html" },
    { id: "period-fill", name: "周期填报", href: "任务中心_周期填报_wecom.html" },
  ];

  const NAV_GROUPS = { ledger: LEDGER, tasks: TASK_NAV };

  const pageId = document.body.getAttribute("data-page") || "";
  const title = document.body.getAttribute("data-title") || "经营管理系统";

  function injectStyles() {
    if (document.getElementById("wecom-base-style") || document.querySelector('link[href*="wecom-common.css"]')) return;
    const s = document.createElement("style");
    s.id = "wecom-base-style";
    s.textContent = `
      :root {
        --wx-bg: #ededed;
        --wx-panel: #ffffff;
        --wx-primary: #0082ef;
        --wx-primary-press: #0069c2;
        --wx-text: #191919;
        --wx-text-sec: #888888;
        --wx-text-tips: #b2b2b2;
        --wx-line: rgba(0,0,0,.08);
        --wx-danger: #fa5151;
        --wx-warn: #ffc300;
        --wx-success: #07c160;
      }
      * { box-sizing: border-box; }
      html { -webkit-tap-highlight-color: transparent; font-size: 16px; }
      body.wecom-body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
        background: var(--wx-bg);
        color: var(--wx-text);
        line-height: 1.5;
        padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
        -webkit-font-smoothing: antialiased;
      }

      /* 顶栏：模拟企微 WebView 标题栏 */
      .wecom-nav {
        position: sticky; top: 0; z-index: 40;
        background: var(--wx-panel);
        border-bottom: 1px solid var(--wx-line);
      }
      .wecom-nav-bar {
        position: relative;
        display: flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 48px;
      }
      .wecom-back {
        position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
        width: 44px; height: 44px; border: none; background: transparent;
        color: var(--wx-text); font-size: 18px; display: flex; align-items: center; justify-content: center;
      }
      .wecom-back:active { opacity: .55; }
      .wecom-title {
        font-size: 17px; font-weight: 600; color: var(--wx-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      /* 页内 Tab：企微应用常见下划线 Tab */
      .wecom-tabs {
        display: flex; background: var(--wx-panel);
        border-bottom: 1px solid var(--wx-line);
      }
      .wecom-tab {
        flex: 1; text-align: center; padding: 11px 4px 10px;
        font-size: 14px; color: var(--wx-text-sec); text-decoration: none;
        position: relative; border: none; background: transparent;
      }
      .wecom-tab.on { color: var(--wx-primary); font-weight: 600; }
      .wecom-tab.on::after {
        content: ""; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
        width: 28px; height: 3px; border-radius: 2px; background: var(--wx-primary);
      }
      .wecom-tab:active { opacity: .7; }

      .wecom-main { padding: 0; min-height: calc(100vh - 44px); }

      /* 分组标题 */
      .wecom-hd {
        padding: 12px 16px 6px; font-size: 13px; color: var(--wx-text-sec);
        display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
      }
      .wecom-hd strong { color: var(--wx-text); font-weight: 600; font-size: 14px; }
      .wecom-tag {
        font-size: 12px; padding: 1px 6px; border-radius: 3px;
        background: #f0f0f0; color: var(--wx-text-sec);
      }
      .wecom-tag-blue { background: #e8f3ff; color: var(--wx-primary); }
      .wecom-tips { padding: 0 16px 8px; font-size: 12px; color: var(--wx-text-tips); line-height: 1.45; }

      /* 白底面板 */
      .wecom-panel { background: var(--wx-panel); margin-bottom: 8px; }
      .wecom-panel + .wecom-panel { margin-top: 0; }

      /* KPI 宫格 */
      .wecom-kpi-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
        background: var(--wx-line); border-top: 1px solid var(--wx-line);
        border-bottom: 1px solid var(--wx-line);
      }
      .wecom-kpi-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
      .wecom-kpi-item {
        background: var(--wx-panel); border: none; padding: 14px 12px; text-align: left;
        min-height: 72px;
      }
      .wecom-kpi-item:active { background: #f7f7f7; }
      .wecom-kpi-item.span-2 { grid-column: span 2; }
      .wecom-kpi-label { font-size: 12px; color: var(--wx-text-sec); }
      .wecom-kpi-val { font-size: 22px; font-weight: 600; margin-top: 4px; line-height: 1.2; }
      .wecom-kpi-sub { font-size: 12px; color: var(--wx-text-tips); margin-top: 4px; }
      .wecom-kpi-val.warn { color: var(--wx-warn); }
      .wecom-kpi-val.danger { color: var(--wx-danger); }
      .wecom-kpi-val.primary { color: var(--wx-primary); }

      /* 表单行 */
      .wecom-form { background: var(--wx-panel); padding: 0 16px; margin-bottom: 8px; border-top: 1px solid var(--wx-line); border-bottom: 1px solid var(--wx-line); }
      .wecom-form-row {
        display: flex; align-items: center; min-height: 48px;
        border-bottom: 1px solid var(--wx-line); font-size: 15px;
      }
      .wecom-form-row:last-child { border-bottom: none; }
      .wecom-form-label { width: 72px; flex-shrink: 0; color: var(--wx-text); font-size: 14px; }
      .wecom-select {
        flex: 1; border: none; background: transparent; font-size: 14px; color: var(--wx-text);
        padding: 12px 0; outline: none; appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='12' viewBox='0 0 8 12'%3E%3Cpath fill='%23b2b2b2' d='M1 1l5 5-5 5'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right center;
        padding-right: 16px;
      }

      /* 列表 Cell（WeUI cells） */
      .wecom-cells { background: var(--wx-panel); border-top: 1px solid var(--wx-line); border-bottom: 1px solid var(--wx-line); }
      .wecom-cell {
        display: flex; align-items: center; min-height: 56px; padding: 10px 16px;
        border-bottom: 1px solid var(--wx-line); background: var(--wx-panel);
        width: 100%; text-align: left; border-left: none; border-right: none; border-top: none;
        font: inherit; color: inherit;
      }
      .wecom-cell:last-child { border-bottom: none; }
      .wecom-cell:active { background: #ececec; }
      .wecom-cell-bd { flex: 1; min-width: 0; }
      .wecom-cell-title { font-size: 15px; color: var(--wx-text); line-height: 1.35; }
      .wecom-cell-desc { font-size: 12px; color: var(--wx-text-sec); margin-top: 3px; line-height: 1.4; }
      .wecom-cell-ft { flex-shrink: 0; margin-left: 8px; display: flex; align-items: center; gap: 6px; }
      .wecom-cell-val { font-size: 14px; color: var(--wx-text-sec); }
      .wecom-cell-arrow { color: #c7c7cc; font-size: 14px; font-weight: 600; }
      .wecom-cell-title.link { color: var(--wx-primary); }

      /* 内页 Tab */
      .wecom-seg {
        display: flex; background: var(--wx-panel); border-bottom: 1px solid var(--wx-line);
        overflow-x: auto; scrollbar-width: none;
      }
      .wecom-seg::-webkit-scrollbar { display: none; }
      .wecom-seg-btn {
        flex-shrink: 0; padding: 10px 16px; font-size: 14px; color: var(--wx-text-sec);
        border: none; background: transparent; position: relative;
      }
      .wecom-seg-btn.on { color: var(--wx-primary); font-weight: 600; }
      .wecom-seg-btn.on::after {
        content: ""; position: absolute; left: 16px; right: 16px; bottom: 0; height: 2px;
        background: var(--wx-primary); border-radius: 1px;
      }

      /* 进度条 */
      .wecom-progress { margin-top: 10px; }
      .wecom-progress-hd { display: -webkit-box; display: flex; -webkit-box-pack: justify; justify-content: space-between; font-size: 12px; color: var(--wx-text-sec); margin-bottom: 4px; }
      .wecom-progress-bar { height: 4px; background: #ebebeb; border-radius: 2px; overflow: hidden; }
      .wecom-progress-inner { height: 100%; background: var(--wx-primary); border-radius: 2px; }

      /* 状态徽标 */
      .wecom-status {
        font-size: 12px; padding: 1px 6px; border-radius: 3px; white-space: nowrap;
      }
      .wecom-status-warn { background: #fff7e6; color: #d48806; }
      .wecom-status-danger { background: #fff1f0; color: var(--wx-danger); }
      .wecom-status-ok { background: #f6ffed; color: var(--wx-success); }
      .wecom-status-info { background: #e8f3ff; color: var(--wx-primary); }

      /* 按钮 */
      .btn-cta, .wecom-btn-primary {
        display: block; width: 100%; border: none; border-radius: 6px;
        background: var(--wx-primary); color: #fff; font-size: 16px;
        padding: 12px 16px; text-align: center; font-weight: 500;
      }
      .btn-cta:active, .wecom-btn-primary:active { background: var(--wx-primary-press); }
      .wecom-btn-area { padding: 16px; }

      /* 弹窗 */
      [data-modal] { display: none; position: fixed; inset: 0; z-index: 100; align-items: center; justify-content: center; padding: 24px 28px; }
      [data-modal].wecom-open { display: flex !important; }
      .wecom-mask { position: absolute; inset: 0; background: rgba(0,0,0,.55); }
      .wecom-dialog {
        position: relative; width: 100%; max-width: 320px; max-height: 80vh;
        background: var(--wx-panel); border-radius: 8px; overflow: hidden;
        display: flex; flex-direction: column;
      }
      .wecom-dialog-hd { padding: 20px 20px 8px; text-align: center; }
      .wecom-dialog-title { font-size: 17px; font-weight: 600; }
      .wecom-dialog-sub { font-size: 13px; color: var(--wx-text-sec); margin-top: 6px; }
      .wecom-dialog-bd { flex: 1; overflow-y: auto; padding: 8px 0; }
      .wecom-dialog-row {
        display: flex; justify-content: space-between; padding: 10px 20px;
        font-size: 14px; border-bottom: 1px solid var(--wx-line);
      }
      .wecom-dialog-row:last-child { border-bottom: none; }
      .wecom-dialog-row .lbl { color: var(--wx-text-sec); }
      .wecom-dialog-row .val { font-weight: 500; text-align: right; max-width: 58%; }
      .wecom-dialog-ft {
        display: flex; border-top: 1px solid var(--wx-line);
      }
      .wecom-dialog-btn {
        flex: 1; border: none; background: var(--wx-panel); padding: 14px;
        font-size: 16px; color: var(--wx-text);
      }
      .wecom-dialog-btn.primary { color: var(--wx-primary); font-weight: 600; }
      .wecom-dialog-btn:active { background: #f7f7f7; }
      .wecom-dialog-btn + .wecom-dialog-btn { border-left: 1px solid var(--wx-line); }

      /* Toast */
      .wecom-toast {
        position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,.72); color: #fff; font-size: 14px;
        padding: 12px 20px; border-radius: 6px; z-index: 9999;
        opacity: 0; pointer-events: none; transition: opacity .2s;
        max-width: calc(100vw - 48px); text-align: center; line-height: 1.45;
      }
      .wecom-toast.show { opacity: 1; }

      /* 入口页 */
      .wecom-entry { padding: 0; min-height: 100vh; background: var(--wx-bg); }
      .wecom-entry-banner {
        background: var(--wx-panel); padding: 20px 16px 16px;
        border-bottom: 1px solid var(--wx-line);
      }
      .wecom-entry-banner h1 { margin: 0; font-size: 20px; font-weight: 600; }
      .wecom-entry-banner p { margin: 6px 0 0; font-size: 13px; color: var(--wx-text-sec); line-height: 1.5; }
      .hidden { display: none !important; }

      /* 边界态：空 / 加载 / 异常 */
      .wecom-state {
        padding: 40px 24px; text-align: center; background: var(--wx-panel);
        border-top: 1px solid var(--wx-line); border-bottom: 1px solid var(--wx-line);
      }
      .wecom-state-icon { font-size: 32px; color: var(--wx-text-tips); margin-bottom: 12px; }
      .wecom-state-title { font-size: 15px; color: var(--wx-text); font-weight: 500; }
      .wecom-state-desc { font-size: 13px; color: var(--wx-text-sec); margin-top: 6px; line-height: 1.5; }
      .wecom-state-btn {
        margin-top: 16px; display: inline-block; padding: 8px 20px;
        border: 1px solid var(--wx-primary); color: var(--wx-primary);
        border-radius: 6px; font-size: 14px; background: transparent;
      }
      .wecom-state-btn:active { opacity: .7; }
      .wecom-spinner {
        width: 28px; height: 28px; margin: 0 auto 12px;
        border: 2px solid #ebebeb; border-top-color: var(--wx-primary);
        border-radius: 50%; -webkit-animation: wecom-spin .8s linear infinite;
        animation: wecom-spin .8s linear infinite;
      }
      @-webkit-keyframes wecom-spin { to { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }
      @keyframes wecom-spin { to { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }

      /* 浮动操作 */
      .wecom-fab {
        position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        width: 52px; height: 52px; border-radius: 50%; border: none;
        background: var(--wx-primary); color: #fff; font-size: 22px;
        box-shadow: 0 2px 8px rgba(0,0,0,.15); z-index: 30;
      }
      .wecom-fab:active { background: var(--wx-primary-press); }
      .wecom-field-label { font-size: 13px; color: var(--wx-text-sec); margin-bottom: 6px; display: block; }
      .wecom-input {
        width: 100%; border: 1px solid var(--wx-line); border-radius: 6px;
        padding: 10px; font-size: 14px; background: #fff; outline: none;
      }
      .wecom-input:focus { border-color: var(--wx-primary); }
    `;
    document.head.appendChild(s);
  }

  function buildShell() {
    const root = document.getElementById("app-root");
    if (!root) return;
    root.innerHTML = `
      <header class="wecom-nav">
        <div class="wecom-nav-bar">
          <button type="button" class="wecom-back" onclick="WECOM.goBack()" aria-label="返回"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="wecom-title">${title}</div>
        </div>
      </header>`;
    document.body.classList.add("wecom-body");
    const screen = document.getElementById("wecom-phone-screen");
    if (screen) screen.classList.add("wecom-body");
  }

  function cell(opts) {
    const titleCls = opts.link ? "wecom-cell-title link" : "wecom-cell-title";
    const arrow = opts.access !== false ? '<span class="wecom-cell-arrow">›</span>' : "";
    const ft = opts.ft ? `<div class="wecom-cell-ft">${opts.ft}${arrow}</div>` : (arrow ? `<div class="wecom-cell-ft">${arrow}</div>` : "");
    const desc = opts.desc ? `<div class="wecom-cell-desc">${opts.desc}</div>` : "";
    const tag = opts.tag || "button";
    const click = opts.onclick ? ` onclick="${opts.onclick}"` : "";
    return `<${tag} type="button" class="wecom-cell"${click}>
      <div class="wecom-cell-bd"><div class="${titleCls}">${opts.title}</div>${desc}</div>${ft}
    </${tag}>`;
  }

  function statusBadge(text, type) {
    const map = { warn: "wecom-status-warn", danger: "wecom-status-danger", ok: "wecom-status-ok", info: "wecom-status-info" };
    return `<span class="wecom-status ${map[type] || "wecom-status-info"}">${text}</span>`;
  }

  function deviceStatusBarHTML() {
    return `<div class="device-status-bar" aria-hidden="true">
      <span class="device-time">9:41</span>
      <div class="device-island"></div>
      <div class="device-status-icons">
        <i class="fa-solid fa-signal"></i>
        <i class="fa-solid fa-wifi"></i>
        <i class="fa-solid fa-battery-full"></i>
      </div>
    </div>`;
  }

  function deviceHomeBarHTML() {
    return `<div class="device-home-bar" aria-hidden="true"><span></span></div>`;
  }

  function buildDeviceShell(screenEl, mini) {
    const shell = document.createElement("div");
    shell.className = mini ? "device-shell is-mini" : "device-shell";
    const bezel = document.createElement("div");
    bezel.className = "device-shell-bezel";
    bezel.innerHTML = deviceStatusBarHTML();
    bezel.appendChild(screenEl);
    const homeWrap = document.createElement("div");
    homeWrap.innerHTML = deviceHomeBarHTML();
    bezel.appendChild(homeWrap.firstChild);
    shell.appendChild(bezel);
    return shell;
  }

  function getMountRoot() {
    return document.getElementById("wecom-phone-screen") || document.body;
  }

  function wrapPhoneShell() {
    if (document.body.getAttribute("data-no-phone") === "1") return;
    if (document.getElementById("wecom-phone-screen")) return;

    const screen = document.createElement("div");
    screen.id = "wecom-phone-screen";
    screen.className = "device-screen-body";
    if (document.body.classList.contains("wecom-entry")) {
      screen.classList.add("wecom-entry");
      document.body.classList.remove("wecom-entry");
    }

    const shell = buildDeviceShell(screen, false);
    const stage = document.createElement("div");
    stage.className = "wecom-preview-stage";
    stage.appendChild(shell);

    const hint = document.createElement("p");
    hint.className = "wecom-preview-hint";
    hint.textContent = "iPhone 16 原型预览 · 企微 H5 · 各模块为独立工作台入口";
    stage.appendChild(hint);

    const nodes = [];
    document.body.childNodes.forEach((n) => {
      if (n.nodeName === "SCRIPT") return;
      nodes.push(n);
    });
    nodes.forEach((n) => screen.appendChild(n));

    document.body.insertBefore(stage, document.body.firstChild);
    document.body.classList.add("wecom-preview-host");
  }

  function ensureToast() {
    const root = getMountRoot();
    if (!root.querySelector("#wecom-toast")) {
      const el = document.createElement("div");
      el.id = "wecom-toast";
      el.className = "wecom-toast";
      root.appendChild(el);
    }
  }

  function toast(msg) {
    ensureToast();
    const el = document.getElementById("wecom-toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2000);
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("wecom-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("wecom-open");
    if (!document.querySelector("[data-modal].wecom-open")) document.body.style.overflow = "";
  }

  function goBack() {
    const idx = "index.html";
    if (history.length > 1) history.back();
    else location.href = idx;
  }

  function emptyState(opts) {
    const o = opts || {};
    return `<div class="wecom-state">
      <div class="wecom-state-icon"><i class="fa-regular fa-folder-open"></i></div>
      <div class="wecom-state-title">${o.title || "暂无数据"}</div>
      <div class="wecom-state-desc">${o.desc || "当前筛选条件下没有可展示的内容"}</div>
    </div>`;
  }

  function loadingState(msg) {
    return `<div class="wecom-state">
      <div class="wecom-spinner"></div>
      <div class="wecom-state-title">${msg || "加载中"}</div>
      <div class="wecom-state-desc">请稍候</div>
    </div>`;
  }

  function errorState(opts) {
    const o = opts || {};
    const retry = o.onRetry ? ` onclick="${o.onRetry}"` : "";
    return `<div class="wecom-state">
      <div class="wecom-state-icon"><i class="fa-solid fa-wifi"></i></div>
      <div class="wecom-state-title">${o.title || "网络异常"}</div>
      <div class="wecom-state-desc">${o.desc || "请检查网络后重试"}</div>
      ${o.onRetry ? `<button type="button" class="wecom-state-btn"${retry}>重新加载</button>` : ""}
    </div>`;
  }

  injectStyles();
  wrapPhoneShell();
  if (document.getElementById("app-root")) buildShell();
  ensureToast();

  window.WECOM = { toast, openModal, closeModal, goBack, LEDGER, TASK_NAV, cell, statusBadge, emptyState, loadingState, errorState, deviceStatusBarHTML, deviceHomeBarHTML, buildDeviceShell };
  window.BMS = window.BMS || {};
  window.BMS.toast = (msg, type) => toast(type === "error" ? msg : msg);
  window.BMS.openModal = openModal;
  window.BMS.closeModal = closeModal;
})();
