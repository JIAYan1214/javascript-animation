# javascript-animation
原生js实现通用帧动画库
demo:是实现一个简单的动画

animation：是一个通用的动画库；
如何设计通用库：
1.需求分析
   a.支持图片预加载
   b.支持两种动画播放方式，以及自定义每帧动画(可以自己扩展动画的功能)
   c.支持单组动画控制循环次数，或者无限次播放
   d.支持一组动画完成，下一组继续进行
   e.支持每个动画完成后有等待的时间
   f.支持暂停和播放
   g.支持动画完成后执行回调函数
2.编程接口
    1.loadImage(imgList)//预加载图片
    2.changePosition(ele,positions,imgUrl)//通过background-position实现动画
    3.changeSrc(ele,imgList)//通过改变img元素的src
    4.enterFrame(callback)//自定义每一帧动画的callback
    5.repeat(times)//执行次数
    6.repeatForever()//无限次执行
    7.waite(time)//等待时长
    8.then(callback)//动画执行回调函数
    9.start(interval)//动画执行的间隔
    10.pause()//暂停
    11.restart()//重新执行
    12.dispose()//释放资源
3.调用方式
4.代码设计

