---
title: box-sizing使用
date: 2018-07-02 22:30:00
layout: post
tags: [css,box-sizing]
---
温习一下box-sizing的基本用法。

### 1.语法： content-box | border-box
### 2.说明
- content-box 容器的实际宽度或高度=width；不包含padding和border值，是标准的盒模型。
- border-box 容器的高度或宽度 = width + padding +border;包含padding和border值。

### 示例演示

```
<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="utf-8" />
    <title>box-sizing_CSS参考手册_web前端开发参考手册系列</title>
    <style>
        .test {
            width: 200px;
            height: 70px;
            border: 20px solid red;
            padding: 10px;
            background: green;
            box-sizing: content-box;
        }
        
        .test2 {
            width: 200px;
            height: 70px;
            border: 20px solid red;
            padding: 10px;
            background: green;
            box-sizing: border-box;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="test">content-box</div>
    <div class="test2">border-box</div>
</body>

</html>
```
结果显示：

![](https://raw.githubusercontent.com/lishuna/MarkdownPhotos/master/box-sizing.png)