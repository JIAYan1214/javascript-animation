/**
 * Created by jiayanyan 
 * Date: 2017/9/6
 * Time: 17:03
 * 
 */
'use strict';
var loadImg = require('./imgLoader');
var TimeLine= require('./timeLine');
/*初始化状态*/
var STATE_INITIAL = 0
//开始状态
var STATE_START = 1;
//结束状态
var STATE_STOP = 2;
//同步任务
var TASK_SYNC = 0;
//异步任务
var TASK_ASYNC = 1;
/**
 * 简单函数封装，执行callback
 * @param callback
 */
var next = function (callback) {
    callback && callback();
}
/**
 * 帧动画库类
 * @constructor
 */
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.state = STATE_INITIAL;
    this.timeLine= new TimeLine();
}
/**
 * 添加同步任务，预加载图片
 * @param imgList 图片数组
 */
Animation.prototype.loadImage = function (imgList) {
    var taskFn = function (next) {
        loadImg(imgList.slice(),next)
    };
    var type =TASK_SYNC;
     return this._add(taskFn,type);
};

/**
 * 添加异步定时任务，通过定时改变图片位置
 * @param elem dom对象
 * @param positions  背景位置数组
 * @param imgUrl 图片地址
 */
Animation.prototype.changePosition = function (elem,positions,imgUrl) {
    var len = positions.length;
    var taskFn;
    var type;
    if (len) {
        var me = this;
        taskFn = function (next , time) {
            if(imgUrl) {
                elem.style.backgroundImage = 'url('+imgUrl+')';
            }
            //| 0 上下去正像当与math.float
            var index = Math.min(time / me.interval | 0 ,len-1);
            var position = positions[index].split(' ');
            //改变图片位置
            elem.style.backgroundPosition = position[0]+'px '+position[1]+'px';

            if(index === len-1){
                next();
            }
        }

        type = TASK_ASYNC;
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }

    return this._add(taskFn,type);

};
/**
 * 添加异步定时任务，通过定时改变img标签的src
 * @param elem img标签
 * @param imgList  图片数组
 */
Animation.prototype.changeSrc = function (elem,imgList) {
    var len = imgList.length;
    var taskFn;
    var type;
    if(len){
        var me = this;
        taskFn = function (next , time) {
            //获取当前图片索引
            var index = Math.min(time/me.interval | 0,len-1);
            //改变图片路径
            elem.src = imgList[index];
            if(index === len-1){
                next();
            }
        }
        type = TASK_ASYNC;
    }else{
        taskFn = next;
        type = TASK_SYNC;
    }

};
/**
 * 高级用法，添加一个异步定时执行的任务
 * 自定义动画每帧执行的任务函数
 * @param taskFn  自定义每帧执行的任务函数
 */
Animation.prototype.enterFrame = function (taskFn) {
    return this._add(taskFn,TASK_ASYNC);

};
/**
 * 添加一个同步任务，上个任务执行完成后执行回调函数
 * @param callback 回调函数
 */
Animation.prototype.then = function (callback) {
    var taskFn = function (next) {
        callback();
        next();
    }

    var type = TASK_SYNC;

    return this._add(taskFn,type);
};
/**
 * 开始执行动画，异步定义任务执行的间隔
 * @param interval
 */
Animation.prototype.start = function (interval) {
    if(this.state === STATE_START){
        return this;
    }
    //任务链中没有任务，则返回
    if(!this.taskQueue.length){
        return this;
    }

    this.state = STATE_START;

    this.interval = interval;
    this._runTask();
    return this;
};

/**
 * 添加同步，回退到上一个任务中
 * 实现重复上一个任务的效果
 * @param times  重复次数
 */
Animation.prototype.repeat = function (times) {
    var me = this;
    var taskFn = function () {
        if(typeof  times === 'undefined') {
            //无线回退到上一个任务
            me.index--;
            me._runTask();
            return;
        }

        if (times){
            times--;
            //回退
            me.index--;
            me._runTask();
        }else{
            var task =me.taskQueue[me.index];
            //达到重复次数
            me._next(task);
        }
    }

    var type = TASK_SYNC;
    return this._add(taskFn,type);

};
/**
 * 添加一个同步任务，相当于repeat()；实现无限循环上一次的任务
 */
Animation.prototype.repeatForever = function () {
    return this.repeat();
};
/**
 * 添加一个异步任务
 * 设置当前任务执行结束后到下一个任务等待的时间
 * @param time 等待时间
 */
Animation.prototype.wait = function (time) {
    if(this.taskQueue && this.taskQueue.length>0){
        this.taskQueue[this.taskQueue.length-1] .wait = time;
    }
    return this;
};
/**
 * 暂停当前异步定时任务
 */
Animation.prototype.pause = function () {
    if(this.state === STATE_START){
        this.state=STATE_STOP;
        this.timeLine.stop();
        return this;
    }
    return this;

};
/**
 * 重新执行上一次暂停的异步任务
 */
Animation.prototype.restart = function () {
    if(this.state === STATE_STOP){
        this.state = STATE_START;
        this.timeLine.restart();
        return this;
    }
    return this;

};
/**
 * 释放资源
 */
Animation.prototype.dispose = function () {
    if(this.state!==STATE_INITIAL){
        this.state = STATE_INITIAL;
        this.taskQueue = null;
        this.timeLine.stop();
        this.timeLine = null;
        return this;
    }
    return this;

}

/**
 * 内部使用
 * 添加一个任务到任务队列中
 * @param taskFn 任务方法
 * @param type 任务类型
 * @private
 */
Animation.prototype._add = function (taskFn,type) {
    this.taskQueue.push({
        taskFn:taskFn,
        type:type
    });
    return this;
}
/**
 * 执行任务
 * @private
 */
Animation.prototype._runTask = function () {
    if(!this.taskQueue.length || this.state!== STATE_START){
        return;
    }
    //任务执行完毕
    if (this.index === this.taskQueue.length){
        this.dispose();
        return;
    }

    //获取任务链上当前任务
    var task = this.taskQueue[this.index];

    if(task.type === TASK_SYNC ){
        this._syncTask(task);
    }else{
        this._asyncTask(task);
    }
}
/**
 * 同步任务
 * @param task 任务对象
 * @private
 */
Animation.prototype._syncTask = function (task) {
    var me = this;//确保next()中的this还是指向外层的对象
    /*此时一个闭包*/
    var next = function () {
      //切换到下一个任务
        //当前this已经不是指向外层对象Animation，this._next();修改如下
        me._next(task);

    };
   var taskFn = task.taskFn;
   taskFn(next);
}
/**
 * 切换到下一个任务,如果当前任务需要等待，则延时执行
 * @param task 当前任务
 * @private
 */
Animation.prototype._next = function (task) {
    this.index++;
    var me = this;
    task.wait ?setTimeout(function () {
        me._runTask();
        },task.wait) : this._runTask();

}
/**
 *执行异步任务（通过定时执行的任务）
 * @param task 执行任务对象
 * @private
 */
Animation.prototype._asyncTask = function (task) {
    var me = this;
    /**
     * 定义每一帧执行的回调函数
     * @param time 从动画开始到当前的时间
     */
    var enterFrame = function (time) {
        var taskFn = task.taskFn;
        var next = function () {
            //结束当前任务
            me.timeLine.stop();
            //执行下一个任务
            me._next(task);
        }
        taskFn(next, time);
    }

    this.timeLine.onEnterFrame = enterFrame;

    this.timeLine.start(this.interval);
}

module.exports = function () {
    return new Animation();
}