/* 经营管理系统 v1.0.0 · PC 公共壳（菜单第 2 轮） */
(function () {
  const NAV = [
    {
      group: "经营台账",
      items: [
        { id: "dashboard", name: "经营总览", href: "经营台账_总览_page.html", icon: "fa-chart-line" },
        { id: "depts", name: "工作台", href: "部门工作台_部门工作台_page.html", icon: "fa-sitemap" },
        { id: "reports", name: "工作周报", href: "经营台账_工作汇报_page.html", icon: "fa-file-lines" },
      ],
    },
    {
      group: "目标计划",
      items: [
        { id: "goals", name: "目标管理", href: "目标管理_目标列表_page.html", icon: "fa-bullseye" },
        { id: "plans", name: "计划管理", href: "计划管理_计划列表_page.html", icon: "fa-calendar-check" },
      ],
    },
    {
      group: "任务中心",
      items: [
        { id: "my-tasks", name: "任务清单", href: "任务中心_我的任务_page.html", icon: "fa-list-check" },
        { id: "supervise", name: "任务督办", href: "任务中心_任务督办_page.html", icon: "fa-flag" },
        { id: "reminders", name: "汇报提醒", href: "任务中心_汇报提醒_page.html", icon: "fa-bell" },
      ],
    },
    {
      group: "专项",
      items: [
        { id: "projects", name: "专项管理", href: "专项管理_专项列表_page.html", icon: "fa-folder-open" },
      ],
    },
    {
      group: "合同收款",
      items: [
        { id: "contracts", name: "合同管理", href: "合同收款_合同管理_page.html", icon: "fa-file-signature" },
        { id: "receipts", name: "收款管理", href: "合同收款_收款管理_page.html", icon: "fa-yen-sign" },
      ],
    },
  ];

  const pageId = document.body.getAttribute("data-page") || "";
  const title = document.body.getAttribute("data-title") || "经营管理系统";

  function injectModalStyles() {
    if (document.getElementById("bms-modal-fs-style")) return;
    const style = document.createElement("style");
    style.id = "bms-modal-fs-style";
    style.textContent = `
      [data-modal].bms-modal-fs { padding: 0 !important; align-items: stretch !important; justify-content: stretch !important; }
      [data-modal].bms-modal-fs > .bms-modal-panel {
        width: 100% !important;
        max-width: none !important;
        height: 100% !important;
        max-height: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }
      .bms-fs-group {
        display: inline-flex !important;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
        margin-left: auto;
      }
      .bms-fs-btn {
        width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;
        color: #94a3b8; background: #fff; display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0; padding: 0; line-height: 1;
      }
      .bms-fs-btn:hover { color: #475569; background: #f8fafc; }
    `;
    document.head.appendChild(style);
  }

  function getModalPanel(modal) {
    if (!modal) return null;
    if (modal._bmsPanel && modal.contains(modal._bmsPanel)) return modal._bmsPanel;
    const kids = Array.from(modal.children);
    const panel =
      kids.find((el) => el.classList && el.classList.contains("relative") && el.classList.contains("bg-white")) ||
      kids.find((el) => el.classList && el.classList.contains("relative") && !el.classList.contains("absolute")) ||
      kids.find((el) => el.classList && !el.classList.contains("absolute"));
    if (panel) {
      panel.classList.add("bms-modal-panel");
      modal._bmsPanel = panel;
    }
    return panel || null;
  }

  function setModalFullscreen(modal, on) {
    if (!modal) return;
    const btn = modal.querySelector(".bms-fs-btn");
    const icon = btn && btn.querySelector("i");
    if (on) {
      modal.classList.add("bms-modal-fs");
      if (icon) icon.className = "fa-solid fa-compress";
      if (btn) btn.title = "还原窗口";
    } else {
      modal.classList.remove("bms-modal-fs");
      if (icon) icon.className = "fa-solid fa-expand";
      if (btn) btn.title = "全屏查看";
    }
  }

  function findCloseButton(panel) {
    if (!panel) return null;
    const buttons = Array.from(panel.querySelectorAll("button"));
    const byIcon = buttons.find((b) => b.querySelector(".fa-xmark, .fa-times"));
    if (byIcon) return byIcon;
    return (
      buttons.find((b) => {
        const oc = b.getAttribute("onclick") || "";
        return /closeModal\s*\(/.test(oc) && !/openModal/.test(oc);
      }) || null
    );
  }

  function enhanceModal(modal) {
    if (!modal || modal.dataset.bmsFsReady === "1") return;
    const panel = getModalPanel(modal);
    if (!panel) return;
    const closeBtn = findCloseButton(panel);
    if (!closeBtn) return;
    if (panel.querySelector(".bms-fs-btn") || closeBtn.closest(".bms-fs-group")) {
      modal.dataset.bmsFsReady = "1";
      return;
    }
    const fsBtn = document.createElement("button");
    fsBtn.type = "button";
    fsBtn.className = "bms-fs-btn";
    fsBtn.title = "全屏查看";
    fsBtn.setAttribute("aria-label", "全屏查看");
    fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    fsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setModalFullscreen(modal, !modal.classList.contains("bms-modal-fs"));
    });
    if (closeBtn.querySelector(".fa-xmark, .fa-times") && !/\bw-9\b/.test(closeBtn.className)) {
      closeBtn.classList.add("w-9", "h-9", "rounded-xl", "border", "inline-flex", "items-center", "justify-center");
    }
    // 与关闭按钮绑成紧挨一组，避免落在 justify-between 中间被撑开
    const parent = closeBtn.parentNode;
    const group = document.createElement("div");
    group.className = "bms-fs-group";
    parent.insertBefore(group, closeBtn);
    group.appendChild(fsBtn);
    group.appendChild(closeBtn);
    modal.dataset.bmsFsReady = "1";
  }

  function enhanceAllModals() {
    document.querySelectorAll("[data-modal]").forEach(enhanceModal);
  }

  function buildSidebar() {
    let html = `
      <aside class="w-64 shrink-0 bg-slate-800 text-slate-200 min-h-screen flex flex-col">
        <div class="px-5 py-5 border-b border-slate-700">
          <div class="text-white font-semibold text-base tracking-wide">经营管理系统</div>
          <div class="text-xs text-slate-400 mt-1">v1.0.0 · PC 原型</div>
        </div>
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-5">`;
    NAV.forEach((g) => {
      html += `<div><div class="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-500">${g.group}</div><ul class="space-y-1">`;
      g.items.forEach((item) => {
        const active = item.id === pageId;
        html += `<li><a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
          active ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
        }"><i class="fa-solid ${item.icon} w-4 text-center opacity-80"></i><span>${item.name}</span></a></li>`;
      });
      html += `</ul></div>`;
    });
    html += `</nav></aside>`;
    return html;
  }

  function buildHeader() {
    return `
      <header class="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div class="flex items-center gap-3 min-w-0">
          <h1 class="text-base font-semibold text-slate-900 truncate">${title}</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 w-64">
            <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs mr-2"></i>
            <input type="text" placeholder="搜索目标 / 任务 / 项目" class="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400" />
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-600">
            <span class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">刘</span>
            <span class="hidden sm:inline">刘强 · 装卸队负责人</span>
          </div>
        </div>
      </header>`;
  }

  const root = document.getElementById("app-root");
  const main = document.getElementById("page-main");
  if (!root || !main) return;

  injectModalStyles();

  const shell = document.createElement("div");
  shell.className = "flex min-h-screen bg-slate-50";
  shell.innerHTML =
    buildSidebar() +
    `<div class="flex-1 flex flex-col min-w-0">${buildHeader()}<div class="flex-1 overflow-auto"><div class="max-w-7xl mx-auto px-6 py-6" id="__content_slot"></div></div></div>`;
  const slot = shell.querySelector("#__content_slot");
  while (main.firstChild) slot.appendChild(main.firstChild);
  root.appendChild(shell);
  main.remove();

  document.querySelectorAll("[data-modal]").forEach((m) => {
    document.body.appendChild(m);
  });
  enhanceAllModals();

  window.BMS = {
    toast(msg, type) {
      const el = document.createElement("div");
      el.className =
        "fixed top-5 right-5 z-[100] px-4 py-3 rounded-xl text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition opacity-0 " +
        (type === "error" ? "bg-red-500" : type === "warn" ? "bg-amber-500" : "bg-emerald-500");
      el.textContent = msg;
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.remove("opacity-0"));
      setTimeout(() => {
        el.classList.add("opacity-0");
        setTimeout(() => el.remove(), 250);
      }, 2200);
    },
    openModal(id) {
      const m = document.getElementById(id);
      if (!m) return;
      enhanceModal(m);
      setModalFullscreen(m, false);
      m.classList.remove("hidden");
      m.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    },
    closeModal(id) {
      const m = document.getElementById(id);
      if (!m) return;
      setModalFullscreen(m, false);
      m.classList.add("hidden");
      m.classList.remove("flex");
      const anyOpen = Array.from(document.querySelectorAll("[data-modal]")).some(
        (el) => !el.classList.contains("hidden") && el.classList.contains("flex")
      );
      if (!anyOpen) document.body.classList.remove("overflow-hidden");
    },
    toggleModalFullscreen(id) {
      const m = document.getElementById(id);
      if (!m) return;
      setModalFullscreen(m, !m.classList.contains("bms-modal-fs"));
    },
  };

  const params = new URLSearchParams(location.search);
  const openId = params.get("open");
  if (openId) {
    setTimeout(() => window.BMS.openModal(openId), 50);
  }

  (function loadAiAssistant() {
    const ref = document.querySelector('script[src*="common.js"]');
    const src = ref ? ref.src.replace(/common\.js(\?.*)?$/, "ai-assistant.js") : "../assets/ai-assistant.js";
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  })();
})();
