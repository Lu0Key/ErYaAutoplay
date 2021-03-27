/*
 * 作者：洛七
 * 可选参数：开始的章节、倍速
 * 使用方法：
 * 1. 打开尔雅，点到视频页面
 * 2. F12，点击控制台(console)
 * 3. 将文本中的内容复制进去，回车即可
 * 4. 会看到一个按钮，点击即可
 * 说明：默认没有做过章节测试，做过会有影响
 *           直接把所有内容复制即可
 *           可能会有一些 bug，刷新一下从第一章重新复制，重新开始即可(会跳过刷过的)
 *           可以切到别的应用，但是这个标签页不要切掉，不然不会继续播放
 * -------------------------
*/
// 希望脚本从第k章开始看就写成
// chapter=k-1; (建议不改，差别很小)
var chapter = 0;
// Rate 为倍速，自己调，最高16，默认16
var Rate = 16;

var fa = $("body");
var btn = $("<li></li>");
var json = {
    "background": "#31e16d",
    "height": "16px",
    "padding": "5px",
    "z-index": 999999,
    "cursor": "pointer",
    "top": "300px",
    "right": "120px",
    "position": "fixed"
};
btn.css(json);
btn.html("<span id='lfsenior'>开启自动播放模式</span>");
fa.append(btn);



var size = $('#coursetree.onetoone > .cells').length;
var dianji = 0;
var i = 1;


btn.click(function () {

    var timer= setInterval(function () {
        var iframe= $("#iframe").contents().find("iframe").contents();
        var video=iframe.find("#video_html5_api")[0];
        
        if(video == undefined){
            console.log("稍等...");
            if (dianji == 0){
                console.log("加载视频中...");
                $('.tabtags > span')[1].click();
                dianji++;
            }
            setTimeout(function () {
                video=iframe.find("#video_html5_api")[0];
            },5000);
        }

        //播放函数
        var play = function () {
            // 16为最高倍率，可自己调倍速
            video.playbackRate = Rate;
            video.muted = true;
            video.play();
            
        }
        //如果正在加载
        var load = iframe.find("#loading");
        if (load.css("visibility") != "hidden") {
            return;
        }
        //获取当前进度
        var currents  = $("#selector .currents");

        var spans = iframe.find("#video > div.vjs-control-bar > div.vjs-progress-control.vjs-control > div").attr("aria-valuenow");
        var count = $(currents).find("span.jobCount").html();
        // 如果还没播放完
        if (spans != 100 && count === "2") {
            play();
        }
        //如果播放结束
        
        if (spans == 100 || count === "1") {
            var cells=$("#selector .currents").parent().parent();
            console.log("已经完成："+$("#selector .currents >a").attr('title'));
            ncell = cells.find(".ncells");
            var tag = 0;
            for(;i<2*ncell.length;){
                i++;
                tag = 1;
                cell = ncell[i%ncell.length];
                count = $(cell).find("h4 > span.jobCount").html();
                if (count == null){
                    clearInterval(timer);
                    clearInterval(timer2);
                }
                if (count === "2"){
                    tag = 0;
                    $(cell).find('a')[0].click();
                    setTimeout(console.log("稍等..."),2000);
                    video=iframe.find("#video_html5_api")[0];
                    spans = 0;
                    break;
                }
            }
            if(tag === 1){
                i = 0;
                dianji =0;
                chapter++;
                cells = $('#coursetree.onetoone > .cells')[chapter];
                ncell = $(cells).find(".ncells");
                cell = ncell[0];
                $(cell).find('a')[0].click();
                console.log("这一章结束了");
            }
            if(chapter === size-1){
                clearInterval(timer);
                clearInterval(timer2);
            }
        }
        $("#lfsenior").html("自动模式已开启,本节进度:" + spans + "%");
    }, 100);
});

var timer2 = window.setInterval(function(){
    var iframe= $("#iframe").contents().find("iframe").contents();
    var video=iframe.find("#video_html5_api")[0];
    video.onmouseout=function(){
        return true;
    }
    if(video.ended){//视频播放完
        console.log("视频已播完");
    }
    let ul=iframe.find(".ans-videoquiz-opts:visible");
    if(ul){//有题目出现
        iframe.find(".ans-videoquiz-opts input[value='true']").attr("checked",true);
        iframe.find(".ans-videoquiz-submit").trigger("submit");
    }
}, 3000);