/* v4.0.0 PC 壳 · 四角色菜单（含计划管理员） */
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
          { id: "supervise", name: "任务督办", href: "任务督办_page.html", icon: "fa-clipboard-check" },
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
    计划管理员: [
      {
        group: "工作台",
        items: [
          { id: "plans", name: "计划总控", href: "计划管理_page.html", icon: "fa-sitemap" },
          { id: "mine", name: "任务总控", href: "任务管理_page.html", icon: "fa-list-check" },
        ],
      },
      {
        group: "联查（只读）",
        items: [
          { id: "companyPlan", name: "公司计划表", href: "经营总台账_page.html", icon: "fa-building-columns" },
          { id: "deptPlans", name: "部门计划表", href: "部门计划表_page.html", icon: "fa-diagram-project" },
          { id: "allTasks", name: "整体任务表", href: "整体计划_任务监督_page.html", icon: "fa-list" },
        ],
      },
      {
        group: "协同",
        items: [
          { id: "supervise", name: "任务督办", href: "任务督办_page.html", icon: "fa-clipboard-check" },
          { id: "todo", name: "我的待办", href: "工作台_待办_page.html", icon: "fa-inbox" },
        ],
      },
    ],
    部门长: [
      { group: "工作台", items: [{ id: "todo", name: "我的待办", href: "工作台_待办_page.html", icon: "fa-inbox" }] },
      {
        group: "本部门",
        items: [
          { id: "plans", name: "计划管理", href: "计划管理_page.html", icon: "fa-sitemap" },
          { id: "mine", name: "任务管理", href: "任务管理_page.html", icon: "fa-list-check" },
        ],
      },
      {
        group: "填报",
        items: [
          { id: "taskWeekReport", name: "任务周报", href: "任务周报_page.html", icon: "fa-calendar-week" },
          { id: "taskMonthReport", name: "任务月报", href: "任务月报_page.html", icon: "fa-calendar" },
          { id: "supervise", name: "任务督办", href: "任务督办_page.html", icon: "fa-clipboard-check" },
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

  /** 计划详情：公司计划 id 如 cp1；部门计划 id 如 a_p1（大弹窗，不跳页） */
  function resolvePlanKind(id) {
    if (!id) return null;
    if (typeof BMS4 !== "undefined") {
      if (BMS4.COMPANY_PLANS && BMS4.COMPANY_PLANS.some((c) => c.id === id)) return "company";
      if (BMS4.planById && BMS4.planById(id)) return "dept";
    }
    if (String(id).indexOf("cp") === 0) return "company";
    return "dept";
  }

  function escapeAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtmlLite(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** @deprecated 兼容旧调用；请用 openPlanDetail / planNameLink */
  function planDetailHref(id, kind) {
    if (!id) return "javascript:void(0)";
    const k = kind || resolvePlanKind(id) || "dept";
    return (
      "javascript:void(BMSUI.openPlanDetail('" +
      String(id).replace(/'/g, "\\'") +
      "','" +
      String(k).replace(/'/g, "\\'") +
      "'))"
    );
  }

  /**
   * 可点击计划名称 → 大弹窗详情
   * opts: { id, kind?, className?, title? }
   */
  function planNameLink(text, opts) {
    opts = opts || {};
    const id = opts.id;
    if (!id) return escapeHtmlLite(text == null ? "—" : text);
    const k = opts.kind || resolvePlanKind(id) || "dept";
    const cls =
      opts.className ||
      "plan-name-link text-teal-700 hover:underline cursor-pointer font-medium leading-snug";
    const title = opts.title != null ? opts.title : "查看计划详情";
    return (
      `<a href="javascript:void(0)" role="button" class="${cls}" title="${escapeAttr(title)}" ` +
      `data-plan-detail="${escapeAttr(id)}" data-plan-kind="${escapeAttr(k)}" ` +
      `onclick="event.preventDefault();event.stopPropagation();BMSUI.openPlanDetail(this.getAttribute('data-plan-detail'),this.getAttribute('data-plan-kind'))">` +
      `${escapeHtmlLite(text == null ? "—" : text)}</a>`
    );
  }

  function ensurePlanDetailModal() {
    let root = document.getElementById("bms4-plan-detail-modal");
    if (root) return root;
    root = document.createElement("div");
    root.id = "bms4-plan-detail-modal";
    root.className = "fixed inset-0 z-[90] hidden items-center justify-center p-3 sm:p-6";
    root.innerHTML = `
      <div class="absolute inset-0 bg-slate-900/45" data-plan-detail-close></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        <div class="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div class="min-w-0">
            <div class="text-[11px] text-slate-400" id="bms4-pd-bread"></div>
            <h3 class="text-lg font-semibold text-slate-900 leading-snug mt-0.5" id="bms4-pd-title">计划详情</h3>
            <p class="text-xs text-slate-500 mt-1" id="bms4-pd-sub"></p>
          </div>
          <button type="button" class="w-9 h-9 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 shrink-0" data-plan-detail-close title="关闭">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="px-5 py-2 border-b border-slate-50 flex flex-wrap gap-2 shrink-0" id="bms4-pd-actions"></div>
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4" id="bms4-pd-body"></div>
        <div class="px-5 py-3 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/80">
          <button type="button" class="text-sm px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600" data-plan-detail-close>关闭</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-plan-detail-close]")) closePlanDetail();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !root.classList.contains("hidden")) closePlanDetail();
    });
    return root;
  }

  function metaItem(label, val) {
    return `<div><div class="text-[11px] text-slate-400">${label}</div><div class="text-sm text-slate-800 mt-0.5">${val}</div></div>`;
  }

  function renderPlanDetailTasks(tasks) {
    const sorted = (tasks || []).slice().sort((a, b) => {
      const la = BMS4.isTaskOverdue(a) ? 2 : BMS4.isTaskNearDue(a) ? 1 : 0;
      const lb = BMS4.isTaskOverdue(b) ? 2 : BMS4.isTaskNearDue(b) ? 1 : 0;
      return lb - la;
    });
    const rows = sorted.length
      ? sorted
          .map((t) => {
            const u = BMS4.userById(t.ownerId);
            const flag = BMS4.isTaskOverdue(t) ? "延期" : BMS4.isTaskNearDue(t) ? "临期" : "";
            return `<tr class="border-t border-slate-100">
              <td class="px-3 py-2">${escapeHtmlLite(t.name)}${
                flag ? ` <span class="text-[11px] text-rose-600">[${flag}]</span>` : ""
              }</td>
              <td class="px-3 py-2 whitespace-nowrap">${u ? escapeHtmlLite(u.name) : "—"}</td>
              <td class="px-3 py-2">${statusBadge(t.status)}</td>
              <td class="px-3 py-2">${escapeHtmlLite(t.priority || "—")}</td>
              <td class="px-3 py-2 whitespace-nowrap">${escapeHtmlLite(t.deadline || t.endDate || "—")}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="5" class="px-3 py-8 text-center text-slate-400">暂无关联任务</td></tr>`;
    return `<div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-3 py-2 bg-slate-50 text-sm font-medium text-slate-800 flex justify-between">
        <span>关联任务</span><span class="text-xs text-slate-400 font-normal">共 ${sorted.length} 条</span>
      </div>
      <div class="overflow-auto max-h-56">
        <table class="w-full text-sm"><thead class="text-xs text-slate-500 bg-white sticky top-0">
          <tr><th class="px-3 py-2 text-left">任务</th><th class="px-3 py-2 text-left">处理人</th>
          <th class="px-3 py-2 text-left">状态</th><th class="px-3 py-2 text-left">优先级</th>
          <th class="px-3 py-2 text-left">截止</th></tr></thead>
          <tbody>${rows}</tbody></table>
      </div>
    </div>`;
  }

  function renderPlanDetailChildren(title, list) {
    const rows = list.length
      ? list
          .map((p) => {
            const owner = BMS4.userById(p.ownerId);
            const st = BMS4.resolvePlanStatus(p);
            return `<tr class="border-t border-slate-100">
              <td class="px-3 py-2">${planNameLink(p.name, { id: p.id, kind: "dept" })}</td>
              <td class="px-3 py-2 whitespace-nowrap">${escapeHtmlLite(p.dept || "—")}</td>
              <td class="px-3 py-2 whitespace-nowrap">${owner ? escapeHtmlLite(owner.name) : "—"}</td>
              <td class="px-3 py-2">${statusBadge(st)}</td>
              <td class="px-3 py-2 text-right tabular-nums">${BMS4.clampPct(p.progressPct)}%</td>
              <td class="px-3 py-2 text-xs text-slate-600 whitespace-nowrap">${escapeHtmlLite(p.startDate || "—")} ~ ${escapeHtmlLite(
                p.endDate || "—"
              )}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="6" class="px-3 py-8 text-center text-slate-400">暂无</td></tr>`;
    return `<div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-3 py-2 bg-slate-50 text-sm font-medium text-slate-800 flex justify-between">
        <span>${title}</span><span class="text-xs text-slate-400 font-normal">共 ${list.length} 条</span>
      </div>
      <div class="overflow-auto max-h-52">
        <table class="w-full text-sm"><thead class="text-xs text-slate-500 bg-white sticky top-0">
          <tr><th class="px-3 py-2 text-left">计划名称</th><th class="px-3 py-2 text-left">部门</th>
          <th class="px-3 py-2 text-left">责任人</th><th class="px-3 py-2 text-left">状态</th>
          <th class="px-3 py-2 text-right">进度</th><th class="px-3 py-2 text-left">起止</th></tr></thead>
          <tbody>${rows}</tbody></table>
      </div>
    </div>`;
  }

  function renderPlanChangeLogs(refId) {
    const logs =
      BMS4.getPlanChangeLogs && typeof BMS4.getPlanChangeLogs === "function"
        ? BMS4.getPlanChangeLogs(refId)
        : [];
    const body = logs.length
      ? logs
          .map((l, i) => {
            const isLast = i === logs.length - 1;
            return `<div class="flex gap-3">
              <div class="flex flex-col items-center shrink-0 w-3">
                <span class="w-2.5 h-2.5 rounded-full bg-teal-600 mt-1.5 ring-2 ring-teal-100"></span>
                ${isLast ? "" : '<span class="flex-1 w-px bg-slate-200 my-1"></span>'}
              </div>
              <div class="pb-4 min-w-0 flex-1 ${isLast ? "" : ""}">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <div class="text-sm text-slate-800">
                    <span class="font-medium">${escapeHtmlLite(l.field || "变更")}</span>
                    <span class="text-slate-400 mx-1">·</span>
                    <span class="text-slate-500">${escapeHtmlLite(l.from || "—")}</span>
                    <span class="text-slate-400 mx-1">→</span>
                    <span class="text-slate-800 font-medium">${escapeHtmlLite(l.to || "—")}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 whitespace-nowrap">${escapeHtmlLite(l.at || "")} · ${escapeHtmlLite(
              l.operator || "—"
            )}</div>
                </div>
                ${
                  l.note
                    ? `<div class="text-xs text-slate-500 mt-1 leading-relaxed">${escapeHtmlLite(l.note)}</div>`
                    : ""
                }
              </div>
            </div>`;
          })
          .join("")
      : `<div class="px-1 py-6 text-center text-sm text-slate-400">暂无关键节点变更记录</div>`;
    return `<div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-3 py-2 bg-slate-50 text-sm font-medium text-slate-800 flex justify-between items-center gap-2">
        <span>关键节点变更记录</span>
        <span class="text-xs text-slate-400 font-normal">共 ${logs.length} 条 · 只读</span>
      </div>
      <div class="px-4 pt-3 max-h-64 overflow-y-auto">${body}</div>
    </div>`;
  }

  function fillCompanyPlanDetail(cp) {
    const plans = BMS4.PLAN_ITEMS.filter((p) => p.companyPlanId === cp.id);
    const roots = plans.filter((p) => !p.parentId);
    const planIds = new Set(plans.map((p) => p.id));
    const tasks = BMS4.taskItems.filter((t) => planIds.has(t.annualId));
    const done = tasks.filter((t) => t.status === "已完成" || t.status === "已关闭").length;
    const pct = BMS4.clampPct(cp.progressPct);
    document.getElementById("bms4-pd-bread").textContent = "公司计划";
    document.getElementById("bms4-pd-title").textContent = cp.name;
    document.getElementById("bms4-pd-sub").textContent =
      "手填整体进度 " + pct + "% · 关联任务完成 " + done + "/" + tasks.length;
    document.getElementById("bms4-pd-actions").innerHTML = `
      <a href="部门计划表_page.html?cp=${encodeURIComponent(cp.id)}" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700">部门计划表</a>
      <a href="整体计划_任务监督_page.html?cp=${encodeURIComponent(cp.id)}&all=1" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700">整体任务表</a>`;
    document.getElementById("bms4-pd-body").innerHTML = `
      <div class="rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-medium text-slate-800 mb-3">基本信息</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${metaItem("类型", '<span class="inline-flex px-2 py-0.5 rounded text-xs border bg-sky-50 text-sky-700 border-sky-100">年度</span>')}
          ${metaItem("优先级", escapeHtmlLite(cp.priority || "—"))}
          ${metaItem("状态", statusBadge(cp.status || "—"))}
          ${metaItem("责任人", escapeHtmlLite(cp.owner || "—"))}
          ${metaItem("开始日", escapeHtmlLite(cp.startDate || "—"))}
          ${metaItem("结束日", escapeHtmlLite(cp.endDate || "—"))}
          ${metaItem("整体进度", `<span class="font-semibold tabular-nums">${pct}%</span>`)}
          ${metaItem("承接部门计划", roots.length + " 条一级 / 共 " + plans.length + " 条")}
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100">
          <div class="text-[11px] text-slate-400">进展说明</div>
          <div class="text-sm text-slate-800 mt-1 whitespace-pre-wrap leading-relaxed">${escapeHtmlLite(
            cp.progress || "—"
          )}</div>
        </div>
      </div>
      ${renderPlanDetailChildren("部门计划（一级）", roots)}
      ${renderPlanDetailTasks(tasks)}
      ${renderPlanChangeLogs(cp.id)}`;
  }

  function fillDeptPlanDetail(p) {
    const cp = BMS4.COMPANY_PLANS.find((c) => c.id === p.companyPlanId);
    const parent = p.parentId ? BMS4.planById(p.parentId) : null;
    const kids = BMS4.planChildren(p.id);
    const underIds = BMS4.planDescendantIds(p.id);
    const tasks = BMS4.taskItems.filter((t) => t.annualId === p.id || underIds.includes(t.annualId));
    const directTasks = BMS4.taskItems.filter((t) => t.annualId === p.id);
    const done = tasks.filter((t) => t.status === "已完成" || t.status === "已关闭").length;
    const owner = BMS4.userById(p.ownerId);
    const helpers = (p.helperIds || [])
      .map((id) => {
        const u = BMS4.userById(id);
        return u ? u.name : "";
      })
      .filter(Boolean);
    const st = BMS4.resolvePlanStatus(p);
    const pct = BMS4.clampPct(p.progressPct);
    const path = BMS4.planPathLabel(p.id) || p.name;
    document.getElementById("bms4-pd-bread").innerHTML =
      (cp
        ? planNameLink(cp.name, {
            id: cp.id,
            kind: "company",
            className: "text-teal-700 hover:underline",
          })
        : "公司计划") +
      (parent
        ? ' <span class="text-slate-300">/</span> ' +
          planNameLink(parent.name, {
            id: parent.id,
            kind: "dept",
            className: "text-teal-700 hover:underline",
          })
        : "") +
      ' <span class="text-slate-300">/</span> 当前';
    document.getElementById("bms4-pd-title").textContent = p.name;
    document.getElementById("bms4-pd-sub").textContent =
      (p.dept || "") + " · 路径 " + path + " · 任务完成 " + done + "/" + tasks.length;
    document.getElementById("bms4-pd-actions").innerHTML = `
      <a href="部门计划表_page.html?cp=${encodeURIComponent(p.companyPlanId || "")}&dept=${encodeURIComponent(
      p.dept || ""
    )}" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700">部门计划表</a>
      <a href="整体计划_任务监督_page.html?plan=${encodeURIComponent(p.id)}&all=1" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700">关联任务表</a>
      <a href="计划管理_page.html" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white">计划管理（编辑）</a>`;
    document.getElementById("bms4-pd-body").innerHTML = `
      <div class="rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-medium text-slate-800 mb-3">基本信息</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${metaItem("类型", '<span class="inline-flex px-2 py-0.5 rounded text-xs border bg-slate-50 text-slate-600 border-slate-200">部门计划</span>')}
          ${metaItem("归属公司计划", cp ? planNameLink(cp.name, { id: cp.id, kind: "company" }) : "—")}
          ${metaItem("上级计划", parent ? planNameLink(parent.name, { id: parent.id, kind: "dept" }) : "（一级）")}
          ${metaItem("部门", escapeHtmlLite(p.dept || "—"))}
          ${metaItem("优先级", escapeHtmlLite(p.priority || "—"))}
          ${metaItem("状态", statusBadge(st))}
          ${metaItem("责任人", owner ? escapeHtmlLite(owner.name) : "—")}
          ${metaItem("配合人", helpers.length ? escapeHtmlLite(helpers.join("、")) : "—")}
          ${metaItem("开始日", escapeHtmlLite(p.startDate || "—"))}
          ${metaItem("结束日", escapeHtmlLite(p.endDate || "—"))}
          ${metaItem("进度", `<span class="font-semibold tabular-nums">${pct}%</span>`)}
          ${metaItem("直属任务", directTasks.length + " 条（含下级共 " + tasks.length + "）")}
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100">
          <div class="text-[11px] text-slate-400">进展说明</div>
          <div class="text-sm text-slate-800 mt-1 whitespace-pre-wrap leading-relaxed">${escapeHtmlLite(
            p.progress || "—"
          )}</div>
        </div>
      </div>
      ${renderPlanDetailChildren("下级计划", kids)}
      ${renderPlanDetailTasks(tasks)}
      ${renderPlanChangeLogs(p.id)}`;
  }

  function openPlanDetail(id, kind) {
    if (!id || typeof BMS4 === "undefined") return;
    const root = ensurePlanDetailModal();
    let type = kind || resolvePlanKind(id);
    if (type === "company") {
      const cp = BMS4.COMPANY_PLANS.find((c) => c.id === id);
      if (!cp) {
        toast("未找到该公司计划", false);
        return;
      }
      fillCompanyPlanDetail(cp);
    } else {
      const p = BMS4.planById(id);
      if (!p) {
        const cp = BMS4.COMPANY_PLANS.find((c) => c.id === id);
        if (cp) fillCompanyPlanDetail(cp);
        else {
          toast("未找到该计划", false);
          return;
        }
      } else fillDeptPlanDetail(p);
    }
    root.classList.remove("hidden");
    root.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closePlanDetail() {
    const root = document.getElementById("bms4-plan-detail-modal");
    if (!root) return;
    root.classList.add("hidden");
    root.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function ensureTaskDetailModal() {
    let root = document.getElementById("bms4-task-detail-modal");
    if (root) return root;
    root = document.createElement("div");
    root.id = "bms4-task-detail-modal";
    root.className = "fixed inset-0 z-[90] hidden items-center justify-center p-3 sm:p-6";
    root.innerHTML = `
      <div class="absolute inset-0 bg-slate-900/45" data-task-detail-close></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        <div class="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div class="min-w-0">
            <div class="text-[11px] text-slate-400" id="bms4-td-bread"></div>
            <h3 class="text-lg font-semibold text-slate-900 leading-snug mt-0.5" id="bms4-td-title">任务详情</h3>
            <p class="text-xs text-slate-500 mt-1" id="bms4-td-sub"></p>
          </div>
          <button type="button" class="w-9 h-9 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 shrink-0" data-task-detail-close title="关闭">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="px-5 py-2 border-b border-slate-50 flex flex-wrap gap-2 shrink-0" id="bms4-td-actions"></div>
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4" id="bms4-td-body"></div>
        <div class="px-5 py-3 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/80">
          <button type="button" class="text-sm px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600" data-task-detail-close>关闭</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-task-detail-close]")) closeTaskDetail();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !root.classList.contains("hidden")) closeTaskDetail();
    });
    return root;
  }

  function taskMetaItem(label, val) {
    return `<div><div class="text-[11px] text-slate-400">${label}</div><div class="text-sm text-slate-800 mt-0.5">${val}</div></div>`;
  }

  function renderTaskOpLogsLite(taskId) {
    const logs =
      BMS4.getTaskChangeLogs && typeof BMS4.getTaskChangeLogs === "function"
        ? BMS4.getTaskChangeLogs(taskId)
        : [];
    const body = logs.length
      ? logs
          .map((l, i) => {
            const isLast = i === logs.length - 1;
            return `<div class="flex gap-3">
              <div class="flex flex-col items-center shrink-0 w-3">
                <span class="w-2.5 h-2.5 rounded-full bg-teal-600 mt-1.5 ring-2 ring-teal-100"></span>
                ${isLast ? "" : '<span class="flex-1 w-px bg-slate-200 my-1"></span>'}
              </div>
              <div class="pb-4 min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <div class="text-sm text-slate-800">
                    <span class="font-medium">${escapeHtmlLite(l.field || "变更")}</span>
                    <span class="text-slate-400 mx-1">·</span>
                    <span class="text-slate-500">${escapeHtmlLite(l.from || "—")}</span>
                    <span class="text-slate-400 mx-1">→</span>
                    <span class="text-slate-800 font-medium">${escapeHtmlLite(l.to || "—")}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 whitespace-nowrap">${escapeHtmlLite(l.at || "")} · ${escapeHtmlLite(
              l.operator || "—"
            )}</div>
                </div>
                ${
                  l.note
                    ? `<div class="text-xs text-slate-500 mt-1 leading-relaxed">${escapeHtmlLite(l.note)}</div>`
                    : ""
                }
              </div>
            </div>`;
          })
          .join("")
      : `<div class="px-1 py-6 text-center text-sm text-slate-400">暂无操作记录</div>`;
    return `<div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-3 py-2 bg-slate-50 text-sm font-medium text-slate-800 flex justify-between items-center gap-2">
        <span>操作记录</span>
        <span class="text-xs text-slate-400 font-normal">共 ${logs.length} 条 · 只读</span>
      </div>
      <div class="px-4 pt-3 max-h-64 overflow-y-auto">${body}</div>
    </div>`;
  }

  function fillTaskDetail(t, opts) {
    opts = opts || {};
    const isTemp = BMS4.isTempTask ? BMS4.isTempTask(t) : !t.annualId;
    const ou = BMS4.userById(t.ownerId);
    const plan = !isTemp && t.annualId ? BMS4.planById(t.annualId) : null;
    const parent = t.parentId ? BMS4.taskItems.find((x) => x.id === t.parentId) : null;
    const kids = BMS4.taskItems.filter((x) => x.parentId === t.id);
    const atts = Array.isArray(t.attachments) ? t.attachments : [];
    const hours = BMS4.taskWorkHours ? BMS4.taskWorkHours(t) : 0;
    document.getElementById("bms4-td-bread").textContent = isTemp ? "临时任务" : "关联计划任务";
    document.getElementById("bms4-td-title").textContent = t.name;
    document.getElementById("bms4-td-sub").textContent =
      (t.dept || "") + " · " + (ou ? ou.name : "—") + " · " + (t.status || "—");

    let actions = "";
    if (typeof opts.onEdit === "function") {
      actions += `<button type="button" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700" id="bms4-td-edit"><i class="fa-solid fa-pen mr-1"></i>编辑</button>`;
    } else {
      actions += `<a href="任务管理_page.html" class="text-sm px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-teal-700">去任务管理</a>`;
    }
    if (typeof opts.onDelete === "function") {
      actions += `<button type="button" class="text-sm px-3 py-1.5 rounded-xl border border-rose-100 bg-white text-rose-600" id="bms4-td-del"><i class="fa-regular fa-trash-can mr-1"></i>删除</button>`;
    }
    document.getElementById("bms4-td-actions").innerHTML = actions;

    document.getElementById("bms4-td-body").innerHTML = `
      <div class="rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-medium text-slate-800 mb-3">基本信息</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${taskMetaItem(
            "类别",
            isTemp
              ? '<span class="inline-flex px-2 py-0.5 rounded text-xs border bg-slate-50 text-slate-600 border-slate-200">临时</span>'
              : '<span class="inline-flex px-2 py-0.5 rounded text-xs border bg-slate-50 text-slate-600 border-slate-200">关联计划</span>'
          )}
          ${taskMetaItem(
            "关联计划",
            plan ? planNameLink(plan.name, { id: plan.id, kind: "dept" }) : "—"
          )}
          ${taskMetaItem("上级任务", parent ? escapeHtmlLite(parent.name) : "—")}
          ${taskMetaItem("任务类型", escapeHtmlLite(t.taskType || "其他"))}
          ${taskMetaItem("优先级", escapeHtmlLite(t.priority || "—"))}
          ${taskMetaItem("状态", statusBadge(t.status))}
          ${taskMetaItem("处理人", ou ? escapeHtmlLite(ou.name) : "—")}
          ${taskMetaItem("来源", escapeHtmlLite(t.source || "—"))}
          ${taskMetaItem("开始日", escapeHtmlLite((BMS4.taskStartDate && BMS4.taskStartDate(t)) || t.startDate || "—"))}
          ${taskMetaItem("结束日", escapeHtmlLite((BMS4.taskEndDate && BMS4.taskEndDate(t)) || t.endDate || t.deadline || "—"))}
          ${taskMetaItem("耗费工时", hours ? hours + "h" : "—")}
          ${taskMetaItem("创建时间", escapeHtmlLite(t.createdAt || "—"))}
          ${taskMetaItem("子任务", kids.length + " 条")}
          ${taskMetaItem("部门", escapeHtmlLite(t.dept || "—"))}
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-medium text-slate-800 mb-2">备注</div>
        <div class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">${escapeHtmlLite(t.remark || "—")}</div>
      </div>
      <div class="rounded-xl border border-slate-200 overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 text-sm font-medium text-slate-800 flex justify-between">
          <span>附件</span><span class="text-xs text-slate-400 font-normal">共 ${atts.length} 个 · 仅文件名</span>
        </div>
        <div class="px-4 py-3">
          ${
            atts.length
              ? `<ul class="space-y-2 text-sm text-slate-700">${atts
                  .map(
                    (a) =>
                      `<li class="flex items-center gap-2"><i class="fa-regular fa-file text-slate-400"></i><span>${escapeHtmlLite(
                        a.name || a
                      )}</span></li>`
                  )
                  .join("")}</ul>`
              : '<div class="text-sm text-slate-400 py-4 text-center">暂无附件</div>'
          }
        </div>
      </div>
      ${renderTaskOpLogsLite(t.id)}`;

    const editBtn = document.getElementById("bms4-td-edit");
    if (editBtn && typeof opts.onEdit === "function") {
      editBtn.onclick = () => {
        closeTaskDetail();
        opts.onEdit(t.id);
      };
    }
    const delBtn = document.getElementById("bms4-td-del");
    if (delBtn && typeof opts.onDelete === "function") {
      delBtn.onclick = () => opts.onDelete(t.id);
    }
  }

  /** 任务详情大弹窗；opts: { onEdit?, onDelete? } */
  function openTaskDetail(id, opts) {
    if (!id || typeof BMS4 === "undefined") return;
    const t = BMS4.taskItems.find((x) => x.id === id);
    if (!t) {
      toast("未找到该任务", false);
      return;
    }
    const root = ensureTaskDetailModal();
    fillTaskDetail(t, opts || {});
    root.classList.remove("hidden");
    root.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeTaskDetail() {
    const root = document.getElementById("bms4-task-detail-modal");
    if (!root) return;
    root.classList.add("hidden");
    root.classList.remove("flex");
    document.body.style.overflow = "";
  }

  /** 可点击任务名称 → 大弹窗详情 */
  function taskNameLink(text, opts) {
    opts = opts || {};
    const id = opts.id;
    if (!id) return escapeHtmlLite(text == null ? "—" : text);
    const cls =
      opts.className || "text-teal-700 hover:underline cursor-pointer font-medium leading-snug";
    const title = opts.title != null ? opts.title : "查看任务详情";
    return (
      `<a href="javascript:void(0)" role="button" class="${cls}" title="${escapeAttr(title)}" ` +
      `data-task-detail="${escapeAttr(id)}" ` +
      `onclick="event.preventDefault();event.stopPropagation();BMSUI.openTaskDetail(this.getAttribute('data-task-detail'))">` +
      `${escapeHtmlLite(text == null ? "—" : text)}</a>`
    );
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
              <button type="button" id="btnResetDemo" class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700 hover:border-teal-200 bg-white" title="清除本机演示改动，恢复初始种子数据">恢复演示种子</button>
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
    const btnReset = document.getElementById("btnResetDemo");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (!confirm("确认恢复演示种子？本机已编辑的演示数据将被清除。")) return;
        if (BMS4.resetDemoData) BMS4.resetDemoData();
        toast("已恢复演示种子");
        setTimeout(() => location.reload(), 400);
      });
    }
  }

  window.BMSUI = {
    statusBadge,
    toast,
    openModal,
    closeModal,
    mount,
    resolvePlanKind,
    planDetailHref,
    planNameLink,
    openPlanDetail,
    closePlanDetail,
    taskNameLink,
    openTaskDetail,
    closeTaskDetail,
    escapeAttr,
    escapeHtml: escapeHtmlLite,
  };

  document.addEventListener("DOMContentLoaded", mount);
})();
