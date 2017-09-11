/**
 * Created by jiayanyan 
 * Date: 2017/9/7
 * Time: 10:22
 * 
 */
'use strict';

/**
 * 预加载图片
 * @param images 图片数组或者对象
 * @param callback 全部图片加载完毕后的回调函数
 * @param timeout 加载超时的时长
 * @constructor
 */
function loadImage(images,callback,timeout) {
    //加载完成图片的计数器
    var count = 0;
    //全部加载成功的标志
    var success = true;
    //超时timer
    var timeoutId = 0;
    //是否加载超时的标志位
    var isTimeout = false;
    //对图片数组或者对象进行便利
    for(var key in images){
        //过滤prototype上的属性
        if(images.hasOwnProperty(key)){
            continue;
        }
        //获取每个图片元素
        //格式obj: {src:xx}
        var item = images[key];
        //
        if(typeof item === 'string'){
            item = images[key] = {
                src : item
            }
        }
        //如果格式不满足，则丢弃，进行吓一跳数据
        if(!item  || !item.src){
            continue;
        }

        //计数+1
        count++;
        //设置图片id
        item.id = '__img'+key+getId();
        //设置图片元素的img，他是一个img对象
        item.img = window[item.id] = new Image();

        doLoad(item);
    }
    //遍历完成，如果计数为0，直接调用callback
    if(!count){
        callback(success);
    }else if (timeout){
        timeoutId = setTimeout(onTimeOut,timeout);
    }
//超时函数
    function onTimeOut() {
        isTimeout = true;
        callback(false);
    }
    /**
     *图片加载
     * @param item 图片元素
     */
    function doLoad(item) {
        item.status = 'loading';
        var img =  item.img;
        /*图片加载回调*/
        img.onLoad = function () {
            success = success & true;
            img.status = 'loaded';
            done();

        }
        //加载失败
        img.onError=function () {
            success = false;
            item.status = 'error';
            done();
        }
//发起一个http请求去加载图片
        img.src = item.src;
        /**
         * 每张图片加载完成的回调函数
         */
        function done() {
            img.onload = img.onError = null;

            try{
                delete window[item.id];
            }catch (e){

            }
            //每张图片在家完成，计数器减1
            //当所有图片加载完成，且没有超时，清楚定时器
            if(!--count && isTimeout){
                clearTimeout(timeoutId);
                callback(success);
            }
        }
    }
}

var _id = 0;
function getId() {
    return ++_id;
}

module.exports = loadImage;