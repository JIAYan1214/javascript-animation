/**
 * Created by jiayanyan 
 * Date: 2017/9/6
 * Time: 10:34
 * 
 */
/**
 * 获取dom对象
 * @param id
 * @returns {Element}
 */
function $(id) {
    return document.getElementById(id);
}
var $rabbit1 = $('rabbitRun1');
var $rabbit2 = $('rabbitRun2');
var $rabbit3 = $('rabbitRun3');
var $rabbit4 = $('rabbitRun4');
var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
var rabbitWinMap = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
var rabbitLoseMap = ["0 0", "-163 0", "-327 0", "-491 0", "-655 0", "-819 0", "0 -135", "-166 -135", "-333 -135", "-500 -135", "-668 -135", "-835 -135", "0 -262"];
var  imgUrl= ['style/img/rabbit-big.png','style/img/rabbit-lose.png','style/img/rabbit-win.png'];
var animation =  window.animation;

function rapeat() {
    var repeatAnimation = animation().loadImage(imgUrl).changePosition($rabbit1 ,rightRunningMap ,imgUrl[0]).repeatForever();
    repeatAnimation.start(80);
}
/*重复奔跑*/
rapeat();

function win() {
    var winAnimation=animation().loadImage(imgUrl).changePosition($rabbit2 , rabbitWinMap ,imgUrl[2]).repeat(3).then(function () {
        console.log('win animation repeat 3 times finished');
    });
    winAnimation.start(200);
}
win();

function lose() {
    var loseAnimation = animation().loadImage(imgUrl).changePosition($rabbit3, rabbitLoseMap,imgUrl[1]).wait(1000).repeat(1).then(function(){
        console.log('lose animation repeat  time and finished');
    });
    loseAnimation.start(200);
}
lose();

function run(){
    var speed = 6;
    var initLeft = 100;
    var finalLeft = 400;

    var frameLen = 6;
    var frame = 4;
    var right = true;
    var interval = 50;
    var runAnimation = animation().loadImage(imgUrl).enterFrame(function(success , time){
            var radio = (time) / interval ;
            var position;
            var left;
            //向右
            if(right){
                position = rightRunningMap[frame].split(' ');
                left = Math.min(initLeft + speed*radio,finalLeft);
                if(left === finalLeft){
                    right = false;
                    frame = 4;
                    success();
                    return;
                }
               
            }else{//从右向左
                position = leftRunningMap[frame].split(' ');
                left = Math.max(initLeft, finalLeft-speed*radio);
                if(left === initLeft){
                    right = true;
                    frame = 4;
                    success();
                    return;
                }

            }

            $rabbit4.style.backgroundImage = 'url('+imgUrl[0]+')';
            $rabbit4.style.backgroundPosition = position[0]+'px '+position[1]+'px';
            $rabbit4.style.left = left+'px';
            frame++;
            if(frame === frameLen){
                frame = 0;
            }
    }).repeat(1).wait(1000).changePosition($rabbit4 , rabbitWinMap , imgUrl[2]).then(function(){
        console.log('run finished');
    });
    runAnimation.start(interval);
}
run();
/*
单个对象

var positions = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
var elem=document.getElementById('rabbitRun');*/






/*animation(elem,positions,imgUrl);*/
/*
* 实现兔子跑的动画
* elem:元素
* positions：位置数组
* imgUrl:图片地址
* */
/*
function animation(elem,positions,imgUrl) {

    elem.style.backgroundImage = 'url('+imgUrl+')';
    elem.style.backgroundRepeat = 'no-repeat';//禁止循环

    var index = 0;//记录播放位置当前位置


    function run(){

        var position = positions[index].split(' ');//获取当前图片的位置
        elem.style.backgroundPosition = position[0]+'px '+position[1]+'px';//当前元素图片的位置赋值
        index++;//继续执行下一帧

        if(index>=positions.length){
            index = 0;
        }
        setTimeout(run,80);
    }

    run();

}*/
