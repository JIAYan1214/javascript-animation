/**
 * Created by jiayanyan 
 * Date: 2017/9/11
 * Time: 9:25
 * 
 */
module.exports = {
    entry :{
        animation : './animation/animation.js'
    },
    output :{
        path: __dirname+'/animation/build',
        filename:'[name].build.js',
        library:'animation',
        libraryTarget: 'umd'

    }
}