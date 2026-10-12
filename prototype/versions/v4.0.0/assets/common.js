/* v4.0.0 PC 壳 · 三角色菜单 */
(function () {
  const NAV = {
    总经理: [
      {
        group: "工作台",
        items: [{ id: "cockpit", name: "落实驾驶舱", href: "落实驾驶舱_page.html", icon: "fa-gauge-high" }],
      },
      {
        group: "经营主表",
        items: [
          { id: "companyPlan", name: "公司计划表", href: "经营总台账_page.html", icon: "fa-building-columns" },
          { id: "deptPlans", name: "部门计划表", href: "部门计划表_page.html", icon: "fa-diagram-project" },
          { id: "allTasks", name: "整体任务表", href: "整体计划_任务监督_page.html", icon: "fa-list" },
        ],
      },
      {
        group: "经营闭环",
        items: [
          { id: "taskWeekReport", name: "任务周报", href: "任务周报_page.html", icon: "fa-calendar-week" },
          { id: "taskMonthReport", name: "任务月报", href: "任务月报_page.html", icon: "fa-calendar" },
          { id: "appraisal", name: "绩效考核", href: "绩效考核_page.html", icon: "fa-ranking-star" },
          { id: "meeting", name: "周例会待办", href: "周例会待办_page.html", icon: "fa-handshake" },
        ],
      },
      {
        group: "更多（按需）",
        items: [
          { id: "unified", name: "经营一表（合成）", href: "经营一表_page.html", icon: "fa-table-columns" },
          { id: "plans", name: "计划管理", href: "计划管理_page.html", icon: "fa-sitemap" },
          { id: "macro", name: "数据分析", href: "宏观一表_page.html", icon: "fa-table" },
        ],
      },
    ],
    部门长: [
      { group: "工作台", items: [{ id: "todo", name: "我的待办", href: "工作台_待办_page.html", icon: "fa-inbox" }] },
      {
        group: "本部门",
        items: [
          { id: "dept", name: "部门台账", href: "部门台账_page.html", icon: "fa-building" },
          { id: "plans", name: "计划管理", href: "计划管理_page.html", icon: "fa-sitemap" },
          { id: "assign", name: "任务下达", href: "任务下达_page.html", icon: "fa-paper-plane" },
          { id: "mine", name: "任务管理", href: "任务管理_page.html", icon: "fa-list-check" },
        ],
      },
      {
        group: "填报",
        items: [
          { id: "taskWeekReport", name: "任务周报", href: "任务周报_page.html", icon: "fa-calendar-week" },
          { id: "taskMonthReport", name: "任务月报", href: "任务月报_page.html", icon: "fa-calendar" },
          { id: "meeting", name: "周例会待办", href: "周例会待办_page.html", icon: "fa-handshake" },
        ],
      },
    ],
    员工: [
      { group: "工作台", items: [{ id: "todo", name: "我的待办", href: "工作台_待办_page.html", icon: "fa-inbox" }] },
      {
        group: "执行",
        items: [
          { id: "plans", name: "计划管理", href: "计划管理_page.html", icon: "fa-sitemap" },
          { id: "mine", name: "任务管理", href: "任务管理_page.html", icon: "fa-list-check" },
        ],
      },
      {
        group: "查看",
        items: [
          { id: "taskWeekReport", name: "任务周报", href: "任务周报_page.html", icon: "fa-calendar-week" },
          { id: "taskMonthReport", name: "任务月报", href: "任务月报_page.html", icon: "fa-calendar" },
        ],
      },
    ],
  };

  const pageId = document.body.getAttribute("data-page") || "";
  const title = document.body.getAttribute("data-title") || "经营管理系统";

  function statusBadge(st) {
    const map = {
      正常: "bg-emerald-50 text-emerald-700 border-emerald-100",
      进行中: "bg-sky-50 text-sky-700 border-sky-100",
      关注: "bg-amber-50 text-amber-700 border-amber-100",
      临期: "bg-amber-50 text-amber-700 border-amber-100",
      延期: "bg-rose-50 text-rose-700 border-rose-100",
      逾期: "bg-rose-50 text-rose-700 border-rose-100",
      已完成: "bg-emerald-50 text-emerald-700 border-emerald-100",
      已关闭: "bg-slate-100 text-slate-500 border-slate-200",
      未开始: "bg-slate-50 text-slate-500 border-slate-200",
      待办: "bg-violet-50 text-violet-700 border-violet-100",
      待回复: "bg-rose-50 text-rose-700 border-rose-100",
      已回复: "bg-amber-50 text-amber-700 border-amber-100",
      已闭环: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    const cls = map[st] || "bg-slate-50 text-slate-600 border-slate-200";
    return `<span class="inline-flex px-2 py-0.5 rounded-full text-xs border ${cls}">${st}</span>`;
  }

  function toast(msg, ok) {
    let el = document.getElementById("bms4-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "bms4-toast";
      el.className =
        "fixed top-4 right-4 z-[100] hidden px-4 py-3 rounded-xl text-sm text-white shadow-lg";
      document.body.appendChild(el);
    }
    el.style.background = ok === false ? "#ef4444" : "#0f766e";
    el.textContent = msg;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 2200);
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("hidden");
    m.classList.add("flex");
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("hidden");
    m.classList.remove("flex");
  }

  function mount() {
    const user = BMS4.getRoleUser();
    const nav = NAV[user.role] || NAV["员工"];
    const main = document.getElementById("page-main");
    const root = document.getElementById("app-root");
    if (!root || !main) return;

    let navHtml = "";
    nav.forEach((g) => {
      navHtml += `<div class="px-4 pt-4 pb-1 text-[11px] uppercase tracking-wider text-slate-500">${g.group}</div>`;
      g.items.forEach((it) => {
        const active = it.id === pageId;
        navHtml += `<a href="${it.href}" class="mx-2 mb-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
          active ? "bg-teal-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }"><i class="fa-solid ${it.icon} w-4 text-center opacity-80"></i><span>${it.name}</span></a>`;
      });
    });

    const opts = BMS4.USERS.map(
      (u) =>
        `<option value="${u.id}" ${u.id === user.id ? "selected" : ""}>${u.role} · ${u.name}（${u.dept}）</option>`
    ).join("");

    root.innerHTML = `
      <div class="min-h-screen flex bg-slate-50 text-slate-800">
        <aside class="w-60 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
          <div class="px-4 py-5 border-b border-slate-800">
            <div class="text-white font-semibold text-sm">经营管理系统</div>
            <div class="text-xs text-slate-400 mt-1">v4.0.0 · PC 原型</div>
          </div>
          <nav class="flex-1 overflow-y-auto pb-4">${navHtml}</nav>
          <a href="../index.html" class="mx-3 mb-4 text-xs text-slate-400 hover:text-white px-2 py-2">返回版本入口</a>
        </aside>
        <div class="flex-1 min-w-0 flex flex-col">
          <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4">
            <div class="text-sm font-medium text-slate-900">${title}</div>
            <div class="flex items-center gap-3">
              <label class="text-xs text-slate-500">视角切换</label>
              <select id="roleSwitch" class="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white max-w-xs">${opts}</select>
            </div>
          </header>
          <main class="flex-1 overflow-auto">
            <div class="max-w-7xl mx-auto px-6 py-6" id="shell-content"></div>
          </main>
        </div>
      </div>`;

    const shell = document.getElementById("shell-content");
    shell.appendChild(main);
    main.classList.remove("hidden");

    document.getElementById("roleSwitch").addEventListener("change", (e) => {
      BMS4.setRoleUser(e.target.value);
      location.reload();
    });
  }

  window.BMSUI = { statusBadge, toast, openModal, closeModal, mount };

  document.addEventListener("DOMContentLoaded", mount);
})();
