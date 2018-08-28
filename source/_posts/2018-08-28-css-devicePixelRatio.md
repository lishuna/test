---
layout: post
title: "高清屏及适配不同设备的方案总结"
date: 2018-08-28 21:57:43
header-img: "/img/post-bg-2015.jpg"
author:     "freefish"
cdn: header-off
tags:
        - 高清屏
        - 适配
        - devicePixelRatio
        - rem
---

> 关于一些Retina，设备像素，移动适配的知识，网上一搜也是一大把，但是基本的东西并没有变化太多。下面就我看过的一些有关于这方面的知识做一些总结（仅以个人的角度出发，所以有不全的地方还请大家谅解）。后面会有不定期的更新~每个知识点我都会在开关写出引用地址，所以大家有不懂的可以看原文章~

# 一、关于设备像素比（devicePixelRatio）

出处：[高清屏概念解析与检测设备像素比的方法](https://blog.csdn.net/yisuowushinian/article/details/52738759)

所谓设备像素比（devicePixelRatio[dpr]）指的就是物理像素(physical pixel)和独立像素(device-independent pixels [dips])的比例。

基本公式就是:设备像素比 = 物理像素 / 设备独立像素  //在某个方向上，x或者y

物理像素：就是我们经常所说的分辨率，如iphone 6 的分辨率就是750x1334

独立像素：就是手机的实际视窗，如iphone 6的视窗就是375x667

所以iphone 6的设备像素比 = 750/375 = 2

当devicePixelRatio值等于1时（也就是最小值），那么它普通显示屏

当devicePixelRatio值大于1(通常是1.5、2.0)，那么它就是高清显示屏。

## 二：适配方案

出处：[高清屏概念解析与检测设备像素比的方法](https://blog.csdn.net/yisuowushinian/article/details/52738759)

### 1.Media Queries媒体查询（只能用于背景图片）

通过-webkit-device-pixel-ratio，-webkit-min-device-pixel-ratio和 -webkit-max-device-pixel-ratio进行媒体查询，对不同dpr的设备，做一些样式适配.

```

.css{/* 普通显示屏(设备像素比例小于等于1.3)使用1倍的图 */ 
    background-image: url(img_1x.png);
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5){
.css{/* 高清显示屏(设备像素比例大于等于1.5)使用2倍图  */
    background-image: url(img_2x.png);
  }
}
```

### 2.JavaScript的解决方案

使用js对“window.devicePixelRatio”进行判断，然后根据对应的值给Retina屏幕选择图像。

```
$(document).ready(function(){
  if (window.devicePixelRatio > 1) {
    var lowresImages = $('img');

    images.each(function(i) {
      var lowres = $(this).attr('src');
      var highres = lowres.replace(".", "@2x.");
      $(this).attr('src', highres);
    });
  }
});
```

### 3.使用SVG矢量图像

## 三：多屏适配布局问题

出处：[【原创】移动端高清、多屏适配方案](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)

[再谈移动端适配和点5像素的由来](https://blog.csdn.net/yisuowushinian/article/details/52744508)

==使用相对单位：rem==

原理：针对不同手机屏幕尺寸和dpr动态的改变根节点html的font-size大小(基准值)。

任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合:
==1rem=16px。那么12px=0.75rem,10px=0.625rem==。为了简化font-size的换算，需要在css中的==html选择器中声明font-size=62.5%，这就使rem值变为 16px*62.5%=10px, 这样12px=1.2rem, 10px=1rem, 也就是说只需要将原来的px数值除以10，然后换上rem作为单位就行了==。

当我们在根节点html上设置了font-size基准值以后，==在文档中有使用rem单位的属性值都是相对于根节点font-size的一个相对值==。比如说一些元素的属性如width,height,margin等。也正是这个原因，现在很多网站的移动端网站都在使用rem单位作为适配工具。

==注意事项==：

1.整体的布局还是使用百分比

2.使用rem的最佳场景是,遇到例如多列带有图片的列表,常常需要图片固定宽高比

3.研究了一些网站，比如淘宝，对字体字体一般情况建议使用px

4.出现1px像素线的地方，仍旧使用border-width:1px;而不是border-width:.1rem

 

根据JS来动态计算rem值：根据iPhone6设计稿动态计算rem值

==使用的时候，请将下面的代码放到页面的顶部（head标签内）；==

```
/**
 * [以iPhone6的设计稿为例js动态设置文档 rem 值]
 * @param  {[type]} currClientWidth [当前客户端的宽度]
 * @param  {[type]} fontValue [计算后的 fontvalue值]
 * @return {[type]}     [description]
 */
<script>
    var currClientWidth, fontValue,originWidth;
    //originWidth用来设置设计稿原型的屏幕宽度（这里是以 Iphone 6为原型的设计稿）
    originWidth=375;
    __resize();

    //注册 resize事件
    window.addEventListener('resize', __resize, false);

    function __resize() {
        currClientWidth = document.documentElement.clientWidth;
        //这里是设置屏幕的最大和最小值时候给一个默认值
        if (currClientWidth > 640) currClientWidth = 640;
        if (currClientWidth < 320) currClientWidth = 320;
        //
        fontValue = ((62.5 * currClientWidth) /originWidth).toFixed(2);
        document.documentElement.style.fontSize = fontValue + '%';
    }
    </script>
```

