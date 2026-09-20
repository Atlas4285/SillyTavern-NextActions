# SillyTavern Next Actions

[English](README.md) | **简体中文**

Next Actions 是一个第三方 [SillyTavern](https://github.com/SillyTavern/SillyTavern) UI 扩展，可以将角色回复中的 `<next_actions>` 标签块转换成一组可点击的回复按钮。

按钮会渲染在标签原本出现的位置，因此回复中可以在选项前、选项后或两侧同时包含普通正文。

## 功能

- 将 `<next_actions>` 中的每个非空行渲染成一个选项按钮。
- 保留并格式化选项标签前后的正文。
- 支持新生成的消息、消息切换、消息编辑、聊天切换以及加载的历史消息。
- 点击选项后可以填入聊天输入框，也可以立即发送。
- 使用 SillyTavern 主题变量，使按钮外观与界面保持一致。
- 默认提供英文界面，并支持简体中文本地化。

## 消息格式

让模型按照下面的格式生成选项：

```text
<next_actions>
询问接下来发生了什么
观察房间四周
悄悄离开
</next_actions>
```

每个非空行都会生成一个按钮。除非希望 Markdown 列表符号也显示在按钮文字中，否则请直接逐行输出选项，不要添加列表符号。

标签块也可以出现在普通正文之间：

```text
随着身后的门缓缓关上，走廊陷入寂静。

<next_actions>
敲响房门
继续沿走廊前进
大声呼救
</next_actions>

远处的某个地方，时钟开始报时。
```

`<next_actions>` 标签块会被按钮替换，标签前后的正文则会按照原有顺序保留。

### 推荐的提示词

可以在系统提示词、角色提示词或作者注释中添加类似下面的指令：

```text
请在回复中加入一个 <next_actions> 标签块，在其中提供几个适合用户选择的后续行动。每个行动单独占一行，不要使用项目符号或编号，并使用 </next_actions> 关闭标签块。
```

## 安装

### 通过 SillyTavern 安装

1. 打开 SillyTavern 的 **扩展（Extensions）** 面板。
2. 选择 **安装扩展（Install Extension）**。
3. 输入本仓库地址：

   ```text
   https://github.com/Atlas4285/SillyTavern-NextActions
   ```

4. 完成安装。如果扩展没有立即出现，请重新加载 SillyTavern 页面。

请只安装来自可信来源的第三方扩展。

### 手动安装

将本仓库克隆到 SillyTavern 的第三方扩展目录：

```bash
cd /path/to/SillyTavern/public/scripts/extensions/third-party
git clone https://github.com/Atlas4285/SillyTavern-NextActions.git
```

如果克隆的源码中没有预先构建好的 bundle，请安装开发依赖并进行构建：

```bash
cd SillyTavern-NextActions
npm install
npm run build
```

然后重新加载 SillyTavern。

## 设置

打开 SillyTavern 的 **扩展（Extensions）** 面板并找到 **Next Actions**。其中的 **点击选项后的行为（Action button behavior）** 设置提供两种模式：

- **填入输入框（Fill input）**：使用选中的选项替换聊天输入框中的当前内容，但不发送。
- **直接发送（Send immediately）**：使用选中的选项替换聊天输入框中的当前内容，然后立即发送。

只有最新一条聊天消息中的选项可以执行。较早消息中的选项仍然可见，也仍然可以选择和复制。

## 当前行为和限制

- 只处理角色消息，不处理用户消息和系统消息。
- 每条消息只解析第一个 `<next_actions>` 标签块。
- 使用换行分隔不同选项，并忽略空行。
- 不会自动移除 Markdown 列表符号。
- 开始标签和结束标签必须同时存在；扩展不会转换不完整的标签块。
- 历史消息中的选项按钮不会执行。

## 开发

本扩展使用 TypeScript 编写，并通过 Webpack 打包。

安装依赖：

```bash
npm install
```

在本地开发期间监听文件变化并自动重新构建：

```bash
npm run dev
```

在 `dist/` 中生成生产版本 bundle：

```bash
npm run build
```

使用 ESLint 检查源码：

```bash
npm run lint
```

自动修复 ESLint 能够处理的问题：

```bash
npm run lint:fix
```

开发监听器会在源码改变时重新构建 bundle，但不会热重载 SillyTavern。请刷新浏览器页面以加载更新后的 bundle。

### 项目结构

```text
src/
├── index.ts                    扩展初始化和事件监听
├── style.css                  选项按钮样式
├── next-actions/
│   ├── parser.ts              <next_actions> 解析器
│   ├── renderer.ts            消息渲染和按钮可用状态
│   └── input-actions.ts       填入输入框和直接发送行为
└── settings/
    ├── settings.html          设置面板 HTML
    └── settings.ts            持久化设置管理
```

`manifest.json` 中声明的生产环境入口文件是 `dist/index.js`。

## 许可证

本项目采用 [GNU Affero General Public License v3.0](LICENSE) 许可证。
