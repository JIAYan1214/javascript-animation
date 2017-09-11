/**
 * Created by jiayanyan 
 * Date: 2017/9/7
 * Time: 15:30
 * 
 */
'use strict';
var  DEFAULT_INTERVAL = 1000/60;
//初始化状态
var STATE_INTERVAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;
/**
 * raf
 */
var requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback,callback.interval || DEFAULT_INTERVAL);
    }
})();

var cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
        return window.clearTimeout(id);
    }
})();

/**
 * TimeLine 时间轴类
 * @constructor
 */
function TimeLine() {


}

/**
 * 时间轴上每一次回调执行的函数
 * @param time 从动画开始到当前执行的时间
 */
TimeLine.prototype.onEnterFrame = function (time) {
    this.animationHandler = 0;
}
/**
 * 动画开始
 * @param interval 每一次回调的间隔时间
 */
TimeLine.prototype.start =function (interval) {
    if(this.state === STATE_START) return;

    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;
    startTimeLine(this,+new Date());
};
/**
 * 动画停止
 */
TimeLine.prototype.stop = function () {
    if(this.state !== STATE_START){
        return;
    }
    this.state = STATE_STOP;
    //如果动画开始过，则记录动画开始到现在所经历的时间
    if(this.startTime){
        this.dur = +new Date() -  this.startTime;
    }
    cancelAnimationFrame(this.animationHandler);

};
/**
 * 重新启动
 */
TimeLine.prototype.restart = function () {
    if(this.state === STATE_START) return;
    if(!this.dur || !this.interval){
        return;
    }

    this.state = STATE_START;
    //无缝链接动画
    startTimeLine(this,+new Date() - this.dur);
};

/**
 * 时间轴动画启动函数
 * @param timeLine 时间轴实例
 * @param startTime 动画开始时间戳
 */
function startTimeLine(timeLine,startTime) {
    timeLine.startTime = startTime;
    nextTick.interval = timeLine.interval;
    //记录上一次回调的时间戳
    var lastTick = +new Date();
    nextTick();
    /**
     * 定义每一帧执行的函数
     */
    function nextTick() {
        var now  = +new Date();

        timeLine.animationHandler = requestAnimationFrame(nextTick);
        //如果当前时间与上一次回调的时间戳大于设置时间间隔
        //表示这一次可以执行回调函数
        if(now - lastTick >= timeLine.interval){
            timeLine.onEnterFrame(now - startTime);
            lastTick  = now;
        }
    }
}
module.exports = TimeLine;