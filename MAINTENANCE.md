# 书源维护

当前任务已创建 Codex 每周维护任务：每周一 09:00（Asia/Shanghai），任务 ID `legado`。它在本任务中检查、修复并发布更新；使用本地文件时需要电脑开机、Codex 应用运行、网络可用且 GitHub 登录仍有效。它不是 GitHub Actions 云端工作流，仓库本身不会在电脑关闭时自行修复。

固定发布目标：`chaowushang/legado` 的 `main` 分支。固定入口为 `book_sources.json`。用户已授权维护该仓库；不要因每次例行更新重复索要确认。若登录失效或权限被阻止，报告具体问题。

## 每次维护

1. 下载仓库当前书源、`verification.json`、`candidate_sources.json`，不要仅复用上次通过结果。
2. 使用 Java 21、Node.js 22+ 和 curl：`node check-sources.cjs book_sources.json check-report.json`。每条使用独立验证进程，65 秒超时，检查搜索、详情、目录、两个不同章节与乱码、倒序问题。报告不保存小说正文。
3. 校验器不是 Android 阅读客户端。对失败项复查实际网页，区分网络、编码、验证码、付费限制、规则变化与引擎不支持；HTTP 200 不代表书源可用。正文必须不是推荐列表、提示页或登录页。目录应从开头顺序读取；核实目录与正文分页，不能把“下一章”接入“下一页”。脚本结果需要这些额外检查。
4. 优先修复原书源，再用候选替补。新增源先审查脚本与网页，再执行规则；不要运行访问本地文件、凭据或启动外部程序的脚本。无需登录的源不加入账户信息。不要绕过付费或验证码。
5. 目标约 60 条，保持分组与来源归属。如果合格源不足，公布实际数量与原因，不用未知源凑数。短时失败先复测；大面积失败先排查环境，不把整个合集误删。
6. 发布本次通过的源，更新逐条时间、规则哈希、章节统计、README 数量和来源。记录淘汰与替换原因。更新同一个 raw 链接后重新下载，比对 JSON、条数与本地 SHA-256。
7. 无实质变化时保持安静；修复、替换、明显失效或发布失败时通知。

## 本任务 Windows 环境

已有工具位于工作目录的 `work/`，中间验证数据也在此保留。运行通用脚本前可设置：`JAVA_BIN` 指向 `work/jre21/jdk-21.0.12.1+1-jre/bin/java.exe`，`CURL_BIN_DIR` 指向 `work/curl/curl-8.22.0_2-win64-mingw/bin`，`CURL_CA_BUNDLE` 指向 `work/trusted-node-ca.pem`，`VALIDATOR_JAR` 指向 `work/validator.jar`。均应使用绝对路径。不要关闭 TLS 验证。PowerShell 自带 curl 在本任务环境遇到证书问题，使用上述已核验 curl。

验证组件来自 [Narylr350/book-source-creator-skill](https://github.com/Narylr350/book-source-creator-skill)，脚本锁定提交与 SHA-256。未在仓库重新分发其二进制。更换版本时先核验来源并回归测试。

官方定时任务运行条件：[OpenAI Docs](https://learn.chatgpt.com/docs/automations?surface=app)。
