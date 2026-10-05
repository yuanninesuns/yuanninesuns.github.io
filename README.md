# 「鲸」的世界 — 博客源码

这是「鲸」的个人博客源码。

项目采用纯静态结构，无需构建工具，可直接部署到 GitHub Pages。首页通过 `articles.json` 读取文章索引，文章正文使用 Markdown 编写。

## 项目结构

```
yuanninesuns.github.io/
├── index.html              # 首页：分类筛选、排序、文章卡片容器
├── article.html            # 文章详情页：读取并渲染 Markdown
├── articles.json           # 文章索引：控制首页展示内容
├── main.js                 # 首页文章加载、分类切换、排序逻辑
├── style.css               # 全站样式
├── pic/                    # 图片资源
└── articles/               # Markdown 文章目录
    ├── journey/            # 旅途
    ├── emotion/            # 情感
    ├── finance/            # 理财
    └── bookmovie/          # 书影
```

## 当前分类

| category | 中文名称 | 说明 |
|---|---|---|
| `journey` | 旅途 | 人生经历、阶段记录、思考札记 |
| `emotion` | 情感 | 情绪、关系、记忆与私人叙事 |
| `finance` | 理财 | 投资、商业、产业与财富认知 |
| `bookmovie` | 书影 | 书籍、电影、人物与精神世界 |

## 哲学标签

文章标签建议限定在以下范围内：

- `探索`
- `体验`
- `修炼`
- `精神`
- `财富`
- `肉体`

## 新增文章

新增一篇文章通常需要两步：

### 1. 创建 Markdown 文件

在对应分类目录下创建 `.md` 文件，例如：

```text
articles/journey/ai-era-scarcity-01.md
```

文章头部使用 frontmatter：

```md
---
title: "ai时代什么东西是稀缺的"
category: journey
date: "2026-10-04"
excerpt: "在 AI 让内容、工具与答案变得越来越便宜的时代，重新思考什么才真正稀缺……"
tags: [探索, 精神]
---

# ai时代什么东西是稀缺的

正文内容……
```

### 2. 更新 `articles.json`

在 `articles.json` 中添加对应索引：

```json
{
  "title": "ai时代什么东西是稀缺的",
  "category": "journey",
  "date": "2026-10-04",
  "excerpt": "在 AI 让内容、工具与答案变得越来越便宜的时代，重新思考什么才真正稀缺……",
  "tags": ["探索", "精神"],
  "src": "articles/journey/ai-era-scarcity-01.md"
}
```

首页会根据 `articles.json` 自动渲染文章卡片，并按照分类显示在对应 tab 下。

## 置顶规则

文章索引支持两个置顶字段：

```json
{
  "pinned": true,
  "categoryPinned": true,
  "categoryPinOrder": 1
}
```

含义：

- `pinned`：是否在「全部」页置顶
- `categoryPinned`：是否在当前分类 tab 下置顶
- `categoryPinOrder`：分类内置顶排序，数字越小越靠前

## 本地预览

由于文章列表和 Markdown 内容通过 `fetch` 加载，建议使用本地 HTTP 服务预览：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 部署到 GitHub Pages

1. 将项目文件推送到 GitHub 仓库根目录
2. 进入仓库 **Settings → Pages**
3. Source 选择 `main` 分支和 `/root`
4. 保存后访问：

```text
https://<你的用户名>.github.io/<仓库名>/
```

如果仓库名是 `<你的用户名>.github.io`，则访问：

```text
https://<你的用户名>.github.io/
```
