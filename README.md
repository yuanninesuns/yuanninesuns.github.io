# 「鲸」的世界 — 博客源码

纯静态博客，无需构建工具，可直接部署到 GitHub Pages。

## 目录结构

```
blog/
├── index.html          # 主页（含分类筛选导航）
├── style.css           # 全局样式
├── main.js             # 分类切换逻辑
└── articles/
    ├── finance-01.html # 理财 · 从零开始，搭建自己的第一份资产地图
    ├── career-01.html  # 职场 · 在系统里找到自己的位置
    ├── love-01.html    # 感情 · 爱是一种需要练习的能力
    ├── book-01.html    # 书评 · 读《活出意义来》
    └── film-01.html    # 影评 · 《瞬息全宇宙》
```

## 部署到 GitHub Pages

1. 新建一个 GitHub 仓库（比如 `y-world`）
2. 把 `blog/` 目录下的所有文件推送到仓库根目录
3. 进入仓库 **Settings → Pages**，Source 选 `main` 分支 `/root`，保存
4. 访问 `https://<你的用户名>.github.io/y-world/` 即可

## 新增文章

1. 在 `articles/` 目录下复制任意一篇 `.html` 作为模板
2. 修改标题、正文、分类、标签
3. 在 `index.html` 的 `<main>` 区域添加对应的 `<article class="card" data-cat="...">` 卡片

## 分类与哲学标签

| 分类 data-cat | 中文 | 颜色 |
|---|---|---|
| finance | 理财 | 墨绿 |
| career  | 职场 | 靛蓝 |
| love    | 感情 | 玫红 |
| book    | 书评 | 紫   |
| film    | 影评 | 琥珀 |

可用哲学标签：`探索` `体验` `修炼` `精神` `物质` `身体`
