/* 经营管理系统 v1.0.0 · PC 公共壳（精简：经营清单） */
(function () {
  const NAV = [
    {
      group: "经营清单",
      items: [
        { id: "goals", name: "目标管理", href: "年度目标_page.html", icon: "fa-bullseye" },
        { id: "plans", name: "计划管理", href: "月度计划_page.html", icon: "fa-calendar-check" },
        { id: "weeks", name: "任务管理", href: "周工作任务_page.html", icon: "fa-list-check" },
        { id: "work-supervise", name: "工作督办", href: "任务督办_page.html", icon: "fa-clipboard-check" },
      ],
    },
    {
      group: "催办与配置",
      items: [
        { id: "remind", name: "催办提醒", href: "催办提醒_page.html", icon: "fa-bell" },
        { id: "cfg-scope", name: "使用范围", href: "基础配置_使用范围_page.html", icon: "fa-sitemap" },
        { id: "cfg-msg", name: "消息配置", href: "基础配置_消息配置_page.html", icon: "fa-sliders" },
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
        width: 100% !important; max-width: none !important; height: 100% !important; max-height: none !important;
        border-radius: 0 !important; margin: 0 !important;
      }
      .bms-fs-group { display: inline-flex !important; align-items: center; gap: 0.35rem; flex-shrink: 0; margin-left: auto; }
      .bms-fs-btn, .bms-close-btn {
        width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;
        color: #94a3b8; background: #fff; display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0; padding: 0; line-height: 1;
      }
      .bms-fs-btn:hover, .bms-close-btn:hover { color: #475569; background: #f8fafc; }
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
    const panel = getModalPanel(modal);
    if (!panel) return;
    modal.classList.toggle("bms-modal-fs", !!on);
    const btn = modal.querySelector(".bms-fs-btn");
    if (btn) btn.innerHTML = on ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>';
  }

  function enhanceModal(modal) {
    if (!modal || modal.dataset.bmsFsReady === "1") return;
    const panel = getModalPanel(modal);
    if (!panel) return;
    const header =
      panel.querySelector(".shrink-0.px-6.py-4") ||
      panel.querySelector(".border-b") ||
      panel.firstElementChild;
    if (!header) return;

    const closeBtn =
      header.querySelector('button[onclick*="closeModal"]') ||
      Array.from(header.querySelectorAll("button.w-9")).find((b) => b.querySelector(".fa-xmark, .fa-solid.fa-xmark")) ||
      null;

    let group = header.querySelector(":scope > .bms-fs-group") || header.querySelector(".bms-fs-group");
    if (!group) {
      group = document.createElement("div");
      group.className = "bms-fs-group";
    }
    // 始终挂到标题栏末尾，保证整组靠右
    header.appendChild(group);

    let fsBtn = group.querySelector(".bms-fs-btn");
    if (!fsBtn) {
      fsBtn = document.createElement("button");
      fsBtn.type = "button";
      fsBtn.className = "bms-fs-btn";
      fsBtn.title = "全屏";
      fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
      fsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setModalFullscreen(modal, !modal.classList.contains("bms-modal-fs"));
      });
      group.appendChild(fsBtn);
    } else {
      group.appendChild(fsBtn); // 保证全屏在关闭左侧
    }

    // 关闭固定最右侧：全屏 → 关闭
    if (closeBtn) {
      closeBtn.classList.add("bms-close-btn");
      group.appendChild(closeBtn);
    }

    modal.dataset.bmsFsReady = "1";
  }

  function enhanceAllModals() {
    document.querySelectorAll("[data-modal]").forEach(enhanceModal);
  }

  function buildSidebar() {
    let html = `<aside class="w-56 shrink-0 bg-slate-800 text-slate-200 min-h-screen flex flex-col">
      <div class="px-5 py-5 border-b border-slate-700">
        <div class="text-sm font-semibold text-white">经营管理系统</div>
        <div class="text-xs text-slate-400 mt-1">v1.0.0 · 精简清单</div>
      </div>
      <nav class="flex-1 overflow-y-auto py-3">`;
    NAV.forEach((g) => {
      html += `<div class="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wide text-slate-500">${g.group}</div>`;
      g.items.forEach((item) => {
        const on = pageId === item.id;
        html += `<a href="${item.href}" class="flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-xl text-sm ${
          on ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
        }"><i class="fa-solid ${item.icon} w-4 text-center opacity-80"></i>${item.name}</a>`;
      });
    });
    html += `</nav></aside>`;
    return html;
  }

  function buildHeader() {
    const prdHref = "../../../../docs/versions/v1.0.0/prd.html";
    return `
      <header class="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div class="flex items-center gap-3 min-w-0">
          <h1 class="text-base font-semibold text-slate-900 truncate">${title}</h1>
        </div>
        <div class="flex items-center gap-3">
          <a href="${prdHref}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-sm text-teal-800 hover:bg-teal-100" title="打开 V1 PRD">
            <i class="fa-solid fa-book-open"></i><span class="hidden sm:inline">PRD</span>
          </a>
          <div class="flex items-center gap-2 text-sm text-slate-600" id="header-user-slot">
            <span class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">负</span>
            <span class="hidden sm:inline" id="header-user-label">装卸队 · 部门负责人</span>
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
    currentUser: { name: "刘强", dept: "装卸队", role: "dept_head" },
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
  };
})();
