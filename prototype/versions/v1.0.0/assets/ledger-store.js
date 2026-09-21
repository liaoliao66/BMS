/* v1.0.0 经营清单共享数据（跨页面 localStorage 同步） */
(function (global) {
  const STORE_KEY = "bms_v100_ledger_v9";
  const ROLE_KEY = "bms_v100_role";
  const MSG_CFG_KEY = "bms_v100_msg_cfg_v1";
  const MSG_LOG_KEY = "bms_v100_msg_log_v1";
  const ORG_SCOPE_KEY = "bms_v100_org_scope_v1";

  /** 组织：部门 → 部门负责人（催办触达对象） */
  const ORG_HEADS = [
    { dept: "装卸队", name: "刘强", title: "部门负责人" },
    { dept: "设备部", name: "陈敏", title: "部门负责人" },
    { dept: "调度中心", name: "孙伟", title: "部门负责人" },
    { dept: "商务部", name: "王磊", title: "部门负责人" },
    { dept: "安全环保部", name: "赵安", title: "部门负责人" },
    { dept: "综合办公室", name: "李办", title: "部门负责人" }
  ];

  /** 使用范围默认：装卸/设备/调度/商务启用，其余关闭 */
  const DEFAULT_ORG_DEPTS = [
    { id: "d1", name: "装卸队", enabled: true, source: "基础平台", headcount: 32 },
    { id: "d2", name: "设备部", enabled: true, source: "基础平台", headcount: 18 },
    { id: "d3", name: "调度中心", enabled: true, source: "基础平台", headcount: 14 },
    { id: "d4", name: "商务部", enabled: true, source: "基础平台", headcount: 9 },
    { id: "d5", name: "安全环保部", enabled: false, source: "基础平台", headcount: 11 },
    { id: "d6", name: "综合办公室", enabled: false, source: "基础平台", headcount: 7 }
  ];

  const DEFAULT_MSG_CFG = {
    weekOn: true,
    weekDay: "5",
    weekTime: "18:00",
    planOn: true,
    planScanTime: "09:00",
    /** 紧急程度临期提醒：距结束日剩余天数（可配，逗号分隔） */
    urgencyDays: { 高: "7,3,1", 中: "3,1", 低: "1" },
    tplWeek:
      "【任务催办】{姓名}，{部门} {周次} 任务尚未填写，请尽快在「任务管理」中完成填报。—— 经营管理系统",
    tplWeekManual:
      "【任务催办】{姓名}，请关注 {部门} {周次} 任务（紧急程度：{紧急程度}），请及时推进本周工作。—— 经营管理系统",
    tplPlan:
      "【计划临期催办】{姓名}，计划「{计划}」（紧急程度：{紧急程度}）将于 {结束日期} 结束，距结束还有 {剩余天数} 天，请及时跟进。—— 经营管理系统",
    tplPlanManual:
      "【计划催办】{姓名}，请关注计划「{计划}」（紧急程度：{紧急程度}，结束日期：{结束日期}，完成进度 {完成}%），请及时推进。—— 经营管理系统",
    tplGoalManual:
      "【目标催办】{姓名}，请关注目标「{目标}」（优先级：{优先级}，结束日期：{结束日期}，完成进度 {完成}%），请及时推进。—— 经营管理系统",
    freqOncePerDay: true
  };

  const DEFAULT = {
    uid: 100,
    goals: [
      {
        id: 1, name: "桥吊作业效率提升 15%", dept: "装卸队", year: "2026",
        endDate: "2026-12-31", status: "已延期", priority: "高",
        desc: "围绕夜班流程与对位训练提升效率。", pct: 62,
        delayed: true, delayReason: "设备窗口期压缩，夜班试点延期两周", responsibleDelay: true,
        delayLogs: [
          { id: 901, at: "2026-08-10 14:20", action: "标注延期", fromEnd: "2026-12-31", toEnd: "2026-12-31", reason: "设备窗口期压缩，夜班试点延期两周", responsibleDelay: true, operator: "刘强" }
        ]
      },
      { id: 2, name: "设备完好率 ≥ 98%", dept: "设备部", year: "2026", endDate: "2026-12-31", status: "正常", priority: "中", desc: "季度点检与隐患闭环。", pct: 75, delayed: false, delayReason: "", responsibleDelay: false, delayLogs: [] },
      { id: 3, name: "全年集装箱吞吐量目标", dept: "商务部", year: "2026", endDate: "2026-12-31", status: "正常", priority: "高", desc: "全年箱量经营目标。", pct: 48, delayed: false, delayReason: "", responsibleDelay: false, delayLogs: [] }
    ],
    plans: [
      {
        id: 1, name: "8 月装卸效率提升计划", goalId: 1, month: "2026-08",
        startDate: "2026-08-01", endDate: "2026-08-31",
        urgency: "高", status: "正常",
        desc: "落实夜班与班前会措施。", pct: 55,
        delayed: false, delayReason: "", responsibleDelay: false, delayLogs: [],
        nodes: [
          { id: 11, name: "夜班流程复盘完成", startDate: "2026-08-01", endDate: "2026-08-20", status: "已完成", delayReason: "", responsibleDelay: false, delayLogs: [] },
          {
            id: 12, name: "班前会模板宣贯", startDate: "2026-08-15", endDate: "2026-09-05", status: "已延期",
            delayReason: "两个班组未覆盖", responsibleDelay: true,
            delayLogs: [
              { id: 902, at: "2026-08-28 09:15", action: "标注延期", fromEnd: "2026-08-28", toEnd: "2026-09-05", reason: "两个班组未覆盖", responsibleDelay: true, operator: "刘强" }
            ]
          }
        ]
      },
      {
        id: 2, name: "Q3 桥吊点检专项计划", goalId: 2, month: "2026-08",
        startDate: "2026-08-01", endDate: "2026-08-31",
        urgency: "中", status: "正常",
        desc: "点检整改闭环。", pct: 70,
        delayed: false, delayReason: "", responsibleDelay: false, delayLogs: [],
        nodes: [{ id: 21, name: "钢丝绳整改闭环", startDate: "2026-08-10", endDate: "2026-08-25", status: "进行中", delayReason: "", responsibleDelay: false, delayLogs: [] }]
      },
      {
        id: 3, name: "堆场周转优化计划", goalId: 2, month: "2026-09",
        startDate: "2026-09-01", endDate: "2026-10-15",
        urgency: "低", status: "已延期",
        desc: "周转异常复盘。", pct: 30,
        delayed: true, delayReason: "跨部门协调会未召开", responsibleDelay: false,
        delayLogs: [
          { id: 903, at: "2026-09-12 16:40", action: "标注延期", fromEnd: "2026-09-30", toEnd: "2026-10-15", reason: "跨部门协调会未召开", responsibleDelay: false, operator: "陈敏" }
        ],
        nodes: []
      }
    ],
    weeks: [
      {
        id: 1, week: "2026-W33", dept: "装卸队", owner: "刘强", planIds: [1], urgency: "高",
        done: "完成夜班交接清单试运行，整理 5 条优化建议。",
        next: "推进班前会宣贯，准备效率复核材料。",
        planPcts: { 1: 50 }, goalPcts: { 1: 58 }
      },
      {
        id: 2, week: "2026-W34", dept: "装卸队", owner: "刘强", planIds: [1], urgency: "中",
        done: "全班组第一轮宣贯完成；对位训练排班待确认。",
        next: "对位训练第二轮排班并记录数据。",
        planPcts: { 1: 55 }, goalPcts: { 1: 62 }
      }
    ],
    supervises: [
      {
        id: 501, name: "夜班突发对位复盘", dept: "装卸队", owner: "刘强",
        urgency: "高", endDate: "2026-09-25", status: "正常",
        desc: "针对 9 月 18 日夜班对位超时，48 小时内完成复盘并提交措施。",
        delayed: false, delayReason: "", delayLogs: []
      },
      {
        id: 502, name: "桥吊钢丝绳隐患闭环", dept: "设备部", owner: "陈敏",
        urgency: "中", endDate: "2026-09-28", status: "已延期",
        desc: "完成钢丝绳隐患整改并回传验收照片。",
        delayed: true, delayReason: "备件到货晚于原计划",
        delayLogs: [
          { id: 910, at: "2026-09-18 16:10", action: "标注延期", fromEnd: "2026-09-22", toEnd: "2026-09-28", reason: "备件到货晚于原计划", operator: "陈敏" }
        ]
      }
    ]
  };

  function load() {
    try {
      let raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        const legacy = localStorage.getItem("bms_v100_ledger_v8");
        if (legacy) {
          raw = legacy;
          localStorage.setItem(STORE_KEY, legacy);
        }
      }
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT));
      const data = JSON.parse(raw);
      (data.goals || []).forEach((g) => {
        if (!g.priority) g.priority = "中";
      });
      (data.weeks || []).forEach((w) => {
        if (!w.owner) {
          const h = ORG_HEADS.find((x) => x.dept === w.dept);
          w.owner = h ? h.name : "";
        }
      });
      if (!Array.isArray(data.supervises)) {
        data.supervises = JSON.parse(JSON.stringify(DEFAULT.supervises));
      }
      return data;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT));
    }
  }

  function save(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  let state = load();

  const API = {
    getRole() {
      return localStorage.getItem(ROLE_KEY) || "dept_head";
    },
    setRole(role) {
      localStorage.setItem(ROLE_KEY, role);
    },
    isLeader() {
      return API.getRole() === "leader";
    },
    myDept() {
      return "装卸队";
    },
    nextId() {
      state.uid = (state.uid || 100) + 1;
      save(state);
      return state.uid;
    },
    goals() {
      return state.goals;
    },
    plans() {
      return state.plans;
    },
    weeks() {
      return state.weeks;
    },
    supervises() {
      if (!Array.isArray(state.supervises)) state.supervises = [];
      return state.supervises;
    },
    goalById(id) {
      return state.goals.find((g) => g.id === Number(id));
    },
    planById(id) {
      return state.plans.find((p) => p.id === Number(id));
    },
    weekById(id) {
      return state.weeks.find((w) => w.id === Number(id));
    },
    superviseById(id) {
      return API.supervises().find((s) => s.id === Number(id));
    },
    superviseStatus(s) {
      return API.planStatus(s);
    },
    plansByGoal(goalId) {
      const gid = Number(goalId);
      return state.plans.filter((p) => p.goalId === gid);
    },
    weeksByPlan(planId) {
      const pid = Number(planId);
      return state.weeks.filter((w) => (w.planIds || []).map(Number).includes(pid));
    },
    weeksByGoal(goalId) {
      const planIds = new Set(API.plansByGoal(goalId).map((p) => p.id));
      return state.weeks.filter((w) => (w.planIds || []).some((id) => planIds.has(Number(id))));
    },
    /** 计划展示状态：正常 / 已延期 / 已完成 */
    planStatus(p) {
      if (!p) return "正常";
      if (p.status === "已完成" || p.status === "已延期" || p.status === "正常") return p.status;
      if (p.delayed) return "已延期";
      if (Number(p.pct) >= 100) return "已完成";
      return "正常";
    },
    planStatusBadge(p) {
      const st = API.planStatus(p);
      if (st === "已完成") return '<span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">已完成</span>';
      if (st === "已延期") {
        const tipParts = [];
        if (p.responsibleDelay) tipParts.push("责任延期");
        if (p.delayReason) tipParts.push(p.delayReason);
        const tip = tipParts.length ? ` title="${String(tipParts.join(" · ")).replace(/"/g, "&quot;")}"` : "";
        return `<span class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600"${tip}>已延期</span>`;
      }
      return '<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">正常</span>';
    },
    /** 年目标状态：与计划一致 正常 / 已延期 / 已完成 */
    goalStatus(g) {
      if (!g) return "正常";
      if (g.status === "已完成" || g.status === "已延期" || g.status === "正常") return g.status;
      if (g.delayed) return "已延期";
      if (Number(g.pct) >= 100) return "已完成";
      return "正常";
    },
    goalStatusBadge(g) {
      return API.planStatusBadge(
        Object.assign({}, g, { status: API.goalStatus(g), delayed: API.goalStatus(g) === "已延期" })
      );
    },
    /** 业务状态（周任务可选计划）：正常≈进行中；已完成不可选 */
    planBizStatus(p) {
      const st = API.planStatus(p);
      if (st === "已完成") return "已完成";
      if (st === "已延期") return "已延期";
      return "进行中";
    },
    isPlanSelectable(p) {
      const st = API.planBizStatus(p);
      return st === "进行中" || st === "已延期";
    },
    /** ISO 周次 → 该周「周一」所在自然月，如 2026-W34 → 2026-08 */
    monthOfWeekByMonday(weekCode) {
      const m = String(weekCode || "").match(/^(\d{4})-W(\d{1,2})$/i);
      if (!m) return "";
      const year = Number(m[1]);
      const week = Number(m[2]);
      const jan4 = new Date(Date.UTC(year, 0, 4));
      const jan4Day = jan4.getUTCDay() || 7;
      const mondayW1 = new Date(jan4);
      mondayW1.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
      const monday = new Date(mondayW1);
      monday.setUTCDate(mondayW1.getUTCDate() + (week - 1) * 7);
      const y = monday.getUTCFullYear();
      const mo = String(monday.getUTCMonth() + 1).padStart(2, "0");
      return y + "-" + mo;
    },
    selectablePlansByDept(dept) {
      return state.plans.filter((p) => {
        const g = API.goalById(p.goalId);
        return g && g.dept === dept && API.isPlanSelectable(p);
      });
    },
    /** 默认：本周（周一）所在月 + 本部门 + 进行中/已延期 */
    defaultPlansForWeek(weekCode, dept) {
      const month = API.monthOfWeekByMonday(weekCode);
      if (!month) return [];
      return API.selectablePlansByDept(dept).filter((p) => p.month === month);
    },
    /** 解析 2026-W34 → 上一周次编码 */
    prevWeekCode(week) {
      const m = String(week || "").match(/^(\d{4})-W(\d{1,2})$/i);
      if (!m) return "";
      let y = Number(m[1]);
      let w = Number(m[2]) - 1;
      if (w < 1) {
        y -= 1;
        w = 52;
      }
      return y + "-W" + String(w).padStart(2, "0");
    },
    /** 同部门上一周「本周工作计划」(next) 作为本周「上周工作计划」 */
    prevWeekPlan(week, dept) {
      const code = API.prevWeekCode(week);
      if (!code) return "";
      const prev = state.weeks.find((x) => x.week === code && x.dept === dept);
      return prev && prev.next ? String(prev.next) : "";
    },
    persist() {
      save(state);
    },
    reset() {
      state = JSON.parse(JSON.stringify(DEFAULT));
      save(state);
    },
    delayBadge(delayed, reason) {
      if (!delayed) return '<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">正常</span>';
      const tip = reason ? ` title="${String(reason).replace(/"/g, "&quot;")}"` : "";
      return `<span class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600"${tip}>已延期</span>`;
    },
    operatorName() {
      return API.isLeader() ? "张港长" : "刘强";
    },
    nowStamp() {
      const d = new Date();
      const day = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      const tm = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      return day + " " + tm;
    },
    /** 向目标/计划/节点追加延期流水 */
    pushDelayLog(target, entry) {
      if (!target) return null;
      if (!Array.isArray(target.delayLogs)) target.delayLogs = [];
      const row = Object.assign(
        {
          id: API.nextId(),
          at: API.nowStamp(),
          action: "标注延期",
          reason: "",
          responsibleDelay: false,
          operator: API.operatorName(),
          fromEnd: "",
          toEnd: "",
          responsibleDelay: null
        },
        entry || {}
      );
      target.delayLogs.unshift(row);
      return row;
    },
    /** 计划详情用：计划自身 + 各节点延期记录（倒序） */
    collectPlanDelayLogs(plan) {
      if (!plan) return [];
      const rows = [];
      (plan.delayLogs || []).forEach((log) => {
        rows.push(Object.assign({ scope: "计划本身", scopeName: plan.name }, log));
      });
      (plan.nodes || []).forEach((n) => {
        (n.delayLogs || []).forEach((log) => {
          rows.push(Object.assign({ scope: "节点", scopeName: n.name }, log));
        });
      });
      rows.sort((a, b) => String(b.at).localeCompare(String(a.at)));
      return rows;
    },
    delayLogRowsHtml(logs, withScope) {
      if (!logs || !logs.length) {
        return '<tr><td colspan="' + (withScope ? 7 : 6) + '" class="px-4 py-8 text-center text-slate-400">暂无延期记录</td></tr>';
      }
      return logs
        .map((log) => {
          const resp =
            log.action && String(log.action).indexOf("取消") >= 0
              ? "—"
              : log.responsibleDelay == null
                ? "—"
                : log.responsibleDelay
                  ? "是"
                  : "否";
          const endChange =
            log.fromEnd || log.toEnd
              ? (log.fromEnd || "—") + " → " + (log.toEnd || "—")
              : "—";
          const scopeTd = withScope
            ? `<td class="px-4 py-2.5 text-slate-600 whitespace-nowrap">${log.scope || "—"} · ${String(log.scopeName || "").replace(/</g, "&lt;")}</td>`
            : "";
          return `<tr class="border-t row-hover">
            <td class="px-4 py-2.5 text-slate-500 whitespace-nowrap">${log.at || "—"}</td>
            ${scopeTd}
            <td class="px-4 py-2.5">${log.action || "—"}</td>
            <td class="px-4 py-2.5">${resp}</td>
            <td class="px-4 py-2.5 text-slate-600">${endChange}</td>
            <td class="px-4 py-2.5 text-slate-700 max-w-[220px]">${String(log.reason || "—").replace(/</g, "&lt;")}</td>
            <td class="px-4 py-2.5 text-slate-500">${log.operator || "—"}</td>
          </tr>`;
        })
        .join("");
    },
    /** 紧急程度：高 / 中 / 低（无默认，须手选） */
    urgencyLevels() {
      return ["高", "中", "低"];
    },
    urgencyBadge(level) {
      const v = String(level || "").trim();
      if (v === "高") return '<span class="text-xs px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100 shrink-0">高</span>';
      if (v === "中") return '<span class="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">中</span>';
      if (v === "低") return '<span class="text-xs px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 shrink-0">低</span>';
      return '<span class="text-xs px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-dashed border-slate-200 shrink-0">未设</span>';
    },
    urgencySelectOptions(selected) {
      const cur = String(selected || "");
      const opts = ['<option value="">请选择</option>'].concat(
        API.urgencyLevels().map((lv) => `<option value="${lv}"${cur === lv ? " selected" : ""}>${lv}</option>`)
      );
      return opts.join("");
    },
    /** 节点状态：进行中 / 已完成 / 已延期（兼容旧 delayed 字段） */
    nodeStatus(n) {
      if (!n) return "进行中";
      if (n.status === "已完成" || n.status === "已延期" || n.status === "进行中") return n.status;
      if (n.delayed) return "已延期";
      return "进行中";
    },
    nodeStatusBadge(n) {
      const st = API.nodeStatus(n);
      if (st === "已完成") return '<span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">已完成</span>';
      if (st === "已延期") {
        const tipParts = [];
        if (n.responsibleDelay) tipParts.push("责任延期");
        if (n.delayReason) tipParts.push(n.delayReason);
        const tip = tipParts.length ? ` title="${String(tipParts.join(" · ")).replace(/"/g, "&quot;")}"` : "";
        return `<span class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600"${tip}>已延期</span>`;
      }
      return '<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">进行中</span>';
    },
    isNodeLocked(n) {
      const st = API.nodeStatus(n);
      return st === "已完成" || st === "已延期";
    },
    pctCell(n) {
      const v = Math.max(0, Math.min(100, Number(n) || 0));
      return `<div class="flex items-center gap-2 min-w-[100px]">
        <div class="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div class="h-full bg-teal-600 rounded-full" style="width:${v}%"></div></div>
        <span class="text-slate-700 w-10 text-right">${v}%</span>
      </div>`;
    },
    syncHeaderRole() {
      const label = document.getElementById("header-user-label");
      const avatar = document.querySelector("#header-user-slot span.w-8");
      const leader = API.isLeader();
      if (label) label.textContent = leader ? "张港长 · 公司领导" : "装卸队 · 部门负责人";
      if (avatar) avatar.textContent = leader ? "领" : "负";
      const sel = document.getElementById("roleSelect");
      if (sel) sel.value = API.getRole();
    },
    onRoleChange() {
      const sel = document.getElementById("roleSelect");
      if (sel) API.setRole(sel.value);
      API.syncHeaderRole();
      if (typeof window.renderPage === "function") window.renderPage();
      if (window.BMS) BMS.toast(API.isLeader() ? "已切换为公司领导（只读）" : "已切换为部门负责人");
    },
    filterBar(extraHtml) {
      const prevDept = document.getElementById("filterDept")?.value ?? "";
      const prevYear = document.getElementById("filterYear")?.value ?? "2026";
      const prevQ = document.getElementById("filterQ")?.value ?? "";
      const deptOpts = API.deptSelectOptionsHtml(prevDept, { includeAll: true });
      const y2026 = prevYear === "2025" ? "" : " selected";
      const y2025 = prevYear === "2025" ? " selected" : "";
      return `<div class="flex flex-wrap gap-2 mb-4 items-center">
      <select id="filterDept" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" onchange="renderPage()">
        ${deptOpts}
      </select>
      <select id="filterYear" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" onchange="renderPage()">
        <option value="2026"${y2026}>2026 年</option><option value="2025"${y2025}>2025 年</option>
      </select>
      <div class="relative flex-1 min-w-[180px] max-w-xs">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
        <input id="filterQ" type="search" class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm" placeholder="搜索名称" value="${String(prevQ).replace(/"/g, "&quot;")}" oninput="renderPage()" />
      </div>
      ${extraHtml || ""}
    </div>`;
    },
    matchQ(text) {
      const q = (document.getElementById("filterQ")?.value || "").trim().toLowerCase();
      if (!q) return true;
      return String(text || "").toLowerCase().includes(q);
    },
    deptFilter(dept) {
      const f = document.getElementById("filterDept")?.value || "";
      if (!f) return true;
      return dept === f;
    },
    yearFilter(year) {
      const f = document.getElementById("filterYear")?.value || "";
      if (!f) return true;
      return String(year) === f;
    },
    roleToolbar(primaryLabel, primaryFn) {
      const hideBtn = API.isLeader() ? "hidden" : "";
      return `<div class="flex flex-wrap gap-2 items-center">
        <label class="text-xs text-slate-500">演示角色</label>
        <select id="roleSelect" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" onchange="Ledger.onRoleChange()">
          <option value="dept_head">部门负责人（装卸队）</option>
          <option value="leader">公司领导</option>
        </select>
        <button type="button" id="btnPrimary" class="btn-cta text-white px-3 py-2 rounded-xl text-sm ${hideBtn}" onclick="${primaryFn}">
          <i class="fa-solid fa-plus mr-1"></i>${primaryLabel}
        </button>
      </div>`;
    },

    orgHeads() {
      const enabled = new Set(API.enabledDeptNames());
      return ORG_HEADS.filter((h) => enabled.has(h.dept));
    },
    headByDept(dept) {
      return ORG_HEADS.find((h) => h.dept === dept) || null;
    },
    /** 任务负责人：随部门自动指定为部门负责人 */
    ownerOfDept(dept) {
      const h = API.headByDept(dept);
      return h ? h.name : "";
    },
    getOrgDepts() {
      try {
        const raw = localStorage.getItem(ORG_SCOPE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_ORG_DEPTS));
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved) || !saved.length) return JSON.parse(JSON.stringify(DEFAULT_ORG_DEPTS));
        return saved;
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_ORG_DEPTS));
      }
    },
    saveOrgDepts(list) {
      localStorage.setItem(ORG_SCOPE_KEY, JSON.stringify(list || []));
      return list;
    },
    setDeptEnabled(deptId, enabled) {
      const list = API.getOrgDepts();
      const row = list.find((d) => d.id === deptId || d.name === deptId);
      if (!row) return null;
      row.enabled = !!enabled;
      API.saveOrgDepts(list);
      return row;
    },
    enabledDeptNames() {
      return API.getOrgDepts().filter((d) => d.enabled).map((d) => d.name);
    },
    isDeptEnabled(name) {
      const n = String(name || "");
      if (!n) return true;
      const row = API.getOrgDepts().find((d) => d.name === n);
      return row ? !!row.enabled : false;
    },
    deptSelectOptionsHtml(selected, opts) {
      const includeAll = !!(opts && opts.includeAll);
      const onlyEnabled = !(opts && opts.includeDisabled);
      const cur = String(selected || "");
      let depts = API.getOrgDepts();
      if (onlyEnabled) depts = depts.filter((d) => d.enabled);
      let html = includeAll ? '<option value="">全部部门</option>' : "";
      depts.forEach((d) => {
        const on = cur === d.name ? " selected" : "";
        const mark = d.enabled ? "" : "（未启用）";
        html += `<option value="${d.name}"${on}>${d.name}${mark}</option>`;
      });
      if (cur && !depts.some((d) => d.name === cur)) {
        html += `<option value="${cur}" selected>${cur}（未启用）</option>`;
      }
      return html;
    },
    fillDeptSelect(elOrId, selected, opts) {
      const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
      if (!el) return;
      const prev = selected != null ? selected : el.value;
      el.innerHTML = API.deptSelectOptionsHtml(prev, opts);
      if (prev) el.value = prev;
    },
    getMsgConfig() {
      try {
        const raw = localStorage.getItem(MSG_CFG_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_MSG_CFG));
        return Object.assign(JSON.parse(JSON.stringify(DEFAULT_MSG_CFG)), JSON.parse(raw), {
          urgencyDays: Object.assign(
            {},
            DEFAULT_MSG_CFG.urgencyDays,
            (JSON.parse(raw).urgencyDays || {})
          )
        });
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_MSG_CFG));
      }
    },
    saveMsgConfig(cfg) {
      const next = Object.assign({}, DEFAULT_MSG_CFG, cfg || {}, {
        urgencyDays: Object.assign({}, DEFAULT_MSG_CFG.urgencyDays, (cfg && cfg.urgencyDays) || {})
      });
      localStorage.setItem(MSG_CFG_KEY, JSON.stringify(next));
      return next;
    },
    msgLogs() {
      try {
        const raw = localStorage.getItem(MSG_LOG_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    clearMsgLogs() {
      localStorage.setItem(MSG_LOG_KEY, "[]");
    },
    /** 解析可配天数串 → 数字数组 */
    parseDayList(str) {
      return String(str || "")
        .split(/[,，\s]+/)
        .map((x) => Number(x.trim()))
        .filter((n) => !isNaN(n) && n >= 0);
    },
    /** YYYY-MM-DD → 自然周 ISO 周次 2026-W34 */
    isoWeekOfDate(dateStr) {
      const d = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
      if (isNaN(d.getTime())) return "";
      const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = tmp.getUTCDay() || 7;
      tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
      return tmp.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
    },
    daysUntil(endDate, todayStr) {
      const end = new Date(String(endDate) + "T12:00:00");
      const today = new Date((todayStr || API.todayStr()) + "T12:00:00");
      if (isNaN(end.getTime()) || isNaN(today.getTime())) return null;
      return Math.round((end - today) / 86400000);
    },
    todayStr() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },
    fillTpl(tpl, map) {
      return String(tpl || "").replace(/\{([^}]+)\}/g, (_, k) => (map[k] != null ? String(map[k]) : ""));
    },
    /** 扫描：自然周内部门无周工作任务 */
    scanWeekMissing(todayStr) {
      const cfg = API.getMsgConfig();
      if (!cfg.weekOn) return [];
      const week = API.isoWeekOfDate(todayStr || API.todayStr());
      if (!week) return [];
      const myDept = API.myDept();
      const leader = API.isLeader();
      const rows = [];
      API.orgHeads().forEach((h) => {
        if (!leader && h.dept !== myDept) return;
        const filled = state.weeks.some((w) => w.week === week && w.dept === h.dept);
        if (filled) return;
        rows.push({
          type: "week",
          key: "week:" + week + ":" + h.dept,
          week,
          dept: h.dept,
          owner: h.name,
          title: week + " · " + h.dept + " 任务未填",
          reason: "本自然周尚无任务记录"
        });
      });
      return rows;
    },
    /** 扫描：月计划按紧急程度临期（剩余天数命中配置） */
    scanPlanDue(todayStr) {
      const cfg = API.getMsgConfig();
      if (!cfg.planOn) return [];
      const day = todayStr || API.todayStr();
      const myDept = API.myDept();
      const leader = API.isLeader();
      const rows = [];
      state.plans.forEach((p) => {
        const g = API.goalById(p.goalId);
        if (!g) return;
        if (!API.isDeptEnabled(g.dept)) return;
        if (!leader && g.dept !== myDept) return;
        if (Number(p.pct) >= 100) return;
        if (API.planStatus(p) === "已完成") return;
        const left = API.daysUntil(p.endDate, day);
        if (left == null || left < 0) return;
        const urgency = p.urgency || "";
        const days = API.parseDayList((cfg.urgencyDays || {})[urgency]);
        if (!days.length || !days.includes(left)) return;
        const head = API.headByDept(g.dept);
        rows.push({
          type: "plan",
          key: "plan:" + p.id + ":" + day + ":" + left,
          planId: p.id,
          planName: p.name,
          dept: g.dept,
          owner: head ? head.name : "—",
          urgency,
          endDate: p.endDate,
          leftDays: left,
          title: p.name + " · 临期（剩 " + left + " 天）",
          reason: "紧急程度「" + (urgency || "未设") + "」命中临期日 " + left + " 天"
        });
      });
      return rows;
    },
    scanAllReminders(todayStr) {
      return API.scanWeekMissing(todayStr).concat(API.scanPlanDue(todayStr));
    },
    hasSentToday(freqKey, dayStr) {
      const day = dayStr || API.todayStr();
      return API.msgLogs().some((m) => m.freqKey === freqKey && String(m.at).slice(0, 10) === day);
    },
    /** 发送一条催办（原型：写消息流水 + Toast） */
    sendReminder(item, todayStr) {
      const cfg = API.getMsgConfig();
      const day = todayStr || API.todayStr();
      let freqKey = item.freqKey;
      if (!freqKey) {
        if (item.type === "week") freqKey = "week:" + item.week + ":" + item.dept;
        else if (item.type === "goal") freqKey = "goal:" + item.goalId;
        else freqKey = "plan:" + item.planId;
      }
      if (cfg.freqOncePerDay && API.hasSentToday(freqKey, day)) {
        return { ok: false, reason: "今日已催办过（频控）" };
      }
      let body = "";
      if (item.type === "week") {
        if (item.manual) {
          body = API.fillTpl(cfg.tplWeekManual || DEFAULT_MSG_CFG.tplWeekManual, {
            姓名: item.owner,
            部门: item.dept,
            周次: item.week,
            紧急程度: item.urgency || "未设"
          });
        } else {
          body = API.fillTpl(cfg.tplWeek, {
            姓名: item.owner,
            部门: item.dept,
            周次: item.week
          });
        }
      } else if (item.type === "goal") {
        body = API.fillTpl(cfg.tplGoalManual || DEFAULT_MSG_CFG.tplGoalManual, {
          姓名: item.owner,
          目标: item.goalName,
          优先级: item.priority || "未设",
          结束日期: item.endDate || "—",
          完成: item.pct != null ? item.pct : "—"
        });
      } else if (item.manual) {
        body = API.fillTpl(cfg.tplPlanManual || DEFAULT_MSG_CFG.tplPlanManual, {
          姓名: item.owner,
          计划: item.planName,
          紧急程度: item.urgency || "未设",
          结束日期: item.endDate || "—",
          完成: item.pct != null ? item.pct : "—"
        });
      } else {
        body = API.fillTpl(cfg.tplPlan, {
          姓名: item.owner,
          计划: item.planName,
          紧急程度: item.urgency || "未设",
          结束日期: item.endDate,
          剩余天数: item.leftDays
        });
      }
      const logs = API.msgLogs();
      logs.unshift({
        id: Date.now(),
        at: day + " " + (new Date().toTimeString().slice(0, 5)),
        channel: "企微个人消息",
        type: item.type,
        freqKey,
        to: item.owner + " · " + item.dept,
        title: item.title,
        body
      });
      localStorage.setItem(MSG_LOG_KEY, JSON.stringify(logs.slice(0, 100)));
      return { ok: true, body };
    },
    /** 计划手动催办 */
    urgePlan(planId) {
      const p = API.planById(planId);
      if (!p) return { ok: false, reason: "计划不存在" };
      const g = API.goalById(p.goalId);
      if (!g) return { ok: false, reason: "所属目标不存在" };
      if (!API.isDeptEnabled(g.dept)) return { ok: false, reason: "该部门未启用" };
      if (!API.isLeader() && g.dept !== API.myDept()) return { ok: false, reason: "仅可催办本部门" };
      if (Number(p.pct) >= 100 || API.planStatus(p) === "已完成") return { ok: false, reason: "已完成无需催办" };
      const head = API.headByDept(g.dept);
      const day = API.todayStr();
      const left = API.daysUntil(p.endDate, day);
      return API.sendReminder({
        type: "plan",
        manual: true,
        freqKey: "plan-manual:" + p.id,
        planId: p.id,
        planName: p.name,
        dept: g.dept,
        owner: head ? head.name : "—",
        urgency: p.urgency || "",
        endDate: p.endDate,
        leftDays: left != null ? left : "—",
        pct: p.pct,
        title: p.name + " · 手动催办",
        reason: "手动催办"
      }, day);
    },
    /** 目标手动催办 */
    urgeGoal(goalId) {
      const g = API.goalById(goalId);
      if (!g) return { ok: false, reason: "目标不存在" };
      if (!API.isDeptEnabled(g.dept)) return { ok: false, reason: "该部门未启用" };
      if (!API.isLeader() && g.dept !== API.myDept()) return { ok: false, reason: "仅可催办本部门" };
      if (Number(g.pct) >= 100 || API.goalStatus(g) === "已完成") return { ok: false, reason: "已完成无需催办" };
      const head = API.headByDept(g.dept);
      const day = API.todayStr();
      return API.sendReminder({
        type: "goal",
        manual: true,
        freqKey: "goal-manual:" + g.id,
        goalId: g.id,
        goalName: g.name,
        dept: g.dept,
        owner: head ? head.name : "—",
        priority: g.priority || "",
        endDate: g.endDate,
        pct: g.pct,
        title: g.name + " · 手动催办",
        reason: "手动催办"
      }, day);
    },
    /** 任务手动催办 */
    urgeWeek(weekId) {
      const w = API.weekById(weekId);
      if (!w) return { ok: false, reason: "任务不存在" };
      if (!API.isDeptEnabled(w.dept)) return { ok: false, reason: "该部门未启用" };
      if (!API.isLeader() && w.dept !== API.myDept()) return { ok: false, reason: "仅可催办本部门" };
      const owner = w.owner || API.ownerOfDept(w.dept);
      if (!owner) return { ok: false, reason: "未指定部门负责人" };
      const day = API.todayStr();
      return API.sendReminder({
        type: "week",
        manual: true,
        freqKey: "week-manual:" + w.id,
        weekId: w.id,
        week: w.week,
        dept: w.dept,
        owner,
        urgency: w.urgency || "",
        title: w.week + " · " + w.dept + " · 手动催办",
        reason: "手动催办"
      }, day);
    }
  };

  global.Ledger = API;
})(window);
