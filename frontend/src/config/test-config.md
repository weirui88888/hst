# 配置文件测试清单

## 已完成的配置替换

### 1. 导航栏 (NavBar.vue)

- ✅ 默认站点标题: `UI_TEXTS.nav.defaultTitle`
- ✅ 录入按钮title: `UI_TEXTS.nav.add`
- ✅ 设置按钮title: `UI_TEXTS.nav.settings`

### 2. 设置面板 (SettingsPanel.vue)

- ✅ 设置面板标题: `UI_TEXTS.settings.title`
- ✅ 页面设置分组: `UI_TEXTS.settings.pageSettings`
- ✅ 时间轴设置分组: `UI_TEXTS.settings.timelineSettings`
- ✅ 其他设置分组: `UI_TEXTS.settings.otherSettings`
- ✅ 页面动画标题: `UI_TEXTS.settings.pageAnimation.title`
- ✅ 页面动画描述: `UI_TEXTS.settings.pageAnimation.description`
- ✅ 开启/关闭状态: `UI_TEXTS.settings.pageAnimation.on/off`
- ✅ 站点标题设置: `UI_TEXTS.settings.siteTitle.title`
- ✅ 站点标题描述: `UI_TEXTS.settings.siteTitle.description`
- ✅ 站点标题占位符: `UI_TEXTS.settings.siteTitle.placeholder`
- ✅ 时间轴开始文案标题: `UI_TEXTS.settings.endText.title`
- ✅ 时间轴开始文案描述: `UI_TEXTS.settings.endText.description`
- ✅ 时间轴开始文案占位符: `UI_TEXTS.settings.endText.placeholder`
- ✅ 时间轴位置标题: `UI_TEXTS.settings.timelinePosition.title`
- ✅ 时间轴位置描述: `UI_TEXTS.settings.timelinePosition.leftDesc/rightDesc`
- ✅ 时间轴位置状态: `UI_TEXTS.settings.timelinePosition.left/right`
- ✅ 季节标识标题: `UI_TEXTS.settings.seasonalIndicator.title`
- ✅ 季节标识描述: `UI_TEXTS.settings.seasonalIndicator.description`
- ✅ 更多设置提示: `UI_TEXTS.settings.moreSettings`
- ✅ 保存按钮: `UI_TEXTS.settings.save`

### 3. 上传弹窗 (UploadDialog.vue)

- ✅ 弹窗标题: `UI_TEXTS.upload.title`
- ✅ 桌面端上传提示: `UI_TEXTS.upload.desktopUploadHint`
- ✅ 移动端上传提示: `UI_TEXTS.upload.mobileUploadHint`
- ✅ 删除图片提示: `UI_TEXTS.upload.deleteImage`
- ✅ 关闭预览提示: `UI_TEXTS.upload.closePreview`
- ✅ 标题占位符: `UI_TEXTS.upload.titlePlaceholder`
- ✅ 内容占位符: `UI_TEXTS.upload.contentPlaceholder`
- ✅ 标签占位符: `UI_TEXTS.upload.tagsPlaceholder`
- ✅ 日期占位符: `UI_TEXTS.upload.datePlaceholder`
- ✅ 保存成功提示: `UI_TEXTS.toast.saveSuccess`

### 4. 空状态 (CoverHero.vue)

- ✅ 无内容提示: `UI_TEXTS.empty.noContent`

### 5. 时间轴 (Timeline.vue)

- ✅ 默认时间轴开始文案: `UI_TEXTS.settings.endText.default`

### 6. 设置存储 (settings.ts)

- ✅ 默认站点标题: `UI_TEXTS.nav.defaultTitle`
- ✅ 默认时间轴开始文案: `UI_TEXTS.settings.endText.default`

## 测试步骤

1. 启动开发服务器: `npm run dev`
2. 打开浏览器访问应用
3. 检查以下功能是否正常:
   - 导航栏显示正确的标题和按钮提示
   - 点击设置按钮打开设置面板
   - 设置面板中所有文本显示正确
   - 点击录入按钮打开上传弹窗
   - 上传弹窗中所有文本显示正确
   - 空状态下显示正确的提示文本
   - 时间轴底部显示正确的时间轴开始文案

## 预期结果

- 所有UI文本都应该从配置文件中读取
- 没有硬编码的中文文本
- 应用功能完全正常
- 没有控制台错误
