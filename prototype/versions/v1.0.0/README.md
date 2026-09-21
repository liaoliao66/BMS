# v1.0.0 原型（精简重做）

侧栏菜单：

| 分组 | 菜单 | 页面 |
|------|------|------|
| 经营清单 | 目标管理 | `pages/年度目标_page.html` |
| 经营清单 | 计划管理 | `pages/月度计划_page.html` |
| 经营清单 | 任务管理 | `pages/周工作任务_page.html` |
| 经营清单 | 工作督办 | `pages/任务督办_page.html` |
| 催办与配置 | 催办提醒 | `pages/催办提醒_page.html` |
| 催办与配置 | 使用范围 | `pages/基础配置_使用范围_page.html` |
| 催办与配置 | 消息配置 | `pages/基础配置_消息配置_page.html` |

入口：`index.html`  

共享数据：`assets/ledger-store.js`（localStorage 跨页同步）  

消息配置：`bms_v100_msg_cfg_v1`；消息流水：`bms_v100_msg_log_v1`；使用范围：`bms_v100_org_scope_v1`
