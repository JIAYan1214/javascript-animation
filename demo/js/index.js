/**
 * Created by jiayanyan 
 * Date: 2017/9/6
 * Time: 10:34
 * 
 */

var  imgUrl= 'style/img/rabbit-big.png';
var positions = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
var elem=document.getElementById('rabbitRun');

animation(elem,positions,imgUrl);
/*
* 实现兔子跑的动画
* elem:元素
* positions：位置数组
* imgUrl:图片地址
* */
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

}