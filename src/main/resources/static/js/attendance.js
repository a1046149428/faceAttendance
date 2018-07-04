
//获取公司人员
$.getJSON("/getDepts",function (data) {
        //只演示一个了
    let dept1=data.depts[0].users;
//清空原来的内容
    $("#hr").empty();
    for(let i=0;i<dept1.length;i++) {

        $("#hr").append("<a href='#' data-toggle='modal' onclick='face(this)' data-target='#exampleModalCenter' id="+dept1[i].id+">"+dept1[i].name+"</a>");

    }
});

//------------------------------分割线------------------------------------


//访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints,success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

function success(stream) {
    //兼容webkit核心浏览器
    let CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    console.log(stream);

    //video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    video.play();
}

function error(error) {
    console.log('访问用户媒体设备失败${error.name}, ${error.message}');
}

if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    //调用用户媒体设备, 访问摄像头
    getUserMedia({video : {width: 480, height: 320}}, success, error);
} else {
    alert('不支持访问用户媒体');
}



function face(e1) {
    let id=$(e1).attr("id");
    context.drawImage(video, 0, 0, 480, 320);
    var  imgdata = canvas.toDataURL("image/jpg");
    //去除base64编码头
    imgdata = imgdata.replace(/^data:image\/(png|jpg);base64,/,"");
    var img="img";
    $.ajax({
        type: 'POST',
        url:  "/facePost",
        data: { "imageData" : imgdata,"id" :id},
        success: function (e) {

            if (e==0){
                $("#xBar").css("transition","2s");
                $("#xBar").css("width","100%");
                $("#xBar").text("100%");
                setTimeout(function () {
                    alert('Congratulations,attendance successfully!');
                    window.location.href="/faceAttendance";
                },1000)

            }else{
                if (e==1){
                    alert("fail to attendance,please try again!");
                    window.location.href="/faceAttendance";
                }
            }
        }
    });
}


/*
//实现1s内自动增加百分比
function doit(x) {
    console.log(x);
    x++;
    $("#xBar").text(x+"%");
    if(x<100) setTimeout('doit()',10);
}*/
