/* v4.0.0 种子数据 · 计划树（无限层级）· 无年/月/周计划实体 */
(function (global) {
  const USERS = [
    { id: "u_gm", name: "李家治", role: "总经理", dept: "公司", title: "总经理" },
    { id: "u_plan_admin", name: "张凯", role: "计划管理员", dept: "公司", title: "计划管理员" },
    { id: "u_prod_h", name: "刘伟松", role: "部门长", dept: "生产操作部", title: "部长" },
    { id: "u_prod_s", name: "余彪", role: "员工", dept: "生产操作部", title: "员工" },
    { id: "u_eq_h", name: "解运富", role: "部门长", dept: "设备技术部", title: "部长" },
    { id: "u_eq_s", name: "盛侨", role: "员工", dept: "设备技术部", title: "员工" },
    { id: "u_safe_h", name: "洪佳伟", role: "部门长", dept: "安全监督部", title: "部长" },
    { id: "u_safe_s", name: "陈子龙", role: "员工", dept: "安全监督部", title: "员工" },
    { id: "u_mkt_h", name: "钱旦", role: "部门长", dept: "市场开发部", title: "部长" },
    { id: "u_mkt_s", name: "张凯", role: "员工", dept: "市场开发部", title: "员工" },
  ];

  const DEPTS = ["生产操作部", "设备技术部", "安全监督部", "市场开发部"];


  /** progressPct：总经理手填整体进度；startDate/endDate：公司目标起止 */
  const COMPANY_PLANS = [
    {
      id: "cp1",
      name: "2026年吞吐量冲击400–480万吨",
      status: "进行中",
      priority: "P0",
      progress: "基本盘约300万吨，缺口100–180万吨；铁路延期至约2027春节",
      owner: "李家治",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progressPct: 34,
    },
    {
      id: "cp2",
      name: "2026年运营体系建设与标准化",
      status: "进行中",
      priority: "P1",
      progress: "各部门制度、作业指导书、安环台账推进中",
      owner: "李家治",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progressPct: 48,
    },
  ];

  function deptHeadId(dept) {
    const u = USERS.find((x) => x.dept === dept && x.role === "部门长");
    return u ? u.id : "";
  }

  /**
   * 部门计划树字段：
   * priority / ownerId(可跨部门) / helperIds[] / startDate / endDate(必填) /
   * progressPct(手填0-100) / progress(进展说明) / status(延期=结束日已过且进度<100 自动)
   */
  let planItems = [
    // 生产
    { id: "a_p1", dept: "生产操作部", companyPlanId: "cp1", parentId: null, name: "散杂货吞吐目标分解（合计约400万吨）", status: "进行中", progress: "年累完成137万吨，完成约34%", priority: "P0", ownerId: "u_prod_h", helperIds: ["u_mkt_h", "u_eq_h"], startDate: "2026-01-01", endDate: "2026-12-31", progressPct: 34 },
    { id: "a_p1_1", dept: "生产操作部", companyPlanId: "cp1", parentId: "a_p1", name: "装卸货物41万吨盯控", status: "延期", progress: "累计16.31万吨，完成约39.78%", priority: "P0", ownerId: "u_prod_h", helperIds: ["u_mkt_s"], startDate: "2026-01-01", endDate: "2026-08-10", progressPct: 40 },
    { id: "a_p1_1_1", dept: "生产操作部", companyPlanId: "cp1", parentId: "a_p1_1", name: "保障民本/祥云/电富作业", status: "进行中", progress: "民本6000吨，祥云约3.37万吨，电富1625吨", priority: "P0", ownerId: "u_prod_s", helperIds: ["u_eq_s"], startDate: "2026-07-01", endDate: "2026-09-30", progressPct: 55 },
    { id: "a_p2", dept: "生产操作部", companyPlanId: "cp2", parentId: null, name: "人员招聘与岗位培训", status: "进行中", progress: "已招调度/中控各2人，铁运相关岗位后续启动", priority: "P1", ownerId: "u_prod_h", helperIds: ["u_safe_h"], startDate: "2026-03-01", endDate: "2026-10-31", progressPct: 45 },
    { id: "a_p3", dept: "生产操作部", companyPlanId: "cp2", parentId: null, name: "装卸作业标准化与表单建设", status: "进行中", progress: "船-车/吨包指导书与日志表单已完成一批", priority: "P1", ownerId: "u_prod_h", helperIds: ["u_prod_s", "u_eq_h"], startDate: "2026-02-01", endDate: "2026-11-30", progressPct: 60 },
    // 设备
    { id: "a_e1", dept: "设备技术部", companyPlanId: "cp2", parentId: null, name: "设备安装调试问题督改", status: "进行中", progress: "皮带/门机/装船机等问题持续整改", priority: "P0", ownerId: "u_eq_h", helperIds: ["u_prod_h"], startDate: "2026-01-15", endDate: "2026-12-31", progressPct: 48 },
    { id: "a_e1_1", dept: "设备技术部", companyPlanId: "cp2", parentId: "a_e1", name: "装船机/零星改造推进", status: "进行中", progress: "装船机皮带划伤与水箱改造询价推进", priority: "P0", ownerId: "u_eq_h", helperIds: ["u_eq_s"], startDate: "2026-04-01", endDate: "2026-10-31", progressPct: 42 },
    { id: "a_e1_1_1", dept: "设备技术部", companyPlanId: "cp2", parentId: "a_e1_1", name: "装船机皮带与改造清单会议", status: "进行中", progress: "待祥云回复皮带更换时间", priority: "P1", ownerId: "u_eq_s", helperIds: ["u_mkt_h"], startDate: "2026-07-01", endDate: "2026-09-15", progressPct: 35 },
    { id: "a_e2", dept: "设备技术部", companyPlanId: "cp2", parentId: null, name: "维保标准化与备件台账", status: "进行中", progress: "点检润滑表已编，易损件台账推进中", priority: "P1", ownerId: "u_eq_h", helperIds: ["u_eq_s"], startDate: "2026-02-01", endDate: "2026-12-31", progressPct: 50 },
    { id: "a_e3", dept: "设备技术部", companyPlanId: "cp2", parentId: null, name: "维保与零星改造招标采购", status: "进行中", progress: "维保合同流程推进；零星改造询价中", priority: "P1", ownerId: "u_eq_h", helperIds: ["u_safe_s"], startDate: "2026-03-01", endDate: "2026-11-30", progressPct: 38 },
    // 安监
    { id: "a_s1", dept: "安全监督部", companyPlanId: "cp2", parentId: null, name: "地方监管对接与备案", status: "进行中", progress: "应急预案备案、排污许可已办", priority: "P0", ownerId: "u_safe_h", helperIds: ["u_eq_h"], startDate: "2026-01-01", endDate: "2026-12-31", progressPct: 70 },
    { id: "a_s2", dept: "安全监督部", companyPlanId: "cp2", parentId: null, name: "现场安全环保管理与周检", status: "进行中", progress: "周检隐患整改推进；整改率目标≥97%", priority: "P0", ownerId: "u_safe_h", helperIds: ["u_safe_s", "u_prod_h"], startDate: "2026-01-01", endDate: "2026-12-31", progressPct: 62 },
    { id: "a_s2_1", dept: "安全监督部", companyPlanId: "cp2", parentId: "a_s2", name: "安全周检与省厅整改", status: "进行中", progress: "周检隐患已整改；省厅整改项推进中", priority: "P0", ownerId: "u_safe_h", helperIds: ["u_safe_s"], startDate: "2026-05-01", endDate: "2026-09-30", progressPct: 58 },
    { id: "a_s2_1_1", dept: "安全监督部", companyPlanId: "cp2", parentId: "a_s2_1", name: "省厅整改与环保监测对接", status: "进行中", progress: "四色桶、防风措施、奖励制度等整改", priority: "P1", ownerId: "u_safe_s", helperIds: ["u_eq_s"], startDate: "2026-06-01", endDate: "2026-08-31", progressPct: 50 },
    { id: "a_s3", dept: "安全监督部", companyPlanId: "cp2", parentId: null, name: "安全体系建设与台账", status: "进行中", progress: "制度25项待发文；台账持续完善", priority: "P1", ownerId: "u_safe_h", helperIds: ["u_safe_s"], startDate: "2026-02-01", endDate: "2026-12-31", progressPct: 40 },
    // 市场
    { id: "a_m1", dept: "市场开发部", companyPlanId: "cp1", parentId: null, name: "稳固核心客户基本盘（祥云/民本/延长）", status: "关注", progress: "核心客户运量评估存在下调风险", priority: "P0", ownerId: "u_mkt_h", helperIds: ["u_mkt_s", "u_prod_h"], startDate: "2026-01-01", endDate: "2026-12-31", progressPct: 28 },
    { id: "a_m2", dept: "市场开发部", companyPlanId: "cp1", parentId: null, name: "宝武球团矿头号攻坚", status: "进行中", progress: "目标商务与首船，贡献约10万吨增量", priority: "P0", ownerId: "u_mkt_h", helperIds: ["u_mkt_s"], startDate: "2026-03-01", endDate: "2026-12-31", progressPct: 32 },
    { id: "a_m2_1", dept: "市场开发部", companyPlanId: "cp1", parentId: "a_m2", name: "球团与煤炭客户跟进", status: "进行中", progress: "延长石油招采、平鄂煤方案内部商定", priority: "P1", ownerId: "u_mkt_s", helperIds: ["u_mkt_h"], startDate: "2026-06-01", endDate: "2026-10-31", progressPct: 36 },
    { id: "a_m3", dept: "市场开发部", companyPlanId: "cp1", parentId: null, name: "粮食与腹地煤炭增量落地", status: "进行中", progress: "粮食/煤炭增量务实推进", priority: "P1", ownerId: "u_mkt_h", helperIds: ["u_mkt_s", "u_prod_s"], startDate: "2026-04-01", endDate: "2026-12-31", progressPct: 30 },
    { id: "a_m4", dept: "市场开发部", companyPlanId: "cp1", parentId: null, name: "资金回款与运量兑现", status: "延期", progress: "回款不及预期；持续催票催款", priority: "P0", ownerId: "u_mkt_h", helperIds: ["u_mkt_s", "u_prod_h"], startDate: "2026-01-01", endDate: "2026-08-05", progressPct: 22 },
    { id: "a_m4_1", dept: "市场开发部", companyPlanId: "cp1", parentId: "a_m4", name: "回款与运量跟进", status: "关注", progress: "催促祥云开票付款", priority: "P0", ownerId: "u_mkt_h", helperIds: ["u_mkt_s"], startDate: "2026-05-01", endDate: "2026-09-30", progressPct: 25 },
    { id: "a_m4_1_1", dept: "市场开发部", companyPlanId: "cp1", parentId: "a_m4_1", name: "催票催款与运量协调", status: "进行中", progress: "催促已开票付款与未开票审批", priority: "P0", ownerId: "u_mkt_s", helperIds: ["u_mkt_h"], startDate: "2026-07-01", endDate: "2026-08-31", progressPct: 40 },
  ];

  /** 任务：startDate/endDate 必填口径；耗费工时=日历天数(含首尾)×8；deadline 与 endDate 同步供逾期判断 */
  let taskItems = [
    { id: "t1", name: "编制本周昼夜作业计划并盯控完成率", annualId: "a_p1", week: "2026-W34", ownerId: "u_prod_h", status: "进行中", source: "下达", dept: "生产操作部", parentId: null, taskType: "生产作业", priority: "P0", startDate: "2026-08-17", endDate: "2026-08-20", deadline: "2026-08-20", createdAt: "2026-08-17", remark: "昼夜班交接后更新完成率；异常船期即时上报。", completionNote: "昼夜计划表已编制；完成率盯控进行中，民本轮班次已对齐。", attachments: [{ name: "昼夜作业计划表_W34.xlsx" }] },
    { id: "t1b", name: "本周民本/祥云/电富到港作业盯控", annualId: "a_p1_1_1", week: "2026-W34", ownerId: "u_prod_h", status: "进行中", source: "下达", dept: "生产操作部", parentId: null, taskType: "生产作业", priority: "P0", startDate: "2026-08-10", endDate: "2026-08-24", deadline: "2026-08-24", createdAt: "2026-08-10" },
    { id: "t2", name: "理货交接与磅码单核对", annualId: "a_p3", week: "2026-W34", ownerId: "u_prod_s", status: "进行中", source: "下达", dept: "生产操作部", parentId: null, taskType: "生产作业", priority: "P1", startDate: "2026-08-17", endDate: "2026-08-22", deadline: "2026-08-22", createdAt: "2026-08-17" },
    { id: "t2b", name: "劳务作业票开具方法培训", annualId: "a_p3", week: "2026-W34", ownerId: "u_prod_s", status: "已完成", source: "下达", dept: "生产操作部", parentId: "t2", taskType: "生产作业", priority: "P2", startDate: "2026-08-12", endDate: "2026-08-18", deadline: "2026-08-18", createdAt: "2026-08-12" },
    { id: "t2c", name: "培训材料归档关闭", annualId: "a_p3", week: "2026-W33", ownerId: "u_prod_s", status: "已关闭", source: "自建", dept: "生产操作部", parentId: "t2", taskType: "生产作业", priority: "P2", startDate: "2026-08-10", endDate: "2026-08-15", deadline: "2026-08-15", createdAt: "2026-08-10" },
    { id: "t3", name: "跟踪装船机皮带更换时间窗口", annualId: "a_e1_1_1", week: "2026-W34", ownerId: "u_eq_h", status: "进行中", source: "下达", dept: "设备技术部", parentId: null, taskType: "设备维保", priority: "P0", startDate: "2026-08-10", endDate: "2026-08-25", deadline: "2026-08-25", createdAt: "2026-08-10" },
    { id: "t4", name: "收集零星改造报价文件", annualId: "a_e3", week: "2026-W34", ownerId: "u_eq_s", status: "未开始", source: "下达", dept: "设备技术部", parentId: null, taskType: "设备维保", priority: "P1", startDate: "2026-08-17", endDate: "2026-08-28", deadline: "2026-08-28", createdAt: "2026-08-17" },
    { id: "t4b", name: "隔离墩涂刷验收", annualId: "a_e2", week: "2026-W33", ownerId: "u_eq_s", status: "已完成", source: "下达", dept: "设备技术部", parentId: null, taskType: "设备维保", priority: "P2", startDate: "2026-08-02", endDate: "2026-08-16", deadline: "2026-08-16", createdAt: "2026-08-02" },
    { id: "t5", name: "完成省厅安全整改三项", annualId: "a_s2_1", week: "2026-W34", ownerId: "u_safe_h", status: "进行中", source: "下达", dept: "安全监督部", parentId: null, taskType: "安全环保", priority: "P0", startDate: "2026-08-17", endDate: "2026-08-24", deadline: "2026-08-24", createdAt: "2026-08-17" },
    { id: "t6", name: "补充安全台账与巡查记录", annualId: "a_s3", week: "2026-W34", ownerId: "u_safe_s", status: "进行中", source: "自建", dept: "安全监督部", parentId: null, taskType: "安全环保", priority: "P1", startDate: "2026-08-17", endDate: "2026-08-26", deadline: "2026-08-26", createdAt: "2026-08-17" },
    { id: "t6b", name: "五一节前安全检查闭环", annualId: "a_s2", week: "2026-W18", ownerId: "u_safe_s", status: "已关闭", source: "下达", dept: "安全监督部", parentId: "t5", taskType: "安全环保", priority: "P2", startDate: "2026-04-28", endDate: "2026-05-02", deadline: "2026-05-02", createdAt: "2026-04-28" },
    { id: "t7", name: "催促祥云已开票部分付款", annualId: "a_m4", week: "2026-W34", ownerId: "u_mkt_h", status: "延期", source: "下达", dept: "市场开发部", parentId: null, taskType: "市场商务", priority: "P0", startDate: "2026-08-10", endDate: "2026-08-20", deadline: "2026-08-20", createdAt: "2026-08-10" },
    { id: "t7b", name: "催促祥云未开票部分加快审批", annualId: "a_m4_1_1", week: "2026-W34", ownerId: "u_mkt_h", status: "进行中", source: "下达", dept: "市场开发部", parentId: null, taskType: "市场商务", priority: "P0", startDate: "2026-08-17", endDate: "2026-08-24", deadline: "2026-08-24", createdAt: "2026-08-17" },
    { id: "t8", name: "跟进平鄂煤下一步方案纪要", annualId: "a_m3", week: "2026-W34", ownerId: "u_mkt_s", status: "进行中", source: "下达", dept: "市场开发部", parentId: null, taskType: "市场商务", priority: "P1", startDate: "2026-08-17", endDate: "2026-08-25", deadline: "2026-08-25", createdAt: "2026-08-17" },
    { id: "t8b", name: "延长石油首月招采开标跟进", annualId: "a_m1", week: "2026-W34", ownerId: "u_mkt_s", status: "未开始", source: "下达", dept: "市场开发部", parentId: null, taskType: "市场商务", priority: "P0", startDate: "2026-08-18", endDate: "2026-08-28", deadline: "2026-08-28", createdAt: "2026-08-18" },
    /** 部门临时任务：无关联计划 */
    { id: "t_tmp1", name: "协调临时加班人员排班", annualId: "", week: "2026-W34", ownerId: "u_prod_s", status: "进行中", source: "自建", dept: "生产操作部", parentId: null, taskType: "其他", priority: "P1", startDate: "2026-08-18", endDate: "2026-08-22", deadline: "2026-08-22", createdAt: "2026-08-18", taskKind: "临时", remark: "本周峰值作业，需劳务班组配合。", attachments: [{ name: "加班人员名单.docx" }] },
    { id: "t_tmp2", name: "会议室设备临时检修预约", annualId: "", week: "2026-W34", ownerId: "u_eq_s", status: "未开始", source: "下达", dept: "设备技术部", parentId: null, taskType: "其他", priority: "P2", startDate: "2026-08-19", endDate: "2026-08-21", deadline: "2026-08-21", createdAt: "2026-08-18", taskKind: "临时", remark: "", attachments: [] },
  ];

  /** 任务周报/月报：按 用户 × 公司计划 × 周期 填写本人文本与进度 */
  let periodReports = [
    /** 上期计划种子：供 W34 / 08 回显「上周计划」「上月计划」 */
    {
      userId: "u_prod_h",
      periodType: "week",
      periodKey: "2026-W33",
      companyPlanId: "cp1",
      doneText: "W33 装卸盯控完成一批到港船。",
      planText: "1、盯控民本/祥云到港作业\n2、编制下周昼夜作业计划",
      progressPct: 30,
    },
    {
      userId: "u_prod_h",
      periodType: "week",
      periodKey: "2026-W33",
      companyPlanId: "cp2",
      doneText: "标准化表单试点推进。",
      planText: "1、船-车/吨包指导书落地一批\n2、新招调度岗培训安排",
      progressPct: 42,
    },
    {
      userId: "u_mkt_h",
      periodType: "week",
      periodKey: "2026-W33",
      companyPlanId: "cp1",
      doneText: "核心客户运量摸底。",
      planText: "1、催促祥云开票付款\n2、煤炭客户方案内部商定",
      progressPct: 24,
    },
    {
      userId: "u_eq_h",
      periodType: "month",
      periodKey: "2026-07",
      companyPlanId: "cp2",
      doneText: "7月改造清单收集。",
      planText: "1、完成改造清单收集\n2、推进皮带更换窗口沟通",
      progressPct: 45,
    },
    {
      userId: "u_prod_h",
      periodType: "week",
      periodKey: "2026-W34",
      companyPlanId: "cp1",
      doneText: "上周累计装卸约6.07万吨；民本/祥云船货已到港盯控。",
      planText: "1、编制昼夜作业计划并盯控吞吐缺口\n2、保障民本/祥云/电富到港作业",
      progressPct: 34,
    },
    {
      userId: "u_prod_h",
      periodType: "week",
      periodKey: "2026-W34",
      companyPlanId: "cp2",
      doneText: "上周船-车/吨包指导书已应用一批。",
      planText: "1、推进装卸标准化表单落地\n2、跟进新招调度/中控岗位培训",
      progressPct: 48,
    },
    {
      userId: "u_mkt_h",
      periodType: "week",
      periodKey: "2026-W34",
      companyPlanId: "cp1",
      doneText: "上周催票催款推进；煤炭客户方案内部商定。",
      planText: "1、催促祥云开票付款\n2、跟进平鄂煤与延长石油招采",
      progressPct: 28,
      attachments: [
        {
          id: "att_demo_prd",
          name: "市场回款跟进说明.prd.md",
          kind: "prd",
          mime: "text/markdown",
          size: 256,
          text:
            "# 市场回款跟进说明（示例 PRD 附件）\n\n## 背景\n祥云已开票部分付款滞后，影响吞吐目标兑现。\n\n## 本周动作\n1. 催票催款\n2. 平鄂煤/延长石油跟进\n\n> 原型演示：PRD/Markdown 可在线预览正文。",
        },
        {
          id: "att_demo_doc",
          name: "催款纪要摘要.docx",
          kind: "word",
          mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 128,
          text: "【Word 原型预览】\n会议纪要：已与祥云确认付款节点；下周前反馈到账情况。\n（正式环境将对接文档预览服务）",
        },
      ],
    },
    {
      userId: "u_eq_h",
      periodType: "month",
      periodKey: "2026-08",
      companyPlanId: "cp2",
      doneText: "上月改造清单已收；皮带更换待祥云回复。",
      planText: "1、装船机皮带更换窗口确认\n2、零星改造询价与上会",
      progressPct: 52,
    },
  ];

  /**
   * 关键节点变更记录（计划详情弹窗只读演示）
   * refId：公司计划 id 或部门计划 id；field：变更项
   */
  let planChangeLogs = [
    {
      id: "pcl_cp1_1",
      refId: "cp1",
      refKind: "company",
      at: "2026-08-12 10:20",
      operator: "李家治",
      field: "整体进度",
      from: "28%",
      to: "34%",
      note: "按年累吞吐手填更新",
    },
    {
      id: "pcl_cp1_2",
      refId: "cp1",
      refKind: "company",
      at: "2026-07-01 09:00",
      operator: "李家治",
      field: "进展说明",
      from: "基本盘约280万吨",
      to: "基本盘约300万吨，缺口100–180万吨；铁路延期至约2027春节",
      note: "半年度复盘修订目标表述",
    },
    {
      id: "pcl_cp1_3",
      refId: "cp1",
      refKind: "company",
      at: "2026-01-05 14:00",
      operator: "李家治",
      field: "新建计划",
      from: "—",
      to: "发布公司目标",
      note: "下达2026吞吐冲击目标",
    },
    {
      id: "pcl_cp2_1",
      refId: "cp2",
      refKind: "company",
      at: "2026-08-05 11:00",
      operator: "李家治",
      field: "整体进度",
      from: "42%",
      to: "48%",
      note: "运营体系建设阶段复盘",
    },
    {
      id: "pcl_cp2_2",
      refId: "cp2",
      refKind: "company",
      at: "2026-03-01 09:30",
      operator: "李家治",
      field: "状态",
      from: "未开始",
      to: "进行中",
      note: "各部门制度建设全面启动",
    },
    {
      id: "pcl_ap1_1",
      refId: "a_p1",
      refKind: "dept",
      at: "2026-08-11 16:40",
      operator: "刘伟松",
      field: "进度",
      from: "30%",
      to: "34%",
      note: "年累完成137万吨同步更新",
    },
    {
      id: "pcl_ap1_2",
      refId: "a_p1",
      refKind: "dept",
      at: "2026-06-15 10:00",
      operator: "刘伟松",
      field: "拆解子计划",
      from: "—",
      to: "装卸货物41万吨盯控",
      note: "分解吞吐盯控节点",
    },
    {
      id: "pcl_ap1_3",
      refId: "a_p1",
      refKind: "dept",
      at: "2026-02-10 09:15",
      operator: "李家治",
      field: "责任人",
      from: "待指定",
      to: "刘伟松",
      note: "明确生产部主责",
    },
    {
      id: "pcl_ap11_1",
      refId: "a_p1_1",
      refKind: "dept",
      at: "2026-08-11 08:30",
      operator: "系统",
      field: "状态",
      from: "进行中",
      to: "延期",
      note: "结束日已过且进度未满，自动标延期",
    },
    {
      id: "pcl_ap11_2",
      refId: "a_p1_1",
      refKind: "dept",
      at: "2026-07-20 15:00",
      operator: "刘伟松",
      field: "结束日",
      from: "2026-07-31",
      to: "2026-08-10",
      note: "船期波动顺延盯控截止",
    },
    {
      id: "pcl_ap111_1",
      refId: "a_p1_1_1",
      refKind: "dept",
      at: "2026-08-08 11:20",
      operator: "余彪",
      field: "进度",
      from: "40%",
      to: "55%",
      note: "民本/祥云到港作业推进",
    },
    {
      id: "pcl_am4_1",
      refId: "a_m4",
      refKind: "dept",
      at: "2026-08-06 09:00",
      operator: "系统",
      field: "状态",
      from: "关注",
      to: "延期",
      note: "结束日已过且进度未满，自动标延期",
    },
    {
      id: "pcl_am4_2",
      refId: "a_m4",
      refKind: "dept",
      at: "2026-07-01 14:30",
      operator: "钱旦",
      field: "状态",
      from: "进行中",
      to: "关注",
      note: "回款不及预期，升级关注",
    },
    {
      id: "pcl_am4_3",
      refId: "a_m4",
      refKind: "dept",
      at: "2026-05-12 10:10",
      operator: "钱旦",
      field: "拆解子计划",
      from: "—",
      to: "回款与运量跟进",
      note: "增设回款盯控子节点",
    },
    {
      id: "pcl_ae1_1",
      refId: "a_e1",
      refKind: "dept",
      at: "2026-08-01 09:45",
      operator: "解运富",
      field: "进度",
      from: "40%",
      to: "48%",
      note: "皮带/门机整改一批闭环",
    },
    {
      id: "pcl_ae1_2",
      refId: "a_e1",
      refKind: "dept",
      at: "2026-04-02 16:00",
      operator: "解运富",
      field: "拆解子计划",
      from: "—",
      to: "装船机/零星改造推进",
      note: "按改造清单拆解执行节点",
    },
    {
      id: "pcl_as2_1",
      refId: "a_s2",
      refKind: "dept",
      at: "2026-08-09 13:20",
      operator: "洪佳伟",
      field: "配合人",
      from: "陈子龙",
      to: "陈子龙、刘伟松",
      note: "周检整改需生产部配合",
    },
    {
      id: "pcl_am1_1",
      refId: "a_m1",
      refKind: "dept",
      at: "2026-08-03 10:00",
      operator: "钱旦",
      field: "状态",
      from: "进行中",
      to: "关注",
      note: "核心客户运量评估存在下调风险",
    },
  ];

  /**
   * 任务操作记录（任务详情只读）
   * taskId：任务 id；field：变更项
   */
  let taskChangeLogs = [
    {
      id: "tcl_t1_1",
      taskId: "t1",
      at: "2026-08-17 09:10",
      operator: "刘伟松",
      field: "新建任务",
      from: "—",
      to: "编制本周昼夜作业计划并盯控完成率",
      note: "下达关联计划任务",
    },
    {
      id: "tcl_t1_2",
      taskId: "t1",
      at: "2026-08-18 08:40",
      operator: "刘伟松",
      field: "附件",
      from: "—",
      to: "昼夜作业计划表_W34.xlsx",
      note: "补充作业表附件",
    },
    {
      id: "tcl_t1_3",
      taskId: "t1",
      at: "2026-08-18 11:20",
      operator: "刘伟松",
      field: "备注",
      from: "—",
      to: "昼夜班交接后更新完成率；异常船期即时上报。",
      note: "",
    },
    {
      id: "tcl_tmp1_1",
      taskId: "t_tmp1",
      at: "2026-08-18 09:00",
      operator: "余彪",
      field: "新建任务",
      from: "—",
      to: "协调临时加班人员排班",
      note: "自建临时任务",
    },
    {
      id: "tcl_tmp1_2",
      taskId: "t_tmp1",
      at: "2026-08-18 10:15",
      operator: "余彪",
      field: "状态",
      from: "未开始",
      to: "进行中",
      note: "",
    },
  ];

  /** 任务督办：计划外事项（无关联计划）；种子含原例会待办并入 */
  let superviseItems = [
    {
      id: "sv1",
      title: "跟进维保单位保险购买情况",
      ownerId: "u_safe_h",
      helperIds: ["u_safe_s"],
      week: "2026-W34",
      status: "待办",
      priority: "P1",
      startDate: "2026-08-18",
      endDate: "2026-08-25",
      creatorId: "u_gm",
      note: "原周例会待办并入",
      createdAt: "2026-08-18",
    },
    {
      id: "sv2",
      title: "电磁吸盘采购方案收集报价",
      ownerId: "u_eq_s",
      helperIds: ["u_eq_h"],
      week: "2026-W34",
      status: "进行中",
      priority: "P1",
      startDate: "2026-08-15",
      endDate: "2026-08-28",
      creatorId: "u_gm",
      note: "原周例会待办并入",
      createdAt: "2026-08-15",
    },
    {
      id: "sv3",
      title: "箱管系统开发进度确认",
      ownerId: "u_gm",
      helperIds: ["u_mkt_h"],
      week: "2026-W34",
      status: "待办",
      priority: "P0",
      startDate: "2026-08-18",
      endDate: "2026-08-22",
      creatorId: "u_prod_h",
      note: "原周例会待办并入",
      createdAt: "2026-08-18",
    },
  ];

  function helperNamesOf(item) {
    return (item.helperIds || [])
      .map((id) => {
        const u = USERS.find((x) => x.id === id);
        return u ? u.name : "";
      })
      .filter(Boolean)
      .join("、");
  }

  function normalizeSupervise(item) {
    const helperIds = Array.isArray(item.helperIds) ? item.helperIds.filter(Boolean) : [];
    return {
      ...item,
      helperIds,
      helper: helperNamesOf({ helperIds }),
      priority: item.priority || "P1",
      status: item.status || "待办",
      week: item.week || "2026-W34",
      startDate: item.startDate || "",
      endDate: item.endDate || item.deadline || "",
      creatorId: item.creatorId || "",
      note: item.note || "",
    };
  }

  superviseItems = superviseItems.map(normalizeSupervise);

  /**
   * 会议纪要：类型=周例会/月例会/总经理办公会；仅计划管理员维护
   * periodKey：周例会如 2026-W34；月例会如 2026-08；总办会如 2026-08-15
   * relatedUserIds：关联人员；attachments：资料附件（文件名）
   */
  const MEETING_TYPES = ["周例会", "月例会", "总经理办公会"];
  let meetingMinutes = [
    {
      id: "mm_w34",
      meetingType: "周例会",
      periodKey: "2026-W34",
      week: "2026-W34",
      summary:
        "1. 吞吐盯控：民本/祥云到港作业按节点推进，回款仍需市场部跟催。\n2. 设备：装船机皮带更换窗口本周确认。\n3. 督办：维保保险、电磁吸盘报价、箱管进度三项限期闭环。",
      relatedUserIds: ["u_gm", "u_plan_admin", "u_prod_h", "u_eq_h", "u_safe_h", "u_mkt_h"],
      attachments: [{ name: "公司周例会纪要_2026W34.docx" }, { name: "例会议程.pdf" }],
      updatedAt: "2026-08-18 17:30",
      updatedBy: "u_plan_admin",
    },
    {
      id: "mm_w33",
      meetingType: "周例会",
      periodKey: "2026-W33",
      week: "2026-W33",
      summary:
        "1. 上周吞吐复盘完成，缺口仍在回款与船期。\n2. 安全整改三项持续盯控。\n3. 例会待办三项已转入督办闭环。",
      relatedUserIds: ["u_gm", "u_plan_admin", "u_prod_h", "u_mkt_h"],
      attachments: [{ name: "公司周例会纪要_2026W33.docx" }],
      updatedAt: "2026-08-11 16:20",
      updatedBy: "u_plan_admin",
    },
    {
      id: "mm_m08",
      meetingType: "月例会",
      periodKey: "2026-08",
      week: "",
      summary:
        "1. 8 月吞吐缺口复盘，重点盯控回款与船期。\n2. 各部门月度重点与跨部门配合项对齐。\n3. 安全整改与设备窗口纳入下月跟踪。",
      relatedUserIds: ["u_gm", "u_plan_admin", "u_prod_h", "u_eq_h", "u_safe_h", "u_mkt_h"],
      attachments: [{ name: "月例会纪要_202608.docx" }, { name: "月度经营简报.xlsx" }],
      updatedAt: "2026-08-05 16:00",
      updatedBy: "u_plan_admin",
    },
    {
      id: "mm_gm1",
      meetingType: "总经理办公会",
      periodKey: "2026-08-15",
      week: "",
      summary:
        "1. 确认吞吐冲击目标阶段举措。\n2. 批准设备零星改造询价上会。\n3. 市场回款节点由市场部本周反馈。",
      relatedUserIds: ["u_gm", "u_plan_admin", "u_prod_h", "u_eq_h"],
      attachments: [{ name: "总办会纪要_20260815.pdf" }],
      updatedAt: "2026-08-15 18:10",
      updatedBy: "u_plan_admin",
    },
  ];

  let todos = [];

  /** 演示「今天」：用于临期/逾期判断 */
  const DEMO_TODAY = "2026-08-18";
  const BASIC_CONFIG_KEY = "bms_v4_basic_config";
  const BASIC_CONFIG_DEFAULTS = {
    weekDay: "5",
    weekTime: "17:00",
    monthLastDays: 3,
    nearDueDays: 3,
  };

  function getBasicConfig() {
    try {
      const raw = localStorage.getItem(BASIC_CONFIG_KEY);
      if (!raw) return { ...BASIC_CONFIG_DEFAULTS };
      const parsed = JSON.parse(raw);
      return { ...BASIC_CONFIG_DEFAULTS, ...parsed };
    } catch (e) {
      return { ...BASIC_CONFIG_DEFAULTS };
    }
  }

  /** 临期天数：取基础配置 nearDueDays，钳制 1–30，默认 3 */
  function getNearDueDays() {
    const n = Number(getBasicConfig().nearDueDays);
    if (!Number.isFinite(n)) return 3;
    return Math.max(1, Math.min(30, Math.round(n)));
  }

  function saveBasicConfig(cfg) {
    const next = {
      weekDay: String(cfg.weekDay != null ? cfg.weekDay : BASIC_CONFIG_DEFAULTS.weekDay),
      weekTime: cfg.weekTime || BASIC_CONFIG_DEFAULTS.weekTime,
      monthLastDays: Math.max(1, Math.min(15, Number(cfg.monthLastDays) || 3)),
      nearDueDays: Math.max(1, Math.min(30, Number(cfg.nearDueDays) || 3)),
    };
    try {
      localStorage.setItem(BASIC_CONFIG_KEY, JSON.stringify(next));
    } catch (e) {
      /* ignore */
    }
    return { ok: true, config: next };
  }

  /** 催办闭环 */
  let urges = [
    {
      id: "ug1",
      targetUserId: "u_mkt_h",
      title: "催办：催促祥云已开票部分付款",
      note: "回款直接影响吞吐目标，请给出明确回款节点。",
      expectReplyDate: "2026-08-16",
      taskId: "t7",
      planId: "",
      companyPlanId: "cp1",
      dept: "市场开发部",
      exceptionType: "任务延期",
      status: "待回复",
      createdAt: "2026-08-15",
      createdBy: "u_gm",
      replyReason: "",
      replyRemedy: "",
      replyPromiseDate: "",
      repliedAt: "",
      noteHistory: [],
      rejectNote: "",
    },
    {
      id: "ug2",
      targetUserId: "u_eq_h",
      title: "催办：跟踪装船机皮带更换时间窗口",
      note: "请确认更换窗口与对生产影响。",
      expectReplyDate: "2026-08-17",
      taskId: "t3",
      planId: "",
      companyPlanId: "cp2",
      dept: "设备技术部",
      exceptionType: "任务临期",
      status: "已回复",
      createdAt: "2026-08-16",
      createdBy: "u_gm",
      replyReason: "厂家排期紧张，窗口需与祥云协调。",
      replyRemedy: "本周内锁定更换日并同步生产部作业计划。",
      replyPromiseDate: "2026-08-22",
      repliedAt: "2026-08-18",
      noteHistory: [],
      rejectNote: "",
    },
    {
      id: "ug3",
      targetUserId: "u_mkt_h",
      title: "催办：资金回款与运量兑现计划卡点",
      note: "计划已延期，请反馈纠偏措施与可兑现节点。",
      expectReplyDate: "2026-08-16",
      taskId: "",
      planId: "a_m4",
      companyPlanId: "cp1",
      dept: "市场开发部",
      exceptionType: "计划卡点",
      status: "待回复",
      createdAt: "2026-08-15",
      createdBy: "u_gm",
      replyReason: "",
      replyRemedy: "",
      replyPromiseDate: "",
      repliedAt: "",
      noteHistory: [],
      rejectNote: "",
    },
  ];

  function userById(id) {
    return USERS.find((u) => u.id === id);
  }

  function parseDay(s) {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function dayDiff(fromStr, toStr) {
    const a = parseDay(fromStr);
    const b = parseDay(toStr);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
  }

  const WORKDAY_HOURS = 8;

  /** 起止含首尾日历天 × 8h；缺日期返回 0 */
  function workHoursByRange(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    const d = dayDiff(startDate, endDate);
    if (d == null || d < 0) return 0;
    return (d + 1) * WORKDAY_HOURS;
  }

  function taskEndDate(t) {
    return (t && (t.endDate || t.deadline)) || "";
  }

  function taskStartDate(t) {
    return (t && (t.startDate || t.createdAt)) || "";
  }

  /** 耗费工时：按开始~结束自动计算 */
  function taskWorkHours(t) {
    return workHoursByRange(taskStartDate(t), taskEndDate(t));
  }

  function isTempTask(t) {
    if (!t) return false;
    if (t.taskKind === "临时") return true;
    return !t.annualId;
  }

  function normalizeAttachments(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((a) => {
        if (!a) return null;
        if (typeof a === "string") return { name: a };
        const name = String(a.name || "").trim();
        return name ? { name } : null;
      })
      .filter(Boolean);
  }

  function normalizeMeetingMinute(m) {
    const meetingType = MEETING_TYPES.includes(m.meetingType) ? m.meetingType : "周例会";
    const periodKey = String(m.periodKey || m.week || "").trim() || (meetingType === "周例会" ? "2026-W34" : "");
    const relatedUserIds = Array.isArray(m.relatedUserIds)
      ? m.relatedUserIds.filter((id, i, arr) => id && arr.indexOf(id) === i)
      : [];
    return {
      id: m.id || "mm_" + Date.now(),
      meetingType,
      periodKey,
      week: meetingType === "周例会" ? periodKey : m.week || "",
      summary: m.summary != null ? String(m.summary) : "",
      relatedUserIds,
      attachments: normalizeAttachments(m.attachments),
      updatedAt: m.updatedAt || DEMO_TODAY + " 12:00",
      updatedBy: m.updatedBy || "",
    };
  }

  meetingMinutes = meetingMinutes.map(normalizeMeetingMinute);

  function normalizeTaskDates(t) {
    const startDate = t.startDate || t.createdAt || "";
    const endDate = t.endDate || t.deadline || "";
    const hours = workHoursByRange(startDate, endDate);
    const annualId = t.annualId || "";
    const taskKind = t.taskKind === "临时" || !annualId ? "临时" : "计划";
    return {
      ...t,
      annualId: taskKind === "临时" ? "" : annualId,
      taskKind,
      remark: t.remark != null ? String(t.remark) : "",
      completionNote: t.completionNote != null ? String(t.completionNote) : "",
      attachments: normalizeAttachments(t.attachments),
      startDate,
      endDate,
      deadline: endDate,
      planHours: hours,
      actualHours: hours,
    };
  }

  function taskOpen(t) {
    return t.status !== "已完成" && t.status !== "已关闭";
  }

  function isTaskOverdue(t) {
    if (!taskOpen(t)) return false;
    if (t.status === "延期") return true;
    const end = taskEndDate(t);
    if (end && end < DEMO_TODAY) return true;
    return false;
  }

  function isTaskNearDue(t) {
    const end = taskEndDate(t);
    if (!taskOpen(t) || isTaskOverdue(t) || !end) return false;
    const d = dayDiff(DEMO_TODAY, end);
    const near = getNearDueDays();
    return d !== null && d >= 0 && d <= near;
  }

  taskItems = taskItems.map(normalizeTaskDates);

  function clampPct(n) {
    const v = Number(n);
    if (Number.isNaN(v)) return 0;
    return Math.min(100, Math.max(0, Math.round(v)));
  }

  /** 延期：结束日已过且进度&lt;100；进度≥100→已完成；其余保留手填状态 */
  function resolvePlanStatus(p) {
    const pct = clampPct(p.progressPct);
    if (pct >= 100) return "已完成";
    if (p.endDate && p.endDate < DEMO_TODAY) return "延期";
    const st = p.status || "进行中";
    if (st === "延期" || st === "已完成") return "进行中";
    return st;
  }

  function normalizePlan(p) {
    const helperIds = Array.isArray(p.helperIds)
      ? p.helperIds.filter((id, i, arr) => id && arr.indexOf(id) === i && id !== p.ownerId)
      : [];
    const next = {
      ...p,
      priority: p.priority || "P1",
      ownerId: p.ownerId || deptHeadId(p.dept),
      helperIds,
      startDate: p.startDate || "",
      endDate: p.endDate || "",
      progressPct: clampPct(p.progressPct),
      progress: p.progress || "",
    };
    next.status = resolvePlanStatus(next);
    return next;
  }

  function syncAllPlanStatuses() {
    planItems = planItems.map((p) => normalizePlan(p));
  }

  function isPlanOverdue(p) {
    return resolvePlanStatus(p) === "延期";
  }

  function isPlanNearDue(p) {
    if (!p.endDate || resolvePlanStatus(p) === "已完成" || isPlanOverdue(p)) return false;
    const d = dayDiff(DEMO_TODAY, p.endDate);
    const near = getNearDueDays();
    return d !== null && d >= 0 && d <= near;
  }

  function taskFinishRate(list) {
    if (!list.length) return 0;
    const fin = list.filter((t) => t.status === "已完成" || t.status === "已关闭").length;
    return Math.round((fin / list.length) * 1000) / 10;
  }

  function planById(id) {
    return planItems.find((p) => p.id === id);
  }

  function plansForDept(dept) {
    return planItems.filter((p) => p.dept === dept);
  }

  function planChildren(parentId) {
    return planItems.filter((p) => p.parentId === parentId);
  }

  function planDescendantIds(rootId) {
    const ids = [rootId];
    const walk = (pid) => {
      planChildren(pid).forEach((c) => {
        ids.push(c.id);
        walk(c.id);
      });
    };
    walk(rootId);
    return ids;
  }

  function planPathLabel(id) {
    const parts = [];
    let cur = planById(id);
    while (cur) {
      parts.unshift(cur.name);
      cur = cur.parentId ? planById(cur.parentId) : null;
    }
    return parts.join(" / ");
  }

  /** 已办归档（原型内存，供待办「近7日已办」） */
  let todoArchive = [];

  function pushTodoArchive(item) {
    todoArchive = [
      {
        id: item.id,
        type: item.type,
        title: item.title,
        userId: item.userId,
        doneAt: DEMO_TODAY,
        priority: item.priority || "",
      },
      ...todoArchive.filter((x) => x.id !== item.id),
    ].slice(0, 80);
  }

  function taskShouldEnterTodo(t) {
    if (!taskOpen(t)) return false;
    if (t.status === "进行中" || t.status === "延期") return true;
    if (isTaskOverdue(t) || isTaskNearDue(t)) return true;
    return false;
  }

  function planNeedsOwnerTodo(p) {
    const st = resolvePlanStatus(p);
    if (st === "已完成") return false;
    return isPlanOverdue(p) || isPlanNearDue(p);
  }

  function planNeedsHelperTodo(p) {
    const st = resolvePlanStatus(p);
    if (st === "已完成") return false;
    if (st === "关注") return true;
    return isPlanOverdue(p) || isPlanNearDue(p);
  }

  let persistReady = false;

  function rebuildTodos() {
    const week = "2026-W34";
    const month = "2026-08";
    todos = [];
    syncAllPlanStatuses();

    const urgedTaskIds = new Set(
      urges.filter((u) => u.status === "待回复" && u.taskId).map((u) => u.taskId)
    );

    USERS.filter((u) => u.role === "部门长").forEach((u) => {
      const weekGap = COMPANY_PLANS.filter(
        (cp) =>
          !periodReports.some(
            (r) =>
              r.userId === u.id &&
              r.periodType === "week" &&
              r.periodKey === week &&
              r.companyPlanId === cp.id &&
              (r.planText || "").trim() &&
              (r.doneText || "").trim()
          )
      ).length;
      if (weekGap > 0) {
        todos.push({
          id: "td_w_" + u.id,
          type: "任务周报",
          title: "完成本周任务周报填写（缺口 " + weekGap + "/" + COMPANY_PLANS.length + "）",
          userId: u.id,
          week,
          status: "待办",
          priority: "P0",
          dueDate: "2026-08-17",
        });
      }
      const monthGap = COMPANY_PLANS.filter(
        (cp) =>
          !periodReports.some(
            (r) =>
              r.userId === u.id &&
              r.periodType === "month" &&
              r.periodKey === month &&
              r.companyPlanId === cp.id &&
              (r.planText || "").trim() &&
              (r.doneText || "").trim()
          )
      ).length;
      if (monthGap > 0) {
        todos.push({
          id: "td_m_" + u.id,
          type: "任务月报",
          title: "完成本月任务月报填写（缺口 " + monthGap + "/" + COMPANY_PLANS.length + "）",
          userId: u.id,
          month,
          status: "待办",
          priority: "P1",
          dueDate: "2026-08-29",
        });
      }
    });

    taskItems.filter(taskShouldEnterTodo).forEach((t) => {
      if (urgedTaskIds.has(t.id)) return;
      const overdue = isTaskOverdue(t);
      todos.push({
        id: "td_t_" + t.id,
        type: "任务",
        title: t.name,
        userId: t.ownerId,
        taskId: t.id,
        status: overdue ? "逾期" : "待办",
        priority: t.priority || "P2",
        dueDate: t.deadline || "",
        refLabel: t.dept || "",
      });
    });

    superviseItems
      .filter((m) => m.status !== "已完成")
      .forEach((m) => {
        const overdue = m.endDate && m.endDate < DEMO_TODAY;
        const due = m.endDate || "";
        todos.push({
          id: "td_sv_" + m.id,
          type: "任务督办",
          title: m.title,
          userId: m.ownerId,
          superviseId: m.id,
          meetingId: m.id,
          status: overdue ? "逾期" : m.status === "进行中" ? "待办" : "待办",
          priority: m.priority || "P1",
          dueDate: due,
          week: m.week,
          refLabel: m.helper ? "配合：" + m.helper : "计划外",
        });
        (m.helperIds || []).forEach((hid) => {
          if (!hid || hid === m.ownerId) return;
          todos.push({
            id: "td_svh_" + m.id + "_" + hid,
            type: "督办配合",
            title: "配合督办：" + m.title,
            userId: hid,
            superviseId: m.id,
            meetingId: m.id,
            status: overdue ? "逾期" : "待办",
            priority: m.priority || "P1",
            dueDate: due,
            week: m.week,
            refLabel: "计划外",
          });
        });
      });

    urges
      .filter((u) => u.status === "待回复")
      .forEach((u) => {
        const overdue = u.expectReplyDate && u.expectReplyDate < DEMO_TODAY;
        const noteHint = (u.note || "").trim();
        todos.push({
          id: "td_ug_" + u.id,
          type: "催办回复",
          title: u.title,
          userId: u.targetUserId,
          urgeId: u.id,
          taskId: u.taskId || "",
          status: overdue ? "逾期" : "待办",
          priority: "P0",
          dueDate: u.expectReplyDate || "",
          expectReplyDate: u.expectReplyDate,
          urgeNote: noteHint,
          createdBy: u.createdBy || "",
          refLabel:
            (u.dept ? u.dept + " · " : "") +
            (u.expectReplyDate ? "期望回复 " + u.expectReplyDate : "") +
            (noteHint ? " · " + (noteHint.length > 18 ? noteHint.slice(0, 18) + "…" : noteHint) : ""),
        });
      });

    urges
      .filter((u) => u.status === "已回复")
      .forEach((u) => {
        const overduePromise = u.replyPromiseDate && u.replyPromiseDate < DEMO_TODAY;
        const creatorId = u.createdBy || "u_gm";
        todos.push({
          id: "td_ug_re_" + u.id,
          type: "催办复检",
          title: (overduePromise ? "【承诺日已过】" : "【待复检】") + u.title,
          userId: creatorId,
          urgeId: u.id,
          status: overduePromise ? "逾期" : "待办",
          priority: "P0",
          dueDate: u.replyPromiseDate || u.expectReplyDate || "",
          expectReplyDate: u.expectReplyDate,
          urgeNote: (u.note || "").trim(),
          createdBy: creatorId,
          refLabel: "承诺日 " + (u.replyPromiseDate || "—"),
        });
      });

    planItems.forEach((p) => {
      const st = resolvePlanStatus(p);
      if (planNeedsOwnerTodo(p) && p.ownerId) {
        todos.push({
          id: "td_po_" + p.id,
          type: "计划推进",
          title: (st === "延期" ? "【延期】" : "【临期】") + p.name,
          userId: p.ownerId,
          planId: p.id,
          status: st === "延期" ? "逾期" : "待办",
          priority: p.priority || "P1",
          dueDate: p.endDate || "",
          refLabel: p.dept || "",
        });
      }
      if (!planNeedsHelperTodo(p)) return;
      (p.helperIds || []).forEach((hid) => {
        if (!hid || hid === p.ownerId) return;
        todos.push({
          id: "td_ph_" + p.id + "_" + hid,
          type: "计划配合",
          title: "配合计划：" + p.name,
          userId: hid,
          planId: p.id,
          status: st === "延期" ? "逾期" : "待办",
          priority: p.priority || "P1",
          dueDate: p.endDate || "",
          refLabel: p.dept || "",
        });
      });
    });
    persistDemoData();
  }

  /** 演示数据持久化：切换角色/刷新后保留编辑结果 */
  const DATA_KEY = "bms_v4_demo_data";
  const DATA_VER = 8;

  function deepClone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function replaceArrayContents(target, source) {
    target.length = 0;
    (source || []).forEach((item) => target.push(deepClone(item)));
  }

  const SEED_SNAPSHOT = {
    companyPlans: deepClone(COMPANY_PLANS),
    planItems: deepClone(planItems),
    taskItems: deepClone(taskItems),
    periodReports: deepClone(periodReports),
    planChangeLogs: deepClone(planChangeLogs),
    taskChangeLogs: deepClone(taskChangeLogs),
    superviseItems: deepClone(superviseItems),
    meetingMinutes: deepClone(meetingMinutes),
    urges: deepClone(urges),
    todoArchive: deepClone(todoArchive),
  };

  function applySnapshot(snap) {
    replaceArrayContents(COMPANY_PLANS, snap.companyPlans);
    planItems = deepClone(snap.planItems || []);
    taskItems = deepClone(snap.taskItems || []);
    periodReports = deepClone(snap.periodReports || []);
    planChangeLogs = deepClone(snap.planChangeLogs || []);
    taskChangeLogs = deepClone(snap.taskChangeLogs || []);
    superviseItems = deepClone(snap.superviseItems || []);
    meetingMinutes = deepClone(snap.meetingMinutes || []).map(normalizeMeetingMinute);
    urges = deepClone(snap.urges || []);
    todoArchive = deepClone(snap.todoArchive || []);
  }

  function persistDemoData() {
    if (!persistReady) return;
    try {
      localStorage.setItem(
        DATA_KEY,
        JSON.stringify({
          v: DATA_VER,
          companyPlans: COMPANY_PLANS,
          planItems,
          taskItems,
          periodReports,
          planChangeLogs,
          taskChangeLogs,
          superviseItems,
          meetingMinutes,
          urges,
          todoArchive,
        })
      );
    } catch (e) {
      /* ignore quota / private mode */
    }
  }

  function demoNowStamp() {
    return DEMO_TODAY + " " + new Date().toTimeString().slice(0, 5);
  }

  function currentOperatorName() {
    try {
      const id = localStorage.getItem("bms_v4_role") || "u_gm";
      const u = userById(id);
      return u ? u.name : "系统";
    } catch (e) {
      return "系统";
    }
  }

  function attachNamesLabel(list) {
    const names = normalizeAttachments(list).map((a) => a.name);
    return names.length ? names.join("、") : "—";
  }

  function appendTaskChangeLog(payload) {
    const item = {
      id: "tcl_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      taskId: payload.taskId,
      at: payload.at || demoNowStamp(),
      operator: payload.operator || currentOperatorName(),
      field: payload.field || "变更",
      from: payload.from != null && payload.from !== "" ? String(payload.from) : "—",
      to: payload.to != null && payload.to !== "" ? String(payload.to) : "—",
      note: payload.note || "",
    };
    taskChangeLogs = [item, ...taskChangeLogs];
    persistDemoData();
    return item;
  }

  function logTaskFieldDiffs(prev, next) {
    if (!prev || !next) return;
    const pairs = [
      { field: "名称", from: prev.name, to: next.name },
      { field: "优先级", from: prev.priority, to: next.priority },
      {
        field: "处理人",
        from: (userById(prev.ownerId) || {}).name || prev.ownerId || "—",
        to: (userById(next.ownerId) || {}).name || next.ownerId || "—",
      },
      { field: "状态", from: prev.status, to: next.status },
      { field: "任务类型", from: prev.taskType, to: next.taskType },
      { field: "开始日", from: taskStartDate(prev), to: taskStartDate(next) },
      { field: "结束日", from: taskEndDate(prev), to: taskEndDate(next) },
      { field: "备注", from: prev.remark || "", to: next.remark || "" },
      { field: "完成情况说明", from: prev.completionNote || "", to: next.completionNote || "" },
      { field: "附件", from: attachNamesLabel(prev.attachments), to: attachNamesLabel(next.attachments) },
      {
        field: "关联计划",
        from: prev.annualId ? (planById(prev.annualId) || {}).name || prev.annualId : "—",
        to: next.annualId ? (planById(next.annualId) || {}).name || next.annualId : "—",
      },
      {
        field: "上级任务",
        from: prev.parentId
          ? (taskItems.find((x) => x.id === prev.parentId) || {}).name || prev.parentId
          : "—",
        to: next.parentId
          ? (taskItems.find((x) => x.id === next.parentId) || {}).name || next.parentId
          : "—",
      },
    ];
    pairs.forEach((p) => {
      const a = p.from == null || p.from === "" ? "—" : String(p.from);
      const b = p.to == null || p.to === "" ? "—" : String(p.to);
      if (a === b) return;
      appendTaskChangeLog({ taskId: next.id, field: p.field, from: a, to: b });
    });
  }

  function loadDemoData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw);
      if (!d || d.v !== DATA_VER) return false;
      if (!Array.isArray(d.companyPlans) || !Array.isArray(d.planItems) || !Array.isArray(d.taskItems)) {
        return false;
      }
      applySnapshot(d);
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetDemoData() {
    applySnapshot(SEED_SNAPSHOT);
    syncAllPlanStatuses();
    persistReady = true;
    rebuildTodos();
    persistDemoData();
    return { ok: true };
  }

  function hasPersistedDemoData() {
    try {
      return !!localStorage.getItem(DATA_KEY);
    } catch (e) {
      return false;
    }
  }

  loadDemoData();
  syncAllPlanStatuses();
  rebuildTodos();
  persistReady = true;
  persistDemoData();

  const KEY = "bms_v4_role";

  const Store = {
    USERS,
    DEPTS,
    COMPANY_PLANS,
    updateCompanyPlan(id, patch) {
      const i = COMPANY_PLANS.findIndex((c) => c.id === id);
      if (i < 0) return { ok: false, reason: "公司计划不存在" };
      const next = { ...COMPANY_PLANS[i], ...patch };
      if (next.progressPct != null) next.progressPct = clampPct(next.progressPct);
      COMPANY_PLANS[i] = next;
      persistDemoData();
      return { ok: true, item: next };
    },
    removeCompanyPlan(id) {
      const i = COMPANY_PLANS.findIndex((c) => c.id === id);
      if (i < 0) return { ok: false, reason: "公司计划不存在" };
      const kids = planItems.filter((p) => p.companyPlanId === id);
      if (kids.length) return { ok: false, reason: "请先删除其下部门计划（共 " + kids.length + " 条）" };
      COMPANY_PLANS.splice(i, 1);
      planChangeLogs = planChangeLogs.filter((x) => x.refId !== id);
      rebuildTodos();
      persistDemoData();
      return { ok: true };
    },
    persistDemoData,
    resetDemoData,
    hasPersistedDemoData,
    get PLAN_ITEMS() {
      return planItems;
    },
    /** @deprecated 兼容旧引用，等同 PLAN_ITEMS */
    get ANNUAL_ITEMS() {
      return planItems;
    },
    get taskItems() {
      return taskItems;
    },
    set taskItems(v) {
      taskItems = v;
      persistDemoData();
    },
    get periodReports() {
      return periodReports;
    },
    /** 兼容旧周报视角：映射为 weekReports 形态 */
    get weekReports() {
      return periodReports
        .filter((r) => r.periodType === "week")
        .map((r) => ({
          userId: r.userId,
          week: r.periodKey,
          companyPlanId: r.companyPlanId,
          lastSummary: r.doneText,
          nextOverview: r.planText,
          progressPct: r.progressPct,
        }));
    },
    getPeriodReport(userId, periodType, periodKey, companyPlanId) {
      return periodReports.find(
        (r) =>
          r.userId === userId &&
          r.periodType === periodType &&
          r.periodKey === periodKey &&
          r.companyPlanId === companyPlanId
      );
    },
    savePeriodReport(report) {
      periodReports = periodReports.filter(
        (r) =>
          !(
            r.userId === report.userId &&
            r.periodType === report.periodType &&
            r.periodKey === report.periodKey &&
            r.companyPlanId === report.companyPlanId
          )
      );
      periodReports.push({
        userId: report.userId,
        periodType: report.periodType,
        periodKey: report.periodKey,
        companyPlanId: report.companyPlanId,
        planText: report.planText || "",
        doneText: report.doneText || "",
        progressPct: Number(report.progressPct) || 0,
        attachments: Array.isArray(report.attachments) ? report.attachments : [],
      });
      rebuildTodos();
    },
    get superviseItems() {
      return superviseItems;
    },
    /** @deprecated 兼容旧引用，等同 superviseItems */
    get meetingTodos() {
      return superviseItems;
    },
    helperNamesOf,
    get todoArchive() {
      return todoArchive;
    },
    recentTodoArchive(userId, days) {
      const n = days != null ? days : 7;
      const from = parseDay(DEMO_TODAY);
      if (!from) return [];
      from.setDate(from.getDate() - n);
      const fromStr =
        from.getFullYear() +
        "-" +
        String(from.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(from.getDate()).padStart(2, "0");
      return todoArchive.filter((x) => x.userId === userId && x.doneAt >= fromStr);
    },
    addSuperviseTask(payload) {
      if (!payload || !String(payload.title || "").trim()) {
        return { ok: false, reason: "请填写督办事项" };
      }
      if (!payload.ownerId) return { ok: false, reason: "请选择责任人" };
      const owner = userById(payload.ownerId);
      if (!owner) return { ok: false, reason: "责任人不存在" };
      const startDate = payload.startDate || DEMO_TODAY;
      const endDate = payload.endDate || payload.deadline || "";
      if (endDate && startDate && endDate < startDate) {
        return { ok: false, reason: "结束时间不能早于开始时间" };
      }
      const helperIds = Array.isArray(payload.helperIds)
        ? payload.helperIds.filter((id) => id && id !== payload.ownerId)
        : [];
      const item = normalizeSupervise({
        id: "sv_" + Date.now(),
        title: String(payload.title).trim(),
        ownerId: payload.ownerId,
        helperIds,
        week: payload.week || "2026-W34",
        status: "待办",
        priority: payload.priority || "P1",
        startDate,
        endDate,
        creatorId: payload.creatorId || "",
        note: payload.note || "",
        createdAt: DEMO_TODAY,
      });
      superviseItems = [item, ...superviseItems];
      rebuildTodos();
      return { ok: true, item };
    },
    updateSuperviseTask(id, patch) {
      const prev = superviseItems.find((x) => x.id === id);
      if (!prev) return { ok: false, reason: "督办不存在" };
      const nextPatch = { ...patch };
      if (nextPatch.helperIds) {
        nextPatch.helperIds = nextPatch.helperIds.filter((hid) => hid && hid !== (nextPatch.ownerId || prev.ownerId));
      }
      superviseItems = superviseItems.map((x) =>
        x.id === id ? normalizeSupervise({ ...x, ...nextPatch }) : x
      );
      rebuildTodos();
      return { ok: true, item: superviseItems.find((x) => x.id === id) };
    },
    completeSuperviseTodo(id) {
      const m = superviseItems.find((x) => x.id === id);
      if (!m) return { ok: false, reason: "督办不存在" };
      if (m.status === "已完成") return { ok: true };
      superviseItems = superviseItems.map((x) => (x.id === id ? normalizeSupervise({ ...x, status: "已完成" }) : x));
      pushTodoArchive({
        id: "td_sv_" + id,
        type: "任务督办",
        title: m.title,
        userId: m.ownerId,
        priority: m.priority || "P1",
      });
      rebuildTodos();
      return { ok: true };
    },
    removeSuperviseTask(id) {
      const m = superviseItems.find((x) => x.id === id);
      if (!m) return { ok: false, reason: "督办不存在" };
      superviseItems = superviseItems.filter((x) => x.id !== id);
      rebuildTodos();
      return { ok: true };
    },
    MEETING_TYPES,
    get meetingMinutes() {
      return meetingMinutes;
    },
    getMeetingMinuteByWeek(week) {
      return (
        meetingMinutes.find((x) => x.meetingType === "周例会" && (x.periodKey === week || x.week === week)) ||
        null
      );
    },
    getMeetingMinuteById(id) {
      return meetingMinutes.find((x) => x.id === id) || null;
    },
    /** 演示环境「当前自然周」 */
    getCurrentWeek() {
      return "2026-W34";
    },
    listMeetingWeeks() {
      const set = new Set(
        meetingMinutes.filter((x) => x.meetingType === "周例会").map((x) => x.periodKey || x.week)
      );
      set.add(this.getCurrentWeek());
      ["2026-W33", "2026-W32"].forEach((w) => set.add(w));
      return [...set].sort((a, b) => b.localeCompare(a));
    },
    listMeetingMinutes() {
      const typeOrder = { 周例会: 0, 月例会: 1, 总经理办公会: 2 };
      return meetingMinutes.slice().sort((a, b) => {
        const pk = String(b.periodKey || "").localeCompare(String(a.periodKey || ""));
        if (pk) return pk;
        return (typeOrder[a.meetingType] || 9) - (typeOrder[b.meetingType] || 9);
      });
    },
    upsertMeetingMinute(payload) {
      const actor = userById(payload.updatedBy) || this.getRoleUser();
      if (!actor || actor.role !== "计划管理员") {
        return { ok: false, reason: "仅计划管理员可维护会议纪要" };
      }
      const meetingType = MEETING_TYPES.includes(payload.meetingType) ? payload.meetingType : "周例会";
      const periodKey =
        payload.periodKey ||
        payload.week ||
        (meetingType === "月例会" ? "2026-08" : meetingType === "总经理办公会" ? DEMO_TODAY : "2026-W34");
      const existing = payload.id
        ? meetingMinutes.find((x) => x.id === payload.id)
        : meetingType === "周例会"
          ? meetingMinutes.find((x) => x.meetingType === "周例会" && x.periodKey === periodKey)
          : null;
      const item = normalizeMeetingMinute({
        id: existing ? existing.id : payload.id || "mm_" + Date.now(),
        meetingType,
        periodKey,
        week: meetingType === "周例会" ? periodKey : "",
        summary: payload.summary || "",
        relatedUserIds: payload.relatedUserIds,
        attachments: payload.attachments,
        updatedAt: demoNowStamp(),
        updatedBy: actor.id,
      });
      if (existing) {
        meetingMinutes = meetingMinutes.map((x) => (x.id === existing.id ? item : x));
      } else {
        meetingMinutes = [item, ...meetingMinutes];
      }
      persistDemoData();
      return { ok: true, item };
    },
    /** @deprecated 兼容旧调用 */
    completeMeetingTodo(id) {
      return this.completeSuperviseTodo(id);
    },
    completeTaskFromTodo(taskId) {
      const t = taskItems.find((x) => x.id === taskId);
      if (!t) return { ok: false, reason: "任务不存在" };
      if (t.status === "已完成" || t.status === "已关闭") return { ok: true };
      const pending = urges.find((u) => u.status === "待回复" && u.taskId === taskId);
      if (pending) {
        return {
          ok: false,
          reason: "该任务有待回复催办，请先在「催办往来」提交原因/措施/承诺日（改任务状态不等于回复催办）",
          urgeId: pending.id,
        };
      }
      taskItems = taskItems.map((x) => (x.id === taskId ? { ...x, status: "已完成" } : x));
      pushTodoArchive({
        id: "td_t_" + taskId,
        type: "任务",
        title: t.name,
        userId: t.ownerId,
        priority: t.priority || "P2",
      });
      rebuildTodos();
      return { ok: true };
    },
    get todos() {
      return todos;
    },
    userById,
    planById,
    annualById: planById,
    plansForDept,
    planChildren,
    planDescendantIds,
    planPathLabel,
    /** 关键节点变更记录：按计划 id 取，新→旧 */
    getPlanChangeLogs(refId) {
      return planChangeLogs
        .filter((x) => x.refId === refId)
        .slice()
        .sort((a, b) => String(b.at).localeCompare(String(a.at)));
    },
    appendPlanChangeLog(payload) {
      const item = {
        id: "pcl_" + Date.now(),
        refId: payload.refId,
        refKind: payload.refKind || "dept",
        at: payload.at || "2026-08-18 12:00",
        operator: payload.operator || "系统",
        field: payload.field || "变更",
        from: payload.from != null ? String(payload.from) : "—",
        to: payload.to != null ? String(payload.to) : "—",
        note: payload.note || "",
      };
      planChangeLogs = [item, ...planChangeLogs];
      persistDemoData();
      return item;
    },
    rebuildTodos,
    getRoleUser() {
      const id = localStorage.getItem(KEY) || "u_gm";
      return userById(id) || USERS[0];
    },
    setRoleUser(id) {
      localStorage.setItem(KEY, id);
    },
    /** 计划管理员：跨部门维护全部计划/任务 */
    isPlanAdmin(user) {
      const u = user || this.getRoleUser();
      return !!(u && u.role === "计划管理员");
    },
    /** 管理员视角：总经理或计划管理员（全菜单 / 经营台） */
    isAdmin(user) {
      const u = user || this.getRoleUser();
      return !!(u && (u.role === "总经理" || u.role === "计划管理员"));
    },
    /** 可全量浏览计划树（总经理只读 / 计划管理员可编） */
    canViewAllPlans(user) {
      return this.isAdmin(user);
    },
    /** 部门计划可编辑：部门长（本部门）或计划管理员（全量） */
    canEditPlans(user) {
      const u = user || this.getRoleUser();
      return !!(u && (u.role === "部门长" || u.role === "计划管理员"));
    },
    tasksForUser(userId) {
      return taskItems.filter((t) => t.ownerId === userId);
    },
    tasksForDept(dept) {
      return taskItems.filter((t) => t.dept === dept);
    },
    countByStatus(list) {
      const c = { 未开始: 0, 进行中: 0, 已完成: 0, 已关闭: 0, 延期: 0, total: list.length, hours: 0 };
      list.forEach((t) => {
        if (c[t.status] !== undefined) c[t.status]++;
        c.hours += Number(t.actualHours) || 0;
      });
      return c;
    },
    addPlan(payload) {
      const id = "p_" + Date.now();
      const parent = payload.parentId ? planById(payload.parentId) : null;
      const dept = payload.dept || (parent ? parent.dept : "");
      const actor = this.getRoleUser && this.getRoleUser();
      const item = normalizePlan({
        id,
        name: payload.name,
        dept,
        companyPlanId: payload.companyPlanId || (parent ? parent.companyPlanId : "") || "",
        parentId: payload.parentId || null,
        status: payload.status || "未开始",
        progress: payload.progress || "",
        priority: payload.priority || (parent && parent.priority) || "P1",
        ownerId: payload.ownerId || (parent && parent.ownerId) || deptHeadId(dept),
        helperIds: payload.helperIds || (parent ? [...(parent.helperIds || [])] : []),
        startDate: payload.startDate || (parent && parent.startDate) || "",
        endDate: payload.endDate || (parent && parent.endDate) || "",
        progressPct: payload.progressPct != null ? payload.progressPct : 0,
        creatorId: payload.creatorId || (actor && actor.id) || "",
        creatorDept: payload.creatorDept || (actor && actor.dept) || "",
      });
      planItems = [...planItems, item];
      rebuildTodos();
      return item;
    },
    updatePlan(id, patch) {
      planItems = planItems.map((p) => (p.id === id ? normalizePlan({ ...p, ...patch }) : p));
      rebuildTodos();
    },
    removePlan(id) {
      const kids = planChildren(id);
      if (kids.length) return { ok: false, reason: "请先删除或移走子计划" };
      const tasks = taskItems.filter((t) => t.annualId === id);
      if (tasks.length) return { ok: false, reason: "该计划下仍有关联任务，无法删除" };
      planItems = planItems.filter((p) => p.id !== id);
      rebuildTodos();
      return { ok: true };
    },
    resolvePlanStatus,
    isPlanOverdue,
    isPlanNearDue,
    clampPct,
    isTempTask,
    addAssignTask(payload) {
      const id = "t_" + Date.now();
      const owner = userById(payload.ownerId);
      if (!owner) return null;
      const today = "2026-08-18";
      const startDate = payload.startDate || today;
      const endDate = payload.endDate || payload.deadline || "2026-08-31";
      const kind = payload.taskKind === "临时" || !payload.annualId ? "临时" : "计划";
      const actor = this.getRoleUser && this.getRoleUser();
      const item = normalizeTaskDates({
        id,
        name: payload.name,
        annualId: kind === "临时" ? "" : payload.annualId,
        taskKind: kind,
        week: payload.week || "2026-W34",
        ownerId: payload.ownerId,
        status: "未开始",
        source: payload.source || "下达",
        dept: payload.dept || owner.dept,
        parentId: kind === "临时" ? null : payload.parentId || null,
        taskType: payload.taskType || (kind === "临时" ? "其他" : "其他"),
        priority: payload.priority || "P1",
        remark: payload.remark || "",
        completionNote: payload.completionNote || "",
        attachments: normalizeAttachments(payload.attachments),
        startDate,
        endDate,
        deadline: endDate,
        createdAt: today,
        creatorId: payload.creatorId || (actor && actor.id) || "",
        creatorDept: payload.creatorDept || (actor && actor.dept) || "",
      });
      taskItems = [item, ...taskItems];
      appendTaskChangeLog({
        taskId: id,
        field: "新建任务",
        from: "—",
        to: item.name,
        note: kind === "临时" ? (item.source === "下达" ? "下达临时任务" : "自建临时任务") : item.source === "下达" ? "下达关联计划任务" : "自建关联计划任务",
      });
      rebuildTodos();
      return item;
    },
    removeTask(id) {
      const t = taskItems.find((x) => x.id === id);
      if (!t) return { ok: false, reason: "任务不存在" };
      const kids = taskItems.filter((x) => x.parentId === id);
      if (kids.length) return { ok: false, reason: "请先删除其下子任务（共 " + kids.length + " 条）" };
      taskItems = taskItems.filter((x) => x.id !== id);
      taskChangeLogs = taskChangeLogs.filter((x) => x.taskId !== id);
      rebuildTodos();
      return { ok: true };
    },
    updateTask(id, patch) {
      const prev = taskItems.find((t) => t.id === id);
      if (!prev) return { ok: false, reason: "任务不存在" };
      if (
        patch &&
        (patch.status === "已完成" || patch.status === "已关闭") &&
        taskOpen(prev)
      ) {
        const pending = urges.find((u) => u.status === "待回复" && u.taskId === id);
        if (pending) {
          return {
            ok: false,
            reason: "该任务有待回复催办，请先回复催办后再改任务完成状态",
            urgeId: pending.id,
          };
        }
      }
      taskItems = taskItems.map((t) => {
        if (t.id !== id) return t;
        const merged = { ...t, ...patch };
        if (patch.endDate != null && patch.deadline == null) merged.deadline = patch.endDate;
        if (patch.deadline != null && patch.endDate == null) merged.endDate = patch.deadline;
        return normalizeTaskDates(merged);
      });
      const next = taskItems.find((t) => t.id === id);
      if (prev && next) logTaskFieldDiffs(prev, next);
      if (
        prev &&
        next &&
        taskOpen(prev) &&
        (next.status === "已完成" || next.status === "已关闭")
      ) {
        pushTodoArchive({
          id: "td_t_" + id,
          type: "任务",
          title: next.name,
          userId: next.ownerId,
          priority: next.priority || "P2",
        });
      }
      rebuildTodos();
      return { ok: true };
    },
    getTaskChangeLogs(taskId) {
      return taskChangeLogs
        .filter((x) => x.taskId === taskId)
        .slice()
        .sort((a, b) => String(b.at).localeCompare(String(a.at)));
    },
    appendTaskChangeLog,
    DEMO_TODAY,
    /** @deprecated 请用 getNearDueDays()；保留兼容读配置 */
    get NEAR_DUE_DAYS() {
      return getNearDueDays();
    },
    getBasicConfig,
    getNearDueDays,
    saveBasicConfig,
    BASIC_CONFIG_DEFAULTS,
    get urges() {
      return urges;
    },
    isTaskOverdue,
    isTaskNearDue,
    taskWorkHours,
    workHoursByRange,
    taskStartDate,
    taskEndDate,
    WORKDAY_HOURS,
    taskFinishRate,
    /** ISO 周年份周 → 演示月键（如 2026-W34 → 2026-08） */
    monthFromWeek(week) {
      const m = String(week || "").match(/^(\d{4})-W(\d+)$/);
      if (!m) return String(DEMO_TODAY || "2026-08-18").slice(0, 7);
      const y = Number(m[1]);
      const w = Number(m[2]);
      // 演示数据：2026-W32~W35 落在 8 月；其余按周序粗算
      if (y === 2026 && w >= 32 && w <= 35) return "2026-08";
      if (y === 2026 && w >= 18 && w <= 22) return "2026-05";
      const approxMonth = Math.min(12, Math.max(1, Math.ceil((w * 7) / 30.5)));
      return y + "-" + String(approxMonth).padStart(2, "0");
    },
    /**
     * 部门长任务周报/月报填报缺口（按公司计划条数计）
     * @param {"week"|"month"} periodType
     * @param {string} periodKey 如 2026-W34 / 2026-08
     */
    listDeptReportGaps(periodType, periodKey) {
      const total = COMPANY_PLANS.length;
      return USERS.filter((u) => u.role === "部门长")
        .map((u) => {
          const missing = COMPANY_PLANS.filter(
            (cp) =>
              !periodReports.some(
                (r) =>
                  r.userId === u.id &&
                  r.periodType === periodType &&
                  r.periodKey === periodKey &&
                  r.companyPlanId === cp.id &&
                  (r.planText || "").trim() &&
                  (r.doneText || "").trim()
              )
          );
          return {
            ownerId: u.id,
            dept: u.dept,
            periodType,
            periodKey,
            missingCount: missing.length,
            total,
            missingNames: missing.map((cp) => cp.name),
          };
        })
        .filter((x) => x.missingCount > 0)
        .sort((a, b) => b.missingCount - a.missingCount || a.dept.localeCompare(b.dept, "zh"));
    },
    /** 公司计划进度：各部门任务完成率简单平均 */
    companyPlanDeptMatrix() {
      return COMPANY_PLANS.map((cp) => {
        const cells = DEPTS.map((dept) => {
          const plans = planItems.filter((p) => p.companyPlanId === cp.id && p.dept === dept);
          const planIds = new Set();
          plans.forEach((p) => planDescendantIds(p.id).forEach((id) => planIds.add(id)));
          plans.forEach((p) => planIds.add(p.id));
          const ts = taskItems.filter((t) => planIds.has(t.annualId));
          const rate = taskFinishRate(ts);
          const late = ts.filter(isTaskOverdue).length;
          const head = USERS.find((u) => u.dept === dept && u.role === "部门长");
          const weekFilled = head
            ? periodReports.some(
                (r) =>
                  r.userId === head.id &&
                  r.periodType === "week" &&
                  r.periodKey === "2026-W34" &&
                  r.companyPlanId === cp.id &&
                  (r.planText || "").trim()
              )
            : false;
          return {
            dept,
            planNodes: plans.length,
            taskTotal: ts.length,
            taskRate: rate,
            late,
            weekFilled,
            ownerId: head ? head.id : "",
          };
        });
        const withTasks = cells.filter((c) => c.taskTotal > 0);
        const avgRate = withTasks.length
          ? Math.round((withTasks.reduce((s, c) => s + c.taskRate, 0) / withTasks.length) * 10) / 10
          : 0;
        return {
          companyPlan: cp,
          cells,
          avgRate,
          lateTotal: cells.reduce((s, c) => s + c.late, 0),
        };
      });
    },
    createUrge(payload) {
      if (!payload.expectReplyDate) return { ok: false, reason: "必须填写期望回复日" };
      if (!payload.targetUserId) return { ok: false, reason: "缺少催办对象" };
      const note = (payload.note || "").trim();
      if (!note) return { ok: false, reason: "必须填写要求说明（接收人可见）" };
      const dup = urges.find(
        (u) =>
          u.status === "待回复" &&
          u.targetUserId === payload.targetUserId &&
          ((payload.taskId && u.taskId === payload.taskId) ||
            (!payload.taskId && u.title === (payload.title || "请尽快处理落实事项")))
      );
      if (dup && !payload.force) {
        return { ok: false, reason: "该对象已有待回复催办，可在催办跟踪中「再次催办」", dupId: dup.id };
      }
      const actor = this.getRoleUser();
      const id = "ug_" + Date.now();
      const target = userById(payload.targetUserId);
      const item = {
        id,
        targetUserId: payload.targetUserId,
        title: payload.title || "请尽快处理落实事项",
        note,
        expectReplyDate: payload.expectReplyDate,
        taskId: payload.taskId || "",
        planId: payload.planId || "",
        companyPlanId: payload.companyPlanId || "",
        dept: payload.dept || (target ? target.dept : ""),
        exceptionType: payload.exceptionType || "",
        status: "待回复",
        createdAt: DEMO_TODAY,
        createdBy: (actor && actor.id) || "u_gm",
        replyReason: "",
        replyRemedy: "",
        replyPromiseDate: "",
        repliedAt: "",
        noteHistory: [],
        rejectNote: "",
        parentUrgeId: payload.parentUrgeId || "",
      };
      urges = [item, ...urges];
      rebuildTodos();
      return { ok: true, item };
    },
    /** 再次催办：刷新期望回复日；要求说明原文保留，补充说明追加到 noteHistory */
    renewUrge(id, expectReplyDate, note) {
      const u = urges.find((x) => x.id === id);
      if (!u) return { ok: false, reason: "催办不存在" };
      if (u.status !== "待回复") return { ok: false, reason: "仅待回复催办可再次催办" };
      if (!expectReplyDate) return { ok: false, reason: "必须填写期望回复日" };
      const tip = (note || "").trim() || "再次催办：请于新期望日前回复";
      const actor = this.getRoleUser();
      const hist = Array.isArray(u.noteHistory) ? u.noteHistory.slice() : [];
      hist.push({ at: DEMO_TODAY, kind: "renew", text: tip, by: (actor && actor.id) || "" });
      urges = urges.map((x) =>
        x.id === id
          ? {
              ...x,
              expectReplyDate,
              noteHistory: hist,
              renewedAt: DEMO_TODAY,
            }
          : x
      );
      rebuildTodos();
      return { ok: true };
    },
    /** 复检退回：重新进入待回复；退回说明追加历史，不覆盖原要求说明 */
    rejectUrge(id, reason) {
      const u = urges.find((x) => x.id === id);
      if (!u) return { ok: false, reason: "催办不存在" };
      if (u.status !== "已回复") return { ok: false, reason: "仅已回复催办可退回" };
      const actor = this.getRoleUser();
      if (u.createdBy && actor && actor.id !== u.createdBy && !this.isAdmin(actor)) {
        return { ok: false, reason: "仅发起人或管理员可复检退回" };
      }
      const tip = (reason || "复检未通过，请补充措施").trim();
      const hist = Array.isArray(u.noteHistory) ? u.noteHistory.slice() : [];
      hist.push({ at: DEMO_TODAY, kind: "reject", text: tip, by: (actor && actor.id) || "" });
      urges = urges.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "待回复",
              rejectNote: tip,
              noteHistory: hist,
              replyReason: "",
              replyRemedy: "",
              replyPromiseDate: "",
              repliedAt: "",
            }
          : x
      );
      rebuildTodos();
      return { ok: true };
    },
    /** @deprecated 兼容旧调用：自动补期望回复日与要求说明 */
    urge(userId, title) {
      const d = parseDay(DEMO_TODAY);
      d.setDate(d.getDate() + getNearDueDays());
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return this.createUrge({
        targetUserId: userId,
        title: title || "请尽快处理逾期/临期事项",
        note: "请按催办要求反馈原因、措施与承诺日期。",
        expectReplyDate: y + "-" + m + "-" + day,
      });
    },
    replyUrge(id, payload) {
      const u = urges.find((x) => x.id === id);
      if (!u) return { ok: false, reason: "催办不存在" };
      if (u.status !== "待回复") return { ok: false, reason: "该催办已回复或已闭环" };
      const actor = this.getRoleUser();
      if (!actor || actor.id !== u.targetUserId) {
        return { ok: false, reason: "仅催办对象本人可提交回复" };
      }
      if (!(payload.replyReason || "").trim()) return { ok: false, reason: "请填写原因" };
      if (!(payload.replyRemedy || "").trim()) return { ok: false, reason: "请填写补救措施" };
      if (!payload.replyPromiseDate) return { ok: false, reason: "请填写新承诺日期" };
      urges = urges.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "已回复",
              replyReason: payload.replyReason.trim(),
              replyRemedy: payload.replyRemedy.trim(),
              replyPromiseDate: payload.replyPromiseDate,
              repliedAt: DEMO_TODAY,
              rejectNote: "",
            }
          : x
      );
      rebuildTodos();
      return { ok: true };
    },
    closeUrge(id) {
      const u = urges.find((x) => x.id === id);
      if (!u) return { ok: false, reason: "催办不存在" };
      if (u.status !== "已回复") return { ok: false, reason: "仅「已回复」催办可由发起人复检闭环" };
      const actor = this.getRoleUser();
      if (u.createdBy && actor && actor.id !== u.createdBy && !this.isAdmin(actor)) {
        return { ok: false, reason: "仅发起人或管理员可确认闭环" };
      }
      urges = urges.map((x) => (x.id === id ? { ...x, status: "已闭环", closedAt: DEMO_TODAY } : x));
      rebuildTodos();
      return { ok: true };
    },
    /** 禁止手改催办状态；仅回复/复检/退回/再次催办驱动 */
    setUrgeStatus() {
      return { ok: false, reason: "催办状态不可手改，请走回复或复检流程" };
    },
    getUrge(id) {
      return urges.find((x) => x.id === id);
    },
    pendingUrgeForTask(taskId) {
      if (!taskId) return null;
      return urges.find((u) => u.status === "待回复" && u.taskId === taskId) || null;
    },
    completeTodo(id) {
      todos = todos.filter((t) => t.id !== id);
    },
  };

  global.BMS4 = Store;
})(window);
