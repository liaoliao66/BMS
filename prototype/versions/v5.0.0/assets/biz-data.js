/* V5 经营贯通：客户 / 合同作业 / 营收派生 / 开票收款 / 超期
 * 口径：营收 = 作业量 × 合同计费；作业必须挂合同；改计费后重算。
 */
(function (global) {
  const KEYS = {
    customers: "bms_v5_customers_v1",
    workload: "bms_v5_workload_v1",
    revenue: "bms_v5_revenue_facts_v1",
    invoices: "bms_v5_invoices_v1",
    receipts: "bms_v5_receipts_v1",
    contracts: "bms_v5_contracts",
    billing: "bms_v5_contract_billing_v5",
  };

  const DEFAULT_CUSTOMERS = [
    { name: "宝钢股份有限公司", group: "战略钢厂" },
    { name: "中粮储运", group: "散货潜力" },
    { name: "中谷物流", group: "散货潜力" },
    { name: "远洋航运有限公司", group: "船东重点" },
    { name: "中远散运", group: "船东重点" },
    { name: "港联物流集团", group: "战略钢厂" },
    { name: "港机装备股份", group: "未分组" },
    { name: "粮港代理", group: "未分组" },
    { name: "海河储运", group: "未分组" },
    { name: "首钢集团有限公司", group: "战略钢厂" },
    { name: "中远海运散货运输有限公司", group: "船东重点" },
    { name: "东海集装箱代理", group: "未分组" },
  ];

  /** 货类 → 合同计费货种 */
  const CARGO_TO_BILL = { 散货: "散货", 件杂货: "件杂货", 集装箱: "集装箱" };

  /** 作业默认计入的费种（装卸为主；有堆存规则时按量另计可扩展） */
  const DEFAULT_FEE_FOR_VOLUME = "装卸费";

  const DEFAULT_WORKLOAD = [
    { id: "W1", date: "2026-08-05", cargo: "散货", kind: "粮食", customer: "中粮储运", contractCode: "HT-2026-0076", impTon: 18, expTon: 8, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W2", date: "2026-08-12", cargo: "散货", kind: "粮食", customer: "中谷物流", contractCode: "HT-2026-0076", impTon: 14, expTon: 6, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W3", date: "2026-08-12", cargo: "散货", kind: "粮食", customer: "中粮储运", contractCode: "HT-2026-0076", impTon: 12, expTon: 5, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W4", date: "2026-08-15", cargo: "件杂货", kind: "钢材", customer: "港联物流集团", contractCode: "HT-2026-0008", impTon: 4, expTon: 3, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W5", date: "2026-08-18", cargo: "集装箱", kind: "重箱", customer: "远洋航运有限公司", contractCode: "HT-2026-0012", impTon: 0, expTon: 0, impTeu: 800, expTeu: 500, impConv: 0.8, expConv: 0.5 },
    { id: "W6", date: "2026-08-20", cargo: "散货", kind: "煤炭", customer: "中远散运", contractCode: "HT-2026-0076", impTon: 10, expTon: 4, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W7", date: "2026-07-22", cargo: "散货", kind: "粮食", customer: "中谷物流", contractCode: "HT-2026-0076", impTon: 20, expTon: 9, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
    { id: "W8", date: "2026-09-03", cargo: "集装箱", kind: "重箱", customer: "海河储运", contractCode: "HT-2026-0012", impTon: 0, expTon: 0, impTeu: 400, expTeu: 200, impConv: 0.4, expConv: 0.2 },
    { id: "W9", date: "2026-08-08", cargo: "散货", kind: "粮食", customer: "港联物流集团", contractCode: "HT-2026-0008", impTon: 8, expTon: 2, impTeu: 0, expTeu: 0, impConv: 0, expConv: 0 },
  ];

  const DEFAULT_INVOICES = [
    { id: "1", date: "2026-08-01", no: "FP-2026-0088", contract: "HT-2026-0012", customer: "远洋航运有限公司", amount: 120, type: "增值税专用发票", status: "active" },
    { id: "2", date: "2026-07-18", no: "FP-2026-0075", contract: "HT-2026-0015", customer: "港机装备股份", amount: 100, type: "增值税专用发票", status: "active" },
    { id: "3", date: "2026-06-15", no: "FP-2026-0071", contract: "HT-2026-0012", customer: "远洋航运有限公司", amount: 300, type: "增值税专用发票", status: "active" },
    { id: "4", date: "2026-05-20", no: "FP-2026-0058", contract: "HT-2026-0008", customer: "港联物流集团", amount: 860, type: "增值税普通发票", status: "active" },
    { id: "5", date: "2026-04-10", no: "FP-2026-0042", contract: "HT-2026-0015", customer: "港机装备股份", amount: 50, type: "增值税专用发票", status: "void" },
    { id: "6", date: "2026-03-01", no: "FP-2026-0031", contract: "HT-2026-0076", customer: "宝钢股份有限公司", amount: 200, type: "增值税专用发票", status: "active" },
    { id: "7", date: "2026-02-12", no: "FP-2026-0020", contract: "HT-2026-0076", customer: "宝钢股份有限公司", amount: 120, type: "增值税专用发票", status: "active" },
  ];

  const DEFAULT_RECEIPTS = [
    { id: "R1", date: "2026-08-10", contract: "HT-2026-0012", invoiceNo: "FP-2026-0088", customer: "远洋航运有限公司", amount: 120, method: "银行转账", remark: "Q3 首期" },
    { id: "R2", date: "2026-07-05", contract: "HT-2026-0015", invoiceNo: "FP-2026-0062", customer: "港机装备股份", amount: 80, method: "银行转账", remark: "半年节点" },
    { id: "R3", date: "2026-06-20", contract: "HT-2026-0012", invoiceNo: "", customer: "远洋航运有限公司", amount: 200, method: "银行转账", remark: "预收款（未开票）" },
    { id: "R4", date: "2026-05-22", contract: "HT-2026-0008", invoiceNo: "FP-2026-0058", customer: "港联物流集团", amount: 860, method: "银行转账", remark: "全款结清" },
    { id: "R5", date: "2026-03-15", contract: "HT-2026-0076", invoiceNo: "FP-2026-0031", customer: "宝钢股份有限公司", amount: 150, method: "银行转账", remark: "一季度" },
    { id: "R6", date: "2026-02-20", contract: "HT-2026-0076", invoiceNo: "FP-2026-0020", customer: "宝钢股份有限公司", amount: 90, method: "银行转账", remark: "预收款" },
    { id: "R7", date: "2026-04-18", contract: "HT-2026-0015", invoiceNo: "FP-2026-0075", customer: "港机装备股份", amount: 70, method: "银行转账", remark: "节点回款" },
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return JSON.parse(JSON.stringify(fallback));
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }
  function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function uid(prefix) {
    return (prefix || "ID") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function parseYMD(s) {
    if (!s) return null;
    const p = String(s).split("-").map(Number);
    if (p.length < 3) return null;
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmtYMD(d) {
    if (!d || isNaN(d.getTime())) return "";
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function addDays(d, n) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }
  function endOfQuarter(d) {
    const q = Math.floor(d.getMonth() / 3);
    return new Date(d.getFullYear(), q * 3 + 3, 0);
  }

  /** 从付款条件抽出 N 天 */
  function daysFromTerms(terms) {
    const m = String(terms || "").match(/(\d+)\s*天/);
    return m ? Number(m[1]) : null;
  }

  /**
   * 应付日：按合同起算规则 + 锚点日（开票日优先，否则作业完成日）
   * 未约定 → null（不进超期）
   */
  function calcDueDate(contract, anchorDate) {
    const terms = contract.terms || "";
    if (terms === "未约定" || !terms) return null;
    const dueFrom = contract.dueFrom || "";
    const anchor = parseYMD(anchorDate) || parseYMD(contract.sign) || new Date();
    const n = daysFromTerms(terms);

    if (dueFrom.indexOf("自然月结") >= 0) {
      return fmtYMD(addDays(endOfMonth(anchor), n != null ? n : 0));
    }
    if (dueFrom.indexOf("季度") >= 0 || terms.indexOf("季度") >= 0) {
      return fmtYMD(endOfQuarter(anchor));
    }
    if (n == null) return null;
    return fmtYMD(addDays(anchor, n));
  }

  function rowQty(r) {
    if (r.cargo === "集装箱") return (Number(r.impTeu) || 0) + (Number(r.expTeu) || 0);
    return (Number(r.impTon) || 0) + (Number(r.expTon) || 0);
  }
  function rowTon(r) {
    if (r.cargo === "集装箱") return (Number(r.impConv) || 0) + (Number(r.expConv) || 0);
    return (Number(r.impTon) || 0) + (Number(r.expTon) || 0);
  }

  function getBillingMap() {
    return read(KEYS.billing, {});
  }
  function getContracts() {
    return read(KEYS.contracts, []);
  }

  function findBillingLine(contractCode, cargoClass, feeName) {
    const raw = getBillingMap()[contractCode];
    if (!raw || !raw.feeGroups) return null;
    const billCargo = CARGO_TO_BILL[cargoClass] || cargoClass;
    const g = raw.feeGroups.find((x) => x.feeName === feeName);
    if (!g) return null;
    return (g.lines || []).find((l) => l.cargoType === billCargo) || null;
  }

  function calcLineAmount(line, qty) {
    if (!line) return { amount: 0, unitPrice: 0 };
    if (global.BMSFeeConfig && typeof global.BMSFeeConfig.calcFee === "function") {
      const r = global.BMSFeeConfig.calcFee(line, qty);
      return { amount: r.amount || 0, unitPrice: line.basePrice || 0, detail: r.detail };
    }
    const unitPrice = Number(line.basePrice) || 0;
    return { amount: qty * unitPrice, unitPrice };
  }

  function buildFactFromWorkload(w, feeName) {
    const line = findBillingLine(w.contractCode, w.cargo, feeName);
    if (!line) {
      return {
        id: uid("RF"),
        workloadId: w.id,
        date: w.date,
        contractCode: w.contractCode,
        customer: w.customer,
        cargo: w.cargo,
        kind: w.kind,
        feeName,
        qty: rowQty(w),
        ton: rowTon(w),
        amount: 0,
        unitPrice: 0,
        status: "missing_rule",
        impShare: (Number(w.impTon) || 0) + (Number(w.impTeu) || 0) + (Number(w.impConv) || 0),
        expShare: (Number(w.expTon) || 0) + (Number(w.expTeu) || 0) + (Number(w.expConv) || 0),
      };
    }
    const qty = rowQty(w);
    const calc = calcLineAmount(line, qty);
    // 金额按万元展示用：单价元 × 量；散货量单位万吨时需 ×10000？演示约定：
    // 散货/件杂：登记为万吨，单价为元/吨 → 金额(元)=单价×万吨×10000；再存万元= /10000 → 即 单价×万吨
    // 集装箱：单价元/TEU，金额万元 = 单价×TEU/10000
    let amountWan;
    if (w.cargo === "集装箱") amountWan = calc.amount / 10000;
    else amountWan = calc.amount; // 演示：把「元/吨 × 万吨」直接当作「万元」口径，避免量级爆炸

    return {
      id: uid("RF"),
      workloadId: w.id,
      date: w.date,
      contractCode: w.contractCode,
      customer: w.customer,
      cargo: w.cargo,
      kind: w.kind,
      feeName,
      qty,
      ton: rowTon(w),
      amount: Math.round(amountWan * 100) / 100,
      unitPrice: line.basePrice,
      sourceId: line.sourceId || "",
      status: "ok",
      impTon: Number(w.impTon) || 0,
      expTon: Number(w.expTon) || 0,
      impTeu: Number(w.impTeu) || 0,
      expTeu: Number(w.expTeu) || 0,
    };
  }

  function recalcAllRevenue() {
    const list = read(KEYS.workload, DEFAULT_WORKLOAD);
    const facts = [];
    list.forEach((w) => {
      if (!w.contractCode) return;
      facts.push(buildFactFromWorkload(w, DEFAULT_FEE_FOR_VOLUME));
      // 若合同配置了堆存费且货类匹配，按同一作业量演示再记一笔（可选）
      const stg = findBillingLine(w.contractCode, w.cargo, "堆存费");
      if (stg && w.cargo !== "集装箱") {
        const f = buildFactFromWorkload(w, "堆存费");
        // 堆存演示：按吨·天简化为量×单价的 10%
        f.amount = Math.round(f.amount * 0.1 * 100) / 100;
        facts.push(f);
      }
    });
    write(KEYS.revenue, facts);
    syncContractMoneyFromLedger();
    return facts;
  }

  function recalcContractRevenue(contractCode) {
    const all = read(KEYS.workload, DEFAULT_WORKLOAD);
    const others = read(KEYS.revenue, []).filter((f) => f.contractCode !== contractCode);
    const mine = [];
    all.filter((w) => w.contractCode === contractCode).forEach((w) => {
      mine.push(buildFactFromWorkload(w, DEFAULT_FEE_FOR_VOLUME));
      const stg = findBillingLine(contractCode, w.cargo, "堆存费");
      if (stg && w.cargo !== "集装箱") {
        const f = buildFactFromWorkload(w, "堆存费");
        f.amount = Math.round(f.amount * 0.1 * 100) / 100;
        mine.push(f);
      }
    });
    write(KEYS.revenue, others.concat(mine));
    syncContractMoneyFromLedger();
    return mine;
  }

  function sumInvoice(contract) {
    return read(KEYS.invoices, DEFAULT_INVOICES)
      .filter((i) => i.contract === contract && i.status !== "void")
      .reduce((s, i) => s + (Number(i.amount) || 0), 0);
  }
  function sumReceipt(contract) {
    return read(KEYS.receipts, DEFAULT_RECEIPTS)
      .filter((r) => r.contract === contract)
      .reduce((s, r) => s + (Number(r.amount) || 0), 0);
  }
  function sumRevenue(contract) {
    return read(KEYS.revenue, [])
      .filter((f) => f.contractCode === contract && f.status === "ok")
      .reduce((s, f) => s + (Number(f.amount) || 0), 0);
  }

  function syncContractMoneyFromLedger() {
    const contracts = getContracts();
    if (!Array.isArray(contracts) || !contracts.length) return;
    let changed = false;
    contracts.forEach((c) => {
      const inv = sumInvoice(c.code);
      const rec = sumReceipt(c.code);
      if (c.invoice !== inv || c.receipt !== rec) {
        c.invoice = inv;
        c.receipt = rec;
        changed = true;
      }
    });
    if (changed) write(KEYS.contracts, contracts);
  }

  /** 超期明细：按合同开票锚点估算应付日 */
  function buildOverdueRows(asOf) {
    const asOfDate = parseYMD(asOf) || new Date(2026, 7, 26);
    const contracts = getContracts();
    const invoices = read(KEYS.invoices, DEFAULT_INVOICES).filter((i) => i.status !== "void");
    const receipts = read(KEYS.receipts, DEFAULT_RECEIPTS);
    const rows = [];

    contracts.forEach((c) => {
      if (!c.terms || c.terms === "未约定") return;
      const paid = sumReceipt(c.code);
      const invoiced = sumInvoice(c.code);
      const rev = sumRevenue(c.code);
      const recv = Math.max(0, Math.max(rev, invoiced) - paid);
      if (recv <= 0) return;

      const anchors = invoices.filter((i) => i.contract === c.code).map((i) => i.date).sort();
      const anchor = anchors[0] || c.sign;
      const due = calcDueDate(c, anchor);
      if (!due) return;
      const dueD = parseYMD(due);
      if (!dueD || dueD >= asOfDate) return;
      const days = Math.floor((asOfDate - dueD) / 86400000);
      rows.push({
        name: c.customer,
        contract: c.code,
        biz: (c.type || "业务") + " · " + c.code,
        terms: c.terms,
        due,
        days,
        amt: Math.round(recv * 100) / 100,
      });
    });
    return rows.sort((a, b) => b.amt - a.amt);
  }

  const DEFAULT_CONTRACTS_SEED = [
    { code: "HT-2026-0076", name: "宝钢铁矿铁水联运框架合同", type: "铁水联运框架", customer: "宝钢股份有限公司", terms: "月结 60 天", amount: 860, invoice: 0, receipt: 0, status: "执行中", sign: "2026-01-10", start: "2026-01-01", end: "2026-12-31", dept: "商务部", owner: "陈敏", dueFrom: "自然月结日", remark: "" },
    { code: "HT-2026-0012", name: "2026 年度集装箱装卸服务合同", type: "装卸服务", customer: "远洋航运有限公司", terms: "货到后 45 天", amount: 1200, invoice: 0, receipt: 0, status: "执行中", sign: "2026-01-15", start: "2026-01-01", end: "2026-12-31", dept: "商务部", owner: "陈敏", dueFrom: "货到 / 作业完成后 N 天", remark: "" },
    { code: "HT-2026-0008", name: "堆场仓储服务合同", type: "堆存", customer: "港联物流集团", terms: "月结 30 天", amount: 860, invoice: 0, receipt: 0, status: "已完成", sign: "2025-12-01", start: "2026-01-01", end: "2026-06-30", dept: "调度中心", owner: "刘强", dueFrom: "自然月结日", remark: "" },
    { code: "HT-2026-0015", name: "设备维保年度合同", type: "综合", customer: "港机装备股份", terms: "季度结算（季末）", amount: 420, invoice: 0, receipt: 0, status: "执行中", sign: "2026-02-01", start: "2026-01-01", end: "2026-12-31", dept: "设备部", owner: "周杰", dueFrom: "季度末", remark: "" },
  ];

  const DEFAULT_BILLING_SEED = {
    "HT-2026-0012": {
      feeGroups: [
        { feeName: "装卸费", lines: [
          { cargoType: "集装箱", sourceId: "CNTR_TEU", sourceName: "集装箱装卸 · 按 TEU", unitCode: "TEU", basePrice: 420, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
        ]},
      ],
    },
    "HT-2026-0076": {
      feeGroups: [
        { feeName: "装卸费", lines: [
          { cargoType: "散货", sourceId: "BULK_TON", sourceName: "散货装卸 · 按吨计价", unitCode: "TON", basePrice: 12, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
        ]},
        { feeName: "堆存费", lines: [
          { cargoType: "散货", sourceId: "STG_TON_DAY", sourceName: "堆存 · 吨·天超期", unitCode: "TON_DAY", basePrice: 0.8, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
        ]},
      ],
    },
    "HT-2026-0008": {
      feeGroups: [
        { feeName: "装卸费", lines: [
          { cargoType: "散货", sourceId: "BULK_TON", sourceName: "散货装卸 · 按吨计价", unitCode: "TON", basePrice: 12, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
          { cargoType: "件杂货", sourceId: "BULK_TON", sourceName: "散货装卸 · 按吨计价", unitCode: "TON", basePrice: 12, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
        ]},
        { feeName: "堆存费", lines: [
          { cargoType: "散货", sourceId: "STG_TON_DAY", sourceName: "堆存 · 吨·天超期", unitCode: "TON_DAY", basePrice: 0.8, priceMode: "单价×数量", tierEnabled: false, tiers: [], edited: false },
        ]},
      ],
    },
  };

  function ensureSeeded() {
    if (!localStorage.getItem(KEYS.customers)) write(KEYS.customers, DEFAULT_CUSTOMERS);
    if (!localStorage.getItem(KEYS.contracts)) write(KEYS.contracts, DEFAULT_CONTRACTS_SEED);
    if (!localStorage.getItem(KEYS.billing)) write(KEYS.billing, DEFAULT_BILLING_SEED);
    if (!localStorage.getItem(KEYS.workload)) write(KEYS.workload, DEFAULT_WORKLOAD);
    if (!localStorage.getItem(KEYS.invoices)) write(KEYS.invoices, DEFAULT_INVOICES);
    if (!localStorage.getItem(KEYS.receipts)) write(KEYS.receipts, DEFAULT_RECEIPTS);
    if (!localStorage.getItem(KEYS.revenue)) recalcAllRevenue();
    else syncContractMoneyFromLedger();
  }

  function overviewSnapshot(asOf) {
    ensureSeeded();
    const wl = read(KEYS.workload, DEFAULT_WORKLOAD);
    const facts = read(KEYS.revenue, []);
    const invoices = read(KEYS.invoices, DEFAULT_INVOICES);
    const receipts = read(KEYS.receipts, DEFAULT_RECEIPTS);
    const customers = read(KEYS.customers, DEFAULT_CUSTOMERS);

    let loose = 0, piece = 0, teu = 0, teuTon = 0;
    wl.forEach((w) => {
      if (w.cargo === "散货") loose += rowTon(w);
      else if (w.cargo === "件杂货") piece += rowTon(w);
      else if (w.cargo === "集装箱") {
        teu += rowQty(w);
        teuTon += rowTon(w);
      }
    });

    const revAll = facts.filter((f) => f.status === "ok").reduce((s, f) => s + f.amount, 0);
    const invoice = invoices.filter((i) => i.status !== "void").reduce((s, i) => s + i.amount, 0);
    const paid = receipts.reduce((s, r) => s + r.amount, 0);
    const overdueRows = buildOverdueRows(asOf || "2026-08-26");
    const overdue = overdueRows.reduce((s, r) => s + r.amt, 0);
    const recv = Math.max(0, revAll - paid);
    const notOverdue = Math.max(0, recv - overdue);

    const byCustomer = {};
    customers.forEach((c) => {
      byCustomer[c.name] = {
        name: c.name,
        group: c.group,
        vol: { loose: 0, piece: 0, teu: 0 },
        rev: 0,
        revAll: 0,
        invoice: 0,
        paid: 0,
        overdueDays: 0,
        overdueAmt: 0,
      };
    });
    wl.forEach((w) => {
      if (!byCustomer[w.customer]) {
        byCustomer[w.customer] = {
          name: w.customer, group: "未分组", vol: { loose: 0, piece: 0, teu: 0 },
          rev: 0, revAll: 0, invoice: 0, paid: 0, overdueDays: 0, overdueAmt: 0,
        };
      }
      const row = byCustomer[w.customer];
      if (w.cargo === "散货") row.vol.loose += rowTon(w);
      if (w.cargo === "件杂货") row.vol.piece += rowTon(w);
      if (w.cargo === "集装箱") row.vol.teu += rowQty(w);
    });
    facts.forEach((f) => {
      if (f.status !== "ok") return;
      if (!byCustomer[f.customer]) return;
      byCustomer[f.customer].rev += f.amount;
      byCustomer[f.customer].revAll += f.amount;
    });
    invoices.forEach((i) => {
      if (i.status === "void") return;
      if (byCustomer[i.customer]) byCustomer[i.customer].invoice += i.amount;
    });
    receipts.forEach((r) => {
      if (byCustomer[r.customer]) byCustomer[r.customer].paid += r.amount;
    });
    overdueRows.forEach((o) => {
      if (!byCustomer[o.name]) return;
      byCustomer[o.name].overdueAmt += o.amt;
      if (o.days > byCustomer[o.name].overdueDays) byCustomer[o.name].overdueDays = o.days;
    });

    const customerMoney = Object.keys(byCustomer).map((k) => {
      const r = byCustomer[k];
      r.recv = Math.max(0, r.revAll - r.paid);
      r.rev = Math.round(r.rev * 100) / 100;
      r.revAll = Math.round(r.revAll * 100) / 100;
      return r;
    }).filter((r) => r.revAll > 0 || r.vol.loose || r.vol.piece || r.vol.teu || r.invoice || r.paid);

    return {
      baseline: {
        loose: Math.round(loose * 10) / 10,
        piece: Math.round(piece * 10) / 10,
        teu: Math.round(teu * 10) / 10 / 10000, // 万 TEU 展示兼容原字段时由页面再乘
        teuRaw: teu,
        teuTonWan: Math.round(teuTon * 100) / 100,
        revAll: Math.round(revAll * 100) / 100,
        invoice: Math.round(invoice * 100) / 100,
        paid: Math.round(paid * 100) / 100,
        overdue: Math.round(overdue * 100) / 100,
        notOverdue: Math.round(notOverdue * 100) / 100,
        syncAt: asOf || "2026-08-26",
      },
      customerMoney,
      overdueRows,
      groupMap: customers.reduce((m, c) => { m[c.name] = c.group; return m; }, {}),
    };
  }

  global.BMSBizData = {
    KEYS,
    ensureSeeded,
    getCustomers() {
      ensureSeeded();
      return read(KEYS.customers, DEFAULT_CUSTOMERS);
    },
    customerNames() {
      return this.getCustomers().map((c) => c.name);
    },
    groupOf(name) {
      const c = this.getCustomers().find((x) => x.name === name);
      return c ? c.group : "未分组";
    },
    getWorkload() {
      ensureSeeded();
      return read(KEYS.workload, DEFAULT_WORKLOAD);
    },
    saveWorkload(list) {
      write(KEYS.workload, list);
      recalcAllRevenue();
    },
    getRevenueFacts() {
      ensureSeeded();
      return read(KEYS.revenue, []);
    },
    getInvoices() {
      ensureSeeded();
      return read(KEYS.invoices, DEFAULT_INVOICES);
    },
    saveInvoices(list) {
      write(KEYS.invoices, list);
      syncContractMoneyFromLedger();
    },
    getReceipts() {
      ensureSeeded();
      return read(KEYS.receipts, DEFAULT_RECEIPTS);
    },
    saveReceipts(list) {
      write(KEYS.receipts, list);
      syncContractMoneyFromLedger();
    },
    recalcAllRevenue,
    recalcContractRevenue,
    calcDueDate,
    buildOverdueRows,
    overviewSnapshot,
    findBillingLine,
    rowQty,
    rowTon,
    CARGO_TO_BILL,
    DEFAULT_FEE_FOR_VOLUME,
  };

  ensureSeeded();
})(window);
