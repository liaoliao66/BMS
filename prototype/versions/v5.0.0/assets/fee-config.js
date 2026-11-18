/* V5 计量单位 / 费用模块本地演示数据 */
(function (global) {
  const UNIT_KEY = "bms_v5_units";
  const FEE_KEY = "bms_v5_fee_modules_v2";

  const DEFAULT_UNITS = [
    { code: "TON", name: "吨", dim: "质量", decimals: 3, status: "启用" },
    { code: "TEU", name: "TEU", dim: "箱量", decimals: 0, status: "启用" },
    { code: "BOX", name: "自然箱", dim: "箱量", decimals: 0, status: "启用" },
    { code: "TON_DAY", name: "吨·天", dim: "时间积", decimals: 2, status: "启用" },
    { code: "TEU_DAY", name: "TEU·天", dim: "时间积", decimals: 2, status: "启用" },
    { code: "VESSEL", name: "艘次", dim: "次数", decimals: 0, status: "启用" },
    { code: "TRIP", name: "车次", dim: "次数", decimals: 0, status: "启用" },
    { code: "HOLD", name: "舱口", dim: "次数", decimals: 0, status: "启用" },
    { code: "DAY", name: "天", dim: "时间", decimals: 0, status: "启用" },
    { code: "HOUR", name: "小时", dim: "时间", decimals: 1, status: "启用" },
    { code: "CNY", name: "元", dim: "金额", decimals: 2, status: "启用" },
  ];

  function tierPrice(levels) {
    return levels.map((x, i) => ({
      level: i + 1,
      name: x.name,
      min: x.min,
      max: x.max,
      price: x.price,
      discount: x.discount != null ? x.discount : 100,
    }));
  }

  /** 散货计费模式（10 种）+ 其他货类常用模式 */
  const DEFAULT_FEES = [
    {
      id: "BULK_TON",
      name: "散货装卸 · 按吨计价",
      category: "装卸",
      cargoType: "散货",
      modeName: "按吨计价",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "分段累进",
      window: "合同期累计",
      basePrice: 12,
      tiers: tierPrice([
        { name: "基础档", min: 0, max: 50000, price: 12 },
        { name: "协议档", min: 50000, max: 100000, price: 11 },
        { name: "战略档", min: 100000, max: null, price: 10 },
      ]),
      status: "启用",
      remark: "最常用：按作业吨量计价，可配量阶梯",
    },
    {
      id: "BULK_VESSEL",
      name: "散货装卸 · 船次包干",
      category: "装卸",
      cargoType: "散货",
      modeName: "船次包干",
      unitCode: "VESSEL",
      priceMode: "固定包干",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 28000,
      tiers: [],
      status: "启用",
      remark: "整船一次包干，不论实际吨量",
    },
    {
      id: "BULK_DIRECT",
      name: "散货装卸 · 船边直取",
      category: "装卸",
      cargoType: "散货",
      modeName: "船边直取",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 9.5,
      tiers: [],
      status: "启用",
      remark: "船边直取不进堆场，单价通常低于进场装卸",
    },
    {
      id: "BULK_LIGHTER",
      name: "散货装卸 · 过驳作业",
      category: "装卸",
      cargoType: "散货",
      modeName: "过驳作业",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 15,
      tiers: tierPrice([
        { name: "常规过驳", min: 0, max: 20000, price: 15 },
        { name: "大批量过驳", min: 20000, max: null, price: 13.5 },
      ]),
      status: "启用",
      remark: "船↔船过驳按吨计",
    },
    {
      id: "BULK_SWEEP",
      name: "散货装卸 · 清舱作业",
      category: "装卸",
      cargoType: "散货",
      modeName: "清舱作业",
      unitCode: "HOLD",
      priceMode: "固定包干",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 3500,
      tiers: [],
      status: "启用",
      remark: "按舱口包干清舱",
    },
    {
      id: "BULK_SHIFT",
      name: "散货装卸 · 减载/加载",
      category: "装卸",
      cargoType: "散货",
      modeName: "减载/加载",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 8,
      tiers: [],
      status: "启用",
      remark: "减载或加载按吨加收",
    },
    {
      id: "BULK_NIGHT",
      name: "散货装卸 · 昼夜加价",
      category: "装卸",
      cargoType: "散货",
      modeName: "昼夜加价",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 2.5,
      tiers: [],
      status: "启用",
      remark: "夜班作业加价，可按吨或按小时；演示按吨",
    },
    {
      id: "BULK_HOLIDAY",
      name: "散货装卸 · 节假日加价",
      category: "装卸",
      cargoType: "散货",
      modeName: "节假日加价",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 3.5,
      tiers: [],
      status: "启用",
      remark: "法定节假日作业加价",
    },
    {
      id: "BULK_BAG",
      name: "散货装卸 · 灌包/拆包",
      category: "附加",
      cargoType: "散货",
      modeName: "灌包/拆包",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 18,
      tiers: [],
      status: "启用",
      remark: "灌包或拆包附加作业",
    },
    {
      id: "BULK_MIN",
      name: "散货装卸 · 最低消费保底",
      category: "装卸",
      cargoType: "散货",
      modeName: "最低消费保底",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 12,
      tiers: tierPrice([
        { name: "未达保底", min: 0, max: 30000, price: 14 },
        { name: "达保底后", min: 30000, max: null, price: 12 },
      ]),
      status: "启用",
      remark: "未达约定量适用较高单价或另行保底金额（演示用单价档）",
    },

    /* 集装箱 */
    {
      id: "CNTR_TEU",
      name: "集装箱装卸 · 按 TEU",
      category: "装卸",
      cargoType: "集装箱",
      modeName: "按 TEU",
      unitCode: "TEU",
      priceMode: "单价×数量",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "折扣",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 420,
      tiers: tierPrice([
        { name: "基础档", min: 0, max: 5000, price: 420, discount: 100 },
        { name: "协议档", min: 5000, max: 20000, price: 420, discount: 97 },
        { name: "战略档", min: 20000, max: null, price: 420, discount: 94 },
      ]),
      status: "启用",
      remark: "箱量达档改折扣",
    },
    {
      id: "CNTR_BOX",
      name: "集装箱装卸 · 按自然箱",
      category: "装卸",
      cargoType: "集装箱",
      modeName: "按自然箱",
      unitCode: "BOX",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 380,
      tiers: [],
      status: "启用",
      remark: "按自然箱一口价",
    },

    /* 堆存 */
    {
      id: "STG_TON_DAY",
      name: "堆存 · 吨·天超期",
      category: "堆存",
      cargoType: "散货",
      modeName: "吨·天超期",
      unitCode: "TON_DAY",
      priceMode: "免堆+超期",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "分段累进",
      window: "合同期累计",
      basePrice: 0.8,
      freeDays: 7,
      tiers: tierPrice([
        { name: "超期 1–7 天", min: 0, max: 7, price: 0.8 },
        { name: "超期 8–30 天", min: 7, max: 30, price: 1.2 },
        { name: "超期 31 天以上", min: 30, max: null, price: 2.0 },
      ]),
      status: "启用",
      remark: "免堆 7 天；超期按吨·天分段",
    },
    {
      id: "STG_TEU_DAY",
      name: "堆存 · TEU·天超期",
      category: "堆存",
      cargoType: "集装箱",
      modeName: "TEU·天超期",
      unitCode: "TEU_DAY",
      priceMode: "免堆+超期",
      tierEnabled: true,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "分段累进",
      window: "合同期累计",
      basePrice: 6,
      freeDays: 7,
      tiers: tierPrice([
        { name: "超期 1–7 天", min: 0, max: 7, price: 6 },
        { name: "超期 8–30 天", min: 7, max: 30, price: 9 },
        { name: "超期 31 天以上", min: 30, max: null, price: 15 },
      ]),
      status: "启用",
      remark: "集装箱堆存按 TEU·天",
    },

    /* 附加 / 联运 */
    {
      id: "FEE_WEIGH",
      name: "过磅费 · 按车次",
      category: "附加",
      cargoType: "通用",
      modeName: "按车次",
      unitCode: "TRIP",
      priceMode: "单价×数量",
      tierEnabled: false,
      trigger: "累计计费量",
      resultType: "单价",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 25,
      tiers: [],
      status: "启用",
      remark: "地磅按车次",
    },
    {
      id: "FEE_INTERMODAL",
      name: "铁水联运 · 换装按吨",
      category: "装卸",
      cargoType: "散货",
      modeName: "换装按吨",
      unitCode: "TON",
      priceMode: "单价×数量",
      tierEnabled: true,
      trigger: "累计金额",
      resultType: "折扣",
      algorithm: "全量落档",
      window: "合同期累计",
      basePrice: 18.5,
      tiers: tierPrice([
        { name: "基础档", min: 0, max: 3000000, price: 18.5, discount: 100 },
        { name: "协议档", min: 3000000, max: 8000000, price: 18.5, discount: 96 },
        { name: "战略档", min: 8000000, max: null, price: 18.5, discount: 92 },
      ]),
      status: "启用",
      remark: "累计金额达档改折扣",
    },
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

  function calcProgressive(qty, tiers, resultType, basePrice) {
    const sorted = (tiers || []).slice().sort((a, b) => a.min - b.min);
    if (!sorted.length) {
      return { amount: qty * basePrice, detail: [{ qty, price: basePrice, discount: 100, amount: qty * basePrice }] };
    }
    let remain = qty;
    let cursor = 0;
    const detail = [];
    for (let i = 0; i < sorted.length; i++) {
      const t = sorted[i];
      const upper = t.max == null ? Infinity : t.max;
      const span = Math.max(0, Math.min(remain, upper - Math.max(cursor, t.min)));
      if (span <= 0) continue;
      const price = resultType === "折扣" ? basePrice * ((t.discount || 100) / 100) : t.price;
      const amount = span * price;
      detail.push({ level: t.level, name: t.name, qty: span, price, discount: t.discount, amount });
      remain -= span;
      cursor = upper;
      if (remain <= 0) break;
    }
    if (remain > 0 && sorted.length) {
      const t = sorted[sorted.length - 1];
      const price = resultType === "折扣" ? basePrice * ((t.discount || 100) / 100) : t.price;
      detail.push({ level: t.level, name: t.name + "（余量）", qty: remain, price, discount: t.discount, amount: remain * price });
    }
    return { amount: detail.reduce((s, d) => s + d.amount, 0), detail };
  }

  function calcFullBand(qty, tiers, resultType, basePrice) {
    const sorted = (tiers || []).slice().sort((a, b) => a.min - b.min);
    let hit = sorted[0] || null;
    for (const t of sorted) {
      if (qty >= t.min && (t.max == null || qty < t.max)) hit = t;
    }
    if (!hit) {
      return { amount: qty * basePrice, detail: [{ qty, price: basePrice, discount: 100, amount: qty * basePrice }] };
    }
    const price = resultType === "折扣" ? basePrice * ((hit.discount || 100) / 100) : hit.price;
    return {
      amount: qty * price,
      detail: [{ level: hit.level, name: hit.name, qty, price, discount: hit.discount, amount: qty * price }],
    };
  }

  function uid() {
    return "CF_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  global.BMSFeeConfig = {
    getUnits() {
      return read(UNIT_KEY, DEFAULT_UNITS);
    },
    saveUnits(list) {
      write(UNIT_KEY, list);
    },
    resetUnits() {
      write(UNIT_KEY, DEFAULT_UNITS);
      return this.getUnits();
    },
    getFees() {
      return read(FEE_KEY, DEFAULT_FEES);
    },
    saveFees(list) {
      write(FEE_KEY, list);
    },
    resetFees() {
      write(FEE_KEY, DEFAULT_FEES);
      return this.getFees();
    },
    enabledFees() {
      return this.getFees().filter((f) => f.status === "启用");
    },
    unitName(code) {
      const u = this.getUnits().find((x) => x.code === code);
      return u ? u.name : code;
    },
    /** 引用模板 → 合同侧可改副本（不回写模板） */
    cloneForContract(template) {
      const src = typeof template === "string" ? this.getFees().find((f) => f.id === template) : template;
      if (!src) return null;
      const copy = JSON.parse(JSON.stringify(src));
      copy.sourceId = src.id;
      copy.instanceId = uid();
      copy.refLabel = (src.cargoType || "") + " · " + (src.modeName || src.name);
      copy.edited = false;
      return copy;
    },
    calcFee(module, qty) {
      const m = module;
      if (m.priceMode === "固定包干" && (!m.tierEnabled || !(m.tiers || []).length)) {
        const amount = (m.basePrice || 0) * (qty || 1);
        return { amount, detail: [{ qty: qty || 1, price: m.basePrice || 0, discount: 100, amount }] };
      }
      if (!m.tierEnabled || !(m.tiers || []).length) {
        return { amount: qty * (m.basePrice || 0), detail: [{ qty, price: m.basePrice || 0, discount: 100, amount: qty * (m.basePrice || 0) }] };
      }
      if (m.algorithm === "分段累进") return calcProgressive(qty, m.tiers, m.resultType, m.basePrice || 0);
      return calcFullBand(qty, m.tiers, m.resultType, m.basePrice || 0);
    },
  };
})(window);
