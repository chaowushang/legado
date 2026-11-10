# 阅读3.0分组书源

2026-11-10更新：用户两张截图中的 **13条App失效源全部隔离**。保留本轮服务器复测通过的17条，补入2条已重新核验候选，当前 **19条**。距30条目标尚缺11条，未用未核验源凑数。

## 更新方式

1. 导入[本次13条停用补丁](https://raw.githubusercontent.com/chaowushang/legado/main/disable_20261110_app_failures.json)，覆盖相同书源后确认开关关闭。
2. 导入[新版19条订阅](https://raw.githubusercontent.com/chaowushang/legado/main/book_sources.json)，固定链接保持不变。
3. 若此前未处理旧源，可导入[累计停用文件](https://raw.githubusercontent.com/chaowushang/legado/main/disable_reported_sources.json)。仅从远程合集移除不保证App自动删除旧条目，无需删除书架或阅读进度。

## 本次用户反馈

|名称|截图报错|耗时|
|---|---|---|
|365小说网|unexpected end of stream on htt…|3.455秒|
|四零二零|unexpected end of stream on htt…|3.474秒|
|就爱文学|unexpected end of stream on htt…|3.957秒|
|笔趣阁⑥⑧|connection closed|6.758秒|
|黄易小说|unexpected end of stream on htt…|3.593秒|
|笔趣网|unexpected end of stream on htt…|12.897秒|
|黑炎小说|unexpected end of stream on htt…|3.514秒|
|阅读库|unexpected end of stream on htt…|3.402秒|
|亿软网|unexpected end of stream on htt…|14.279秒|
|溜达小说|unexpected end of stream on htt…|5.496秒|
|橘子小说|unexpected end of stream on htt…|3.451秒|
|去读书|unexpected end of stream on htt…|5.496秒|
|猪猪书网|unexpected end of stream on htt…|3.702秒|

多数错误是连接提前中断，笔趣阁⑥⑧显示connection closed。截图中被截断的错误未补全；这些错误确认用户当前使用失败，不足以认定网站永久关闭。去读书此前服务器通过，仍按此次客户端失败反馈隔离。累计用户失败记录58条，原45条隔离不变。

## 当前书源

|名称|分组|本轮服务器检查|
|---|---|---|
|话本·公开章节|💰 正版,💐 女频|已通过|
|阅友小说|🎉 精选|已通过|
|逐浪小说|💰 正版|已通过|
|云起书院|💰 正版,💐 女频|已通过|
|夜伴书屋|💐 女频|已通过|
|笔趣阁（bqquge.org）|💠 综合|已通过|
|爱看小说|💠 综合|已通过|
|爱下电子（繁）|💠 综合|已通过|
|全本小说网|💠 综合|已通过|
|九九藏书|💠 综合|已通过|
|企鹅阅读|💰 正版|已通过|
|梦想家文学|🎉 精选,⭐️ API|已通过|
|爱下书小说网|💠 综合|已通过|
|夜天连看|💠 综合|已通过|
|穿越小说|💠 综合|已通过|
|啃书阁|💠 综合|已通过|
|天地中文网|💠 综合|已通过|
|不知加啥|💠 综合|已通过|
|快眼看书botaodz|💠 综合|已通过|

“已通过”指今日搜索、详情、目录、两个不同章节、目录开头及可见分页抽查。不能替代Android阅读App实测，也不保证每本书和全部分页；正版站点仅检查免费公开章节。截图不证明其余书源已在用户App全部通过。中文分组不添加待实测标签。

[验证记录](verification.json) · [App失败记录](app_failures.json) · [来源归属](provenance.json) · [维护流程](MAINTENANCE.md)

## 维护

每两周周一09:00（北京时间）自动维护，目标30条。优先修复或补充已核验候选；不足时公布实际数量。App隔离源须明确修复并经用户客户端复测才能恢复。保留原作者备注，不发布小说正文。
