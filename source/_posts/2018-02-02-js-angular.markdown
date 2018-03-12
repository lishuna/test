---
layout:     post
title:      "Angular-ElementRef学习"
subtitle:   "Angular"
date:       2018-02-02 17:00:00
author:     "freefish"
cdn: header-off
header-img: "/img/post-bg-js-version.jpg"
tags:
    - ElementRef
    - angular
    - js
---

# ElementRef学习

[本文引自](https://segmentfault.com/a/1190000008653690)

由于angular的理念是一套代码，适用多个平台，包括浏览器、桌面应用、手机应用等。为了支持跨平台，它封装了一些统一的接口。如定义抽象类 Renderer 、抽象类 RootRenderer 等。此外还定义了以下引用类型：ElementRef、TemplateRef、ViewRef 、ComponentRef 和 ViewContainerRef 等。下面我们就来分析一下 ElementRef 类：
## ElementRef
可以先看下它是如何定义的
```
class ElementRef {
  constructor(nativeElement: any)
  nativeElement: any
}
```
只包含了一个nativeElement属性，这个属性的作用就是当前的dom元素值，等价于document.getElementsByTagName('my-app')[0].

下面来看个例子：
```
    //app.component.ts
    import { Component, OnInit,ElementRef,AfterViewInit } from '@angular/core';

    @Component({
      selector: 'my-app',
      template: `
        <div>
          <p>element-ref demo works!</p>
        </div>
      `,
      styles: ['']
    })
    export class AppComponent implements OnInit{
        //构造器赋值是可选的，系统会帮助赋值 
        constructor(private ele: ElementRef){
        }
        //模版元素加载完成之后调用
        ngAfterViewInit(){
            console.log(this.ele.nativeElement.querySelector('div');
        }
    }
    //最后会输出类似 <div><p _ngcontent-c4="">
    //  elementref-demo works!
    // </p></div>
```
使用ElementRef注入对象不是最好的解决方案，其实还可以用ViewChild映射模版，直接可以引用这个dom元素。
看下面例子:
```
//app.component.ts
    import { Component, OnInit,ElementRef,AfterViewInit } from '@angular/core';

    @Component({
      selector: 'my-app',
      template: `
        <div #tel>
          <p>element-ref demo works!</p>
        </div>
      `,
      styles: ['']
    })
    export class AppComponent implements OnInit{
        @ViewChild('tel') node: ElementRef;
        
        //构造器赋值是可选的，系统会帮助赋值 
        constructor(private ele: ElementRef){
        }
        //模版元素加载完成之后调用
        ngAfterViewInit(){
           //console.log(this.ele.nativeElement.querySelector('div');
            console.log(this.node.nativeElement.querySelector('div');
            this.renderer.setElementStyle(this.greetDiv.nativeElement, 'backgroundColor', 'red');
        }
    }
    //最后会输出类似 <div><p _ngcontent-c4="">
    //  elementref-demo works!
    // </p></div>
```
这里插一句，操作dom可以了，如何渲染页面呢。笨方法就是this.node.nativeElement.style.backgroundColor = 'red';不过angular封装了render接口可以用this.renderer.setElementStyle(this.greetDiv.nativeElement, 'backgroundColor', 'red');

最后，看下render常用的方法有哪些？
```
export abstract class Renderer2 {
  abstract createElement(name: string, namespace?: string|null): any;
  abstract createComment(value: string): any;
  abstract createText(value: string): any;
  abstract setAttribute(el: any, name: string, value: string,
    namespace?: string|null): void;
  abstract removeAttribute(el: any, name: string, namespace?: string|null): void;
  abstract addClass(el: any, name: string): void;
  abstract removeClass(el: any, name: string): void;
  abstract setStyle(el: any, style: string, value: any, 
    flags?: RendererStyleFlags2): void;
  abstract removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void;
  abstract setProperty(el: any, name: string, value: any): void;
  abstract setValue(node: any, value: string): void;
  abstract listen(
      target: 'window'|'document'|'body'|any, eventName: string,
      callback: (event: any) => boolean | void): () => void;
}
```
