// ==UserScript==
// @name         Hrmis
// @namespace    http://inner-portal.ccs.org.cn/hrmis/
// @version      0.1(20161011)
// @description  Just for fun!
// @author       You
// @match        http://inner-portal.ccs.org.cn/hrmis/exam/exam!examOnline.do?className=*
// @grant        none
// @updateURL    https://github.com/last2003/hrmis/raw/master/Hrmis.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var results=[];
    var url=window.location.href.replace(/examOnline/,"examResult");//考试结果连接

    function addText(innerHtml){
        //添加内容到页面

        if($("div#addDiv")){
            $("div#addDiv").remove();
        }

        let addtext = '<br><div id=addDiv style="margin: 0 auto 0 auto; ' +
            'border-bottom: 1px solid #429cff; margin-bottom: 5px; ' +
            'font-size: small; background-color: #429cff; ' +
            'color: #ffffff;"><p style="margin: 2px 0 1px 0;"> ' +
            innerHtml +
            '</p></div>';
        $("iframe#answerFrame").height("60%");
        $("iframe#answerFrame").after(addtext);
    }

    function getResults(){
        $.get(url,function(data,status){
            $(data).find('div.subject').each(function(){
                if($(this).find('p')){
                    let ans={
                        subject:$(this).find('b').text().trim(),//题干  v1.01 p->b
                        options:$(this).find("table[style='margin-left:20px;']:first").html(),//选项
                    };
                    results.push(ans);
                }
            });
            if(results.length>0){
                addText('加载成功,可以开始考试了');
            }else{
                addText('加载失败');
            }
        },'html');
    }

    function makeDiv(sub,options){
        var outer='<div><p>'+
            sub+
            '</p><br><table>'+
            options+
            '</table><br></div>';
        return outer;

    }


    $("iframe#answerFrame").load(function(){
        if(results.length===0){
            addText('正在加载,请稍等...');
            getResults();
        }
        let resultsHtml='';

        if($("iframe#answerFrame").contents().find("div.subject")){
            let sub=$("iframe#answerFrame").contents().find("div.subject").find("h5").text().replace(/\(\d{1,2}.0分\)/,"").trim();
            console.log(sub);
            for(var i=0;i<results.length;i++){
                if(sub===results[i].subject){
                    resultsHtml+=makeDiv(sub,results[i].options);
                }

            }

        }
        else{
            resultsHtml='没有找到题目哦';
        }

        addText(resultsHtml);
    });
})();