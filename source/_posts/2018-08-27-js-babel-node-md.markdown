
---
layout:     post
title:      "如何让node完美支持es6语法"
subtitle:   "node es6 babel"
date:       2018-08-27 15:19:00
author:     "freefish"
cdn: header-off
header-img: "/img/post-bg-2015.jpg"
tags:
    - node
    - es6
    - babel
---

首先，建议大家装一下es-checker,看一下在当前node版本下，对es6支持的程度，下面是我本机node版本8.10.0对es6的支持：
![image](https://raw.githubusercontent.com/lishuna/MarkdownPhotos/master/es-checker-node8.10.0.jpg)
其实8.10.0对es6已经达到90%的支持率了，但是如果想用import/export或者async/await是不支持的，这时候就用到了babel.下面就介绍一下如何在node使用babel.

#### node中的babel

##### npm包安装

1. babel
2. babel-core
3. babel-plugin-transform-async-to-generator  //为了支持async/await
4. babel-plugin-transform-runtime     //为了支持async/await，不安装就会报错 关于这个插件的[详细教程](https://segmentfault.com/a/1190000009065987)
5. babel-preset-es2015


##### 配置.babelrc
```
{
    "presets": [
        "es2015" // 支持es6转es5
    ],
    "plugins": [
        "transform-async-to-generator", // 支持async/await写法
        "transform-runtime" // runtime转换器插件主要做了当使用generators/async方法、函数时自动调用babel-runtime/regenerator
    ]
}
```

##### node入口文件
入口文件需要加上一句话,并且需要加在最顶部。代表之后的文件都会自动通过babel编译，但是并babel不会编译当前的入口文件，所有当前文件不能用import/export等一些语法。
```
require('babel-core/register');
```

做到上面这几点，其实就可以用es6的语法同时也可以用async/await了，下面看一个测试例子：

index.js node的入口文件
```
// 顶部引入babel-core/register，下面引入的所有模块都自动通过babel编译，但当前文件不会编译
require('babel-core/register');
// require("babel-core").transform("code");
require('./es6js/await');
```
./es6js/await.js

```
import fs from 'fs';
import path from "path";

const readFile = function(fileName) {
    return new Promise((resole, rejects) => {
        fs.readFile(fileName, {
            encoding: 'utf-8'
        }, (error, data) => {
            if (error) return reject(error);
            resole(data);
        })
    });
};
const gen = async function() {
    const f1 = await readFile(path.join(__dirname, '../readme.txt'));
    console.log("readme: " + f1);
    const f2 = await readFile(path.join(__dirname, '../log.txt'));
    console.log('log: ' + f2);
}
gen();

```
> 运行 node index.js                                          
> 输出：readme: I am a readme                                
        log: I am a log!


---

## 关于babel

### babel5 和 babel6 的区别
对于Babel来说，现在有了两个版本，一个是5，一个是6，那么两者有什么区别呢？

- 5对新手更加友好，因为只需要安装一个babel就可以了，而6需要安装比较多的东西和插件才可以。
- 相比5来说，6将命令行工具和API分开来了，最直观的感觉就是，当你想在代码中运行es6代码的话，需要安装babel-core，而如果你想在终端编译es6或者是运行es6版本的REPL的话，需要安装babel-cli
- 也许有人问，原先的babel去哪了？是这样的，这个babel的package到了6版本之后虽然还是能安装，但是已经不具有任何的有效的代码了。取而代之的是一段提示文字，提示你需要安装babel-core或者babel-cli。所以你在babel6的情况下，完全不需要安装babel
- 6将babel插件化，当你第一次安装babel-core并且按照以前的方式来加载require hook的话，你回发现代码无法运行：
```
require('babel-core/register');	
```
就是因为babel6整体插件化了，如果你想使用es6语法，需要手动加载相关插件。
这里有一篇文章，建议看一下[《The Six Things You Need To Know About Babel 6》](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)

### require hook

安装好之后，问题来了，如何使用呢？

相信使用过coffee的人一定知道register，那么在babel中同样不例外，也可以使用同样的方法。
```
require('babel-core/register');

require('./app');
```
大家可能以为这样我就可以在app.js中优雅的使用es6了，在babel5中确实是这样的，但是在babel6中，缺不一样了。

如果你这样写完，并没有任何作用，因为你缺少一个插件。

### 安装插件
如果想使用es6语法，必须安装一个插件
```
npm install babel-preset-es2015
```
然后在文件夹下面创建一个叫.babelrc的文件，并写入如下代码：
```
{
	"presets": ["es2015"]
}
```
==至此，babel就能把es6转成es5了==

> 参考文献： https://cnodejs.org/topic/56460e0d89b4b49902e7fbd3
> https://segmentfault.com/a/1190000009065987