/* 经营 AI 助手 · v1.0.0 原型（全局悬浮 · 仅复制 · 全功能演示） */
(function () {
  if (!window.BMS) return;

  const FEATURES = [
    { id: "F1", name: "自然语言问数", chip: "装卸队需关注目标有哪些？" },
    { id: "F2", name: "经营总览解读", chip: "解读本页经营总览", pages: ["dashboard"] },
    { id: "F3", name: "工作周报草稿", chip: "生成本周工作周报草稿", pages: ["reports"] },
    { id: "F4", name: "进展说明帮写", chip: "帮我写任务进展说明", pages: ["my-tasks", "supervise"] },
    { id: "F5", name: "较上期变化解读", chip: "为什么需关注目标较上期多了？" },
    { id: "F6", name: "风险与督办建议", chip: "本周最该催办谁？", pages: ["dashboard", "supervise", "reminders"] },
    { id: "F7", name: "目标拆解建议", chip: "年目标如何拆季/月？", pages: ["goals"] },
    { id: "F8", name: "计划节点建议", chip: "建议关键节点清单", pages: ["plans"] },
    { id: "F9", name: "任务描述生成", chip: "生成任务说明与验收标准", pages: ["my-tasks"] },
    { id: "F10", name: "操作指引", chip: "如何创建月目标？" },
    { id: "F11", name: "跨对象关联检索", chip: "桥吊专项有哪些滞后任务？" },
    { id: "F12", name: "合同回款解读", chip: "商务部合同回款情况怎样？", pages: ["contracts", "receipts", "dashboard"] },
    { id: "F13", name: "催填话术生成", chip: "生成周报催填提醒语", pages: ["reminders"] },
    { id: "F14", name: "评论摘要", chip: "摘要任务评论时间线", pages: ["my-tasks", "supervise"] },
    { id: "F15", name: "多轮追问下钻", chip: "继续追问并下钻详情" },
  ];

  const MOCK = {
    F1: "根据您权限范围内数据（装卸队 · 2026-W34）：\n\n**需关注目标 2 项**\n1. 8 月装卸效率提升（健康：需关注）— 量化达成 82/100 箱/小时\n2. Q3 桥吊完好率（健康：风险）— 节点 2/4 滞后\n\n**滞后任务 3 条**：桥吊夜班流程复盘、岸桥对位训练等。\n\n> 数据来源：目标列表、任务清单 · 2026-08-26",
    F2: "**经营总览 AI 解读（期间 · 截止 08-26）**\n\n**结构特征**\n1. 本港以**粮食散货**为主，集装箱约占总吞吐量 **2%**。\n2. 开累吞吐量 2,118 万吨；开累营收 4,120 万（经营登记口径）。\n\n**量钱与应收**\n3. 货种排行首位为粮食；客户以中粮储运、中谷物流为主。\n4. **客户应收排行（谁欠得多）**：中谷物流 420 万、远洋货运 395 万、中粮储运 280 万。\n5. 开累回款率 58%，应收压力需关注。\n\n**行动**\n6. 催收优先挂接工作台督办。\n\n⚠️ 辅助参考，不构成考核依据。",
    F3: "**2026-W34 工作周报草稿（装卸队视角）**\n\n## 一、目标完成情况\n- 8 月装卸效率提升：量化达成 82/100，健康「需关注」，较上周无变化。\n- 堆场周转优化：健康「正常」，节点 3/4 按期。\n\n## 二、计划进展\n- 8 月装卸效率提升计划：节点 2/4 按期，下一节点 08-25 效率复核。\n- 夜班协同保障计划：任务概况 进行中 4 / 已完成 2 / 滞后 1。\n\n## 三、本周任务执行\n- 本周期更新 14/18 条；滞后 3 条（桥吊夜班流程复盘等）。\n\n## 四、下周任务计划\n- 效率复核材料整理（刘强）\n- 对位训练第二轮排班（马超）\n- 季度点检节点冲刺（周杰）\n\n## 五、需协调事项\n- 桥吊点检专项需设备部配合窗口期。\n\n---\n请核对后复制至汇报系统或文档。",
    F4: "**进展说明（草案 · 请复制后自行粘贴）**\n\n本周期完成桥吊夜班装卸流程复盘初稿，组织 2 次班组讨论并整理 5 条优化建议；与调度中心对接夜班交接清单，已确认 3 项可落地措施。下周计划完成现场试运行并收集效率数据。\n\n**阻塞说明**：设备部点检窗口尚未排期，可能影响试运行时间，需协调。\n\n> 基于任务历史与评论生成，请补充真实数据后使用。",
    F5: "**较上期变化解读（2026-W34 vs W33）**\n\n需关注目标 +1 的原因：\n- 设备部「Q3 桥吊完好率」由「正常」降为「风险」，因关键节点「季度点检完成」逾期 3 天。\n- 装卸队目标数未增，但健康分布中「需关注」占比上升。\n\n节点变化：本周到期节点 +1，其中 1 个由上周顺延。\n\n填报率 +5%：催填后装卸队已填 +3 人。",
    F6: "**督办优先级建议（本周）**\n\n| 优先级 | 对象 | 事项 | 建议动作 |\n| P0 | 马超 | 岸桥对位训练 · 已延期 | 今日催填 + 督办 |\n| P0 | 刘强 | 桥吊夜班流程复盘 · 未填 | 汇报提醒一键催填 |\n| P1 | 设备部 · 王工 | 桥吊点检节点逾期 | 任务督办升级 |\n| P2 | 陈敏 | 堆场调度协同 · 临期 | 周会跟进 |\n\n可跳转：任务督办 / 汇报提醒。",
    F7: "**目标拆解建议（示例：2026 年装卸效率提升）**\n\n**年目标**：全港集装箱装卸效率达到 100 箱/小时（量化指标）。\n\n**建议季目标（Q3）**\n- 单桥效率 ≥ 92 箱/小时\n- 夜班作业等待时间下降 10%\n\n**建议月目标（8 月）**\n- 完成流程复盘与 2 项优化落地\n- 量化当前值：82 箱/小时\n\n采纳后请人工创建目标，系统不会自动写入。",
    F8: "**计划关键节点建议**\n\n关联目标：8 月装卸效率提升\n\n| 序号 | 节点名称 | 建议日期 |\n| 1 | 流程复盘完成 | 08-10 |\n| 2 | 优化措施试点 | 08-18 |\n| 3 | 效率数据复核 | 08-25 |\n| 4 | 月度总结 | 08-31 |\n\n请按实际排期调整后人工录入。",
    F9: "**任务说明草案**\n\n**任务名称**：桥吊夜班流程复盘\n\n**任务说明**：梳理夜班装卸交接与桥吊调度流程，识别等待时间与重复沟通环节，输出不少于 5 条可执行优化建议。\n\n**验收标准**：提交复盘报告；完成 1 次班组宣贯；至少 2 条措施进入试点。\n\n**预期产出**：流程复盘文档、优化清单。",
    F10: "**如何创建月目标？**\n\n1. 进入 **目标管理** → 点击「新建目标」。\n2. 周期类型选 **月**，上级必须选择已存在的 **季目标**（禁止年直接拆月）。\n3. 填写名称、介绍、截止时间、量化指标与目标值。\n4. 保存后可在 **计划管理** 挂计划、在 **任务清单** 拆任务。\n\n改状态须填写变更原因。",
    F11: "**跨对象检索：桥吊效能提升专项**\n\n目标 → 计划 → 任务链路：\n- 目标：Q3 桥吊完好率 ≥ 98%\n- 计划：Q3 桥吊点检专项计划（节点 2/4）\n- **滞后任务 2 条**：\n  1. 桥吊季度点检执行（王工 · 已延期）\n  2. 点检报告归档（李芳 · 未填）\n\n[原型：可下钻任务详情]",
    F12: "**合同回款解读（商务部）**\n\n- 合同总数 12 份，合同总额 3680 万\n- 累计回款 2145 万，**回款率 58%**\n- 剩余收款 **1535 万**\n- 本年计划收款进度：约 62%\n\n**需关注**：2 笔大额合同 Q3 回款节点临近，建议财务与商务联合跟进。\n\n> 仅解读系统登记数据，不做财务核算。",
    F13: "**催填提醒语（可复制发送）**\n\n【经营管理】您好，2026-W34 周报尚未提交。请在本周末前进入「任务清单」填写本周期进展说明。如有阻塞请在填报中注明。感谢配合！\n\n—— 装卸队 · 经营管理系统",
    F14: "**任务评论摘要（桥吊夜班流程复盘）**\n\n1. 08-22 刘强：初稿已完成，待班组二轮讨论。\n2. 08-24 调度中心陈敏：交接清单字段已确认，可对接。\n3. 08-25 王工：点检窗口最早 09-02，可能影响试运行。\n\n共 6 条评论，以上为 3 条要点。",
    F15: "您可以继续追问，例如：\n- 「马超那条任务详情是什么？」\n- 「设备部风险目标有哪些？」\n- 「帮我把上面草稿缩短成 3 条 bullet」\n\n我将基于当前对话上下文回答，并在回答中标注数据来源。",
  };

  const FOLLOWUP = {
    马超: "**马超 · 岸桥对位训练**\n\n- 状态：已延期\n- 计划：8 月装卸效率提升计划\n- 本周期：未填周报\n- 进展摘要：—\n\n建议：优先催填进展，并在任务督办中标记跟进。",
    设备部: "**设备部风险目标**\n\n1. Q3 桥吊完好率（风险）— 节点 2/4 滞后\n2. 设备点检专项计划 — 2 条任务逾期\n\n可跳转部门工作台或任务督办进一步查看。",
    缩短: "**工作汇报精简版（3 条）**\n\n1. 装卸效率 82/100，健康需关注；堆场周转正常。\n2. 计划节点 2/4 按期，滞后任务 3 条。\n3. 填报率 71%，未填 8 人；桥吊点检需设备部协调。",
  };

  let open = false;
  let messages = [];
  const pageId = document.body.getAttribute("data-page") || "";

  function injectStyles() {
    if (document.getElementById("bms-ai-style")) return;
    const style = document.createElement("style");
    style.id = "bms-ai-style";
    style.textContent = `
      #bms-ai-fab {
        position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 90;
        width: 3.5rem; height: 3.5rem; border-radius: 9999px;
        background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
        color: #fff; box-shadow: 0 8px 24px rgba(15,118,110,.35);
        display: flex; align-items: center; justify-content: center;
        border: none; cursor: pointer; transition: transform .2s, box-shadow .2s;
      }
      #bms-ai-fab:hover { transform: scale(1.05); box-shadow: 0 12px 32px rgba(15,118,110,.4); }
      #bms-ai-panel {
        position: fixed; right: 0; top: 0; bottom: 0; z-index: 95;
        width: min(420px, 100vw); background: #fff;
        box-shadow: -8px 0 32px rgba(0,0,0,.12);
        transform: translateX(100%); transition: transform .28s ease;
        display: flex; flex-direction: column;
      }
      #bms-ai-panel.open { transform: translateX(0); }
      #bms-ai-backdrop {
        position: fixed; inset: 0; z-index: 94; background: rgba(15,23,42,.25);
        opacity: 0; pointer-events: none; transition: opacity .28s;
      }
      #bms-ai-backdrop.open { opacity: 1; pointer-events: auto; }
      .bms-ai-msg { max-width: 92%; }
      .bms-ai-msg.user { margin-left: auto; background: #0f766e; color: #fff; border-radius: 1rem 1rem .25rem 1rem; }
      .bms-ai-msg.bot { background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; border-radius: 1rem 1rem 1rem .25rem; }
      .bms-ai-msg pre { white-space: pre-wrap; font-family: inherit; font-size: .8125rem; line-height: 1.55; margin: 0; }
      .bms-ai-chip { font-size: 11px; padding: .35rem .65rem; border-radius: 9999px; border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; white-space: nowrap; }
      .bms-ai-chip:hover { border-color: #99f6e4; background: #f0fdfa; color: #0f766e; }
      .bms-ai-page-btn { font-size: 12px; padding: .35rem .75rem; border-radius: .75rem; border: 1px solid #99f6e4; background: #f0fdfa; color: #0f766e; cursor: pointer; }
      .bms-ai-page-btn:hover { background: #ccfbf1; }
      .bms-ai-copy { font-size: 11px; color: #0f766e; cursor: pointer; }
      .bms-ai-copy:hover { text-decoration: underline; }
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderMarkdownLite(text) {
    let h = escapeHtml(text);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/^## (.+)$/gm, '<div class="font-semibold text-slate-800 mt-2 mb-1">$1</div>');
    h = h.replace(/^- (.+)$/gm, '<div class="pl-1">· $1</div>');
    h = h.replace(/^> (.+)$/gm, '<div class="text-xs text-slate-400 mt-2 italic">$1</div>');
    return h;
  }

  function copyText(text) {
    const t = text.replace(/\*\*/g, "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => BMS.toast("已复制到剪贴板")).catch(() => fallbackCopy(t));
    } else fallbackCopy(t);
  }

  function fallbackCopy(t) {
    const ta = document.createElement("textarea");
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      BMS.toast("已复制到剪贴板");
    } catch (e) {
      BMS.toast("复制失败，请手动选择文本", "error");
    }
    ta.remove();
  }

  function resolveReply(input, featureId) {
    const q = input.trim();
    if (featureId && MOCK[featureId]) return { text: MOCK[featureId], fid: featureId };
    if (/马超|对位训练/.test(q)) return { text: FOLLOWUP["马超"], fid: "F15" };
    if (/设备部|风险目标/.test(q)) return { text: FOLLOWUP["设备部"], fid: "F15" };
    if (/缩短|精简|3条|三条/.test(q)) return { text: FOLLOWUP["缩短"], fid: "F15" };
    if (/月目标|创建.*目标/.test(q)) return { text: MOCK.F10, fid: "F10" };
    if (/需关注|装卸队/.test(q)) return { text: MOCK.F1, fid: "F1" };
    if (/汇报|草稿/.test(q)) return { text: MOCK.F3, fid: "F3" };
    if (/催|提醒语/.test(q)) return { text: MOCK.F13, fid: "F13" };
    if (/回款|合同/.test(q)) return { text: MOCK.F12, fid: "F12" };
    if (/桥吊|专项|滞后/.test(q)) return { text: MOCK.F11, fid: "F11" };
    if (/督办|催办/.test(q)) return { text: MOCK.F6, fid: "F6" };
    if (/进展|帮写/.test(q)) return { text: MOCK.F4, fid: "F4" };
    if (/解读|总览/.test(q)) return { text: MOCK.F2, fid: "F2" };
    if (/拆解|季.*月/.test(q)) return { text: MOCK.F7, fid: "F7" };
    if (/节点/.test(q)) return { text: MOCK.F8, fid: "F8" };
    if (/任务说明|验收/.test(q)) return { text: MOCK.F9, fid: "F9" };
    if (/评论|摘要/.test(q)) return { text: MOCK.F14, fid: "F14" };
    if (/较上期|变化/.test(q)) return { text: MOCK.F5, fid: "F5" };
    return {
      text: "我是**经营 AI 助手**，可帮您问数、写汇报、查风险、产品指引。\n\n试试快捷问题，或输入例如：\n- 装卸队需关注目标有哪些？\n- 生成本周工作周报草稿\n- 如何创建月目标？\n\n⚠️ 回答仅供参考；**不会自动写入表单**，请使用「复制」后自行粘贴。",
      fid: null,
    };
  }

  function appendMessage(role, text, meta) {
    messages.push({ role, text, meta });
    const box = document.getElementById("bms-ai-messages");
    if (!box) return;
    const wrap = document.createElement("div");
    wrap.className = "bms-ai-msg " + (role === "user" ? "user" : "bot") + " px-3 py-2.5 text-sm mb-3";
    if (role === "user") {
      wrap.textContent = text;
    } else {
      wrap.innerHTML =
        '<pre>' +
        renderMarkdownLite(text) +
        "</pre>" +
        (meta && meta.fid
          ? '<div class="mt-2 flex flex-wrap gap-2 items-center"><span class="text-[10px] text-slate-400">' +
            meta.fid +
            " · " +
            (FEATURES.find((f) => f.id === meta.fid) || {}).name +
            '</span><button type="button" class="bms-ai-copy ml-auto"><i class="fa-regular fa-copy mr-1"></i>复制</button></div>'
          : '<div class="mt-2"><button type="button" class="bms-ai-copy"><i class="fa-regular fa-copy mr-1"></i>复制</button></div>');
      const copyBtn = wrap.querySelector(".bms-ai-copy");
      if (copyBtn) copyBtn.addEventListener("click", () => copyText(text));
    }
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
  }

  function ask(input, featureId) {
    const q = (input || "").trim();
    if (!q) return;
    appendMessage("user", q);
    const inputEl = document.getElementById("bms-ai-input");
    if (inputEl) inputEl.value = "";
    setTimeout(() => {
      const reply = resolveReply(q, featureId);
      appendMessage("assistant", reply.text, { fid: reply.fid });
    }, 420);
  }

  function buildPanel() {
    injectStyles();
    const backdrop = document.createElement("div");
    backdrop.id = "bms-ai-backdrop";
    backdrop.addEventListener("click", () => toggle(false));

    const panel = document.createElement("div");
    panel.id = "bms-ai-panel";
    panel.innerHTML = `
      <div class="shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-teal-50 to-white">
        <div>
          <div class="font-semibold text-slate-900 flex items-center gap-2"><i class="fa-solid fa-wand-magic-sparkles text-teal-600"></i>经营 AI 助手</div>
          <div class="text-[11px] text-slate-500 mt-0.5">问经营 · 写汇报 · 查风险 · 仅复制不自动填入</div>
        </div>
        <button type="button" id="bms-ai-close" class="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="shrink-0 px-3 py-2 border-b border-slate-100 bg-slate-50">
        <div class="text-[10px] text-slate-400 mb-1.5">快捷能力（F1–F15 全量）</div>
        <div id="bms-ai-chips" class="flex gap-1.5 overflow-x-auto pb-1"></div>
      </div>
      <div id="bms-ai-messages" class="flex-1 overflow-y-auto px-4 py-4 bg-white"></div>
      <div class="shrink-0 px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div class="flex gap-2">
          <input id="bms-ai-input" type="text" placeholder="输入问题，或点上方快捷能力…" class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500" />
          <button type="button" id="bms-ai-send" class="shrink-0 bg-teal-700 hover:bg-teal-600 text-white rounded-xl px-4 text-sm">发送</button>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">数据权限跟随当前账号 · 辅助参考不构成考核依据</p>
      </div>
    `;

    const fab = document.createElement("button");
    fab.type = "button";
    fab.id = "bms-ai-fab";
    fab.title = "经营 AI 助手";
    fab.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-lg"></i><span id="bms-ai-badge" class="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-amber-500 text-[10px] font-medium flex items-center justify-center border-2 border-white">3</span>';

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(fab);

    fab.addEventListener("click", () => toggle(true));
    panel.querySelector("#bms-ai-close").addEventListener("click", () => toggle(false));
    panel.querySelector("#bms-ai-send").addEventListener("click", () => {
      ask(document.getElementById("bms-ai-input").value);
    });
    panel.querySelector("#bms-ai-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") ask(e.target.value);
    });

    const chips = panel.querySelector("#bms-ai-chips");
    FEATURES.forEach((f) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bms-ai-chip shrink-0";
      b.textContent = f.name;
      b.title = f.chip;
      b.addEventListener("click", () => ask(f.chip, f.id));
      chips.appendChild(b);
    });

    appendMessage(
      "assistant",
      "您好，我是**经营 AI 助手**。\n\n**本周主动提醒（3 项）**\n- 需关注目标较上周 +1\n- 未填周报 8 人\n- 滞后任务 3 条\n\n当前页面：**" +
        (document.body.getAttribute("data-title") || "系统") +
        "**\n\n支持 F1–F15 全部能力；生成内容请用「**复制**」后自行粘贴，**不会自动写入表单**。\n\n请问需要什么帮助？",
      {}
    );
  }

  function toggle(on) {
    open = on !== undefined ? on : !open;
    document.getElementById("bms-ai-panel").classList.toggle("open", open);
    document.getElementById("bms-ai-backdrop").classList.toggle("open", open);
    if (open) {
      setTimeout(() => document.getElementById("bms-ai-input")?.focus(), 280);
    }
  }

  function injectPageButtons() {
    const slot = document.querySelector("#__content_slot");
    if (!slot) return;
    const hooks = {
      dashboard: [
        { label: "AI 解读本页", fid: "F2", q: "解读本页经营总览" },
        { label: "督办建议", fid: "F6", q: "本周最该催办谁？" },
      ],
      reports: [
        { label: "生成周报草稿", fid: "F3", q: "生成本周工作周报草稿" },
        { label: "较上期解读", fid: "F5", q: "为什么需关注目标较上期多了？" },
      ],
      reminders: [{ label: "AI 生成提醒语", fid: "F13", q: "生成周报催填提醒语" }],
      goals: [{ label: "AI 建议拆解", fid: "F7", q: "年目标如何拆季/月？" }],
      plans: [{ label: "AI 建议节点", fid: "F8", q: "建议关键节点清单" }],
      "my-tasks": [{ label: "AI 问任务风险", fid: "F6", q: "本周最该催办谁？" }],
      supervise: [{ label: "AI 督办建议", fid: "F6", q: "本周最该催办谁？" }],
      contracts: [{ label: "AI 解读回款", fid: "F12", q: "合同回款情况怎样？" }],
      receipts: [{ label: "AI 解读回款", fid: "F12", q: "合同回款情况怎样？" }],
      depts: [{ label: "AI 解读工作台", fid: "F1", q: "本部门需关注目标有哪些？" }],
    };
    const items = hooks[pageId];
    if (!items || !items.length) return;
    const bar = document.createElement("div");
    bar.className = "flex flex-wrap gap-2 mb-4 items-center";
    bar.innerHTML =
      '<span class="text-xs text-slate-400"><i class="fa-solid fa-wand-magic-sparkles text-teal-600 mr-1"></i>经营 AI 助手</span>';
    items.forEach((it) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bms-ai-page-btn";
      btn.textContent = it.label;
      btn.addEventListener("click", () => {
        toggle(true);
        ask(it.q, it.fid);
      });
      bar.appendChild(btn);
    });
    slot.insertBefore(bar, slot.firstChild);
  }

  const INLINE_LABELS = {
    F4: "AI 帮写进展（复制）",
    F7: "AI 建议拆解（复制）",
    F8: "AI 建议节点（复制）",
    F9: "AI 生成说明（复制）",
    F14: "AI 摘要评论（复制）",
  };

  const INLINE_QUERIES = {
    F4: "帮我写任务进展说明",
    F7: "年目标如何拆季/月？",
    F8: "建议关键节点清单",
    F9: "生成任务说明与验收标准",
    F14: "摘要任务评论时间线",
  };

  function injectInlineFormButtons() {
    document.querySelectorAll("[data-ai-inline]").forEach((host) => {
      if (host.dataset.aiReady === "1") return;
      const action = host.getAttribute("data-ai-inline");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bms-ai-page-btn mt-1";
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles mr-1"></i>' + (INLINE_LABELS[action] || "AI 助手（复制）");
      btn.addEventListener("click", () => {
        toggle(true);
        ask(INLINE_QUERIES[action] || "请问需要什么帮助？", action);
      });
      host.appendChild(btn);
      host.dataset.aiReady = "1";
    });
  }

  buildPanel();
  injectPageButtons();

  window.BMS.AI = {
    open: () => toggle(true),
    close: () => toggle(false),
    ask,
    copy: copyText,
    run(featureId) {
      const f = FEATURES.find((x) => x.id === featureId);
      if (!f) return;
      toggle(true);
      ask(f.chip, f.id);
    },
    features: FEATURES,
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectInlineFormButtons();
  });
  injectInlineFormButtons();

  const obs = new MutationObserver(() => injectInlineFormButtons());
  obs.observe(document.body, { childList: true, subtree: true });
})();
