$(function () {
    var socket = io();

    var _username = null;
    var html='';
    var userstatus=false;

    //设置用户名
    var setUsername = function () {
        _username = $("#name").val().trim();
        if (_username) {
            socket.emit("login", {username: _username});
        }
    };

    //开始聊天
    var beginChat = function (data) {
        $(".login-container").css("display", "none");
        $(".chat-container").css("display", "block");
       
    };

    //发送消息
    var sendMessage = function () {
        var _message = $(".chatinput").val();

        if (_message) {
            socket.emit("sendMessage", {username: _username, message: _message});
        }
    };

    // 获取时间
    function currentTime() {
        var d = new Date(),
            str = '';
        str += d.getFullYear() + '-';
        str += d.getMonth() + 1 + '-';
        str += d.getDate() + '  ';
        str += d.getHours() + ':';
        str += d.getMinutes() + ':';
        str += d.getSeconds();
        return str;
    }

    //显示消息
    var showMessage = function (data) {
        if (data.username === _username) {
            $(".chat-content").append("" +
                "<div class='clearfloat'>" +
                "   <div class='time-column'>" +
                "       <small class='chat-date'>" + currentTime() + "</small>" +
                "   </div>" +
                "   <div class='right'>" +
                "       <div class='chat-nickname'>" + data.username + "</div>" +
                "       <div class='chat-message'>" + data.message + "</div>" +
                "       <div class='chat-avatars'></div>" +
                "   </div>" +
                "</div>");
        } else {
            $(".chat-content").append("" +
                "<div class='clearfloat'>" +
                "   <div class='time-column'>" +
                "       <small class='chat-date'>" + currentTime() + "</small>" +
                "   </div>" +
                "   <div class='left'>" +
                "       <div class='chat-nickname'>" + data.username + "</div>" +
                "       <div class='chat-avatars'></div>" +
                "       <div class='chat-message'>" + data.message + "</div>" +
                "   </div>" +
                "</div>");
        }
    };

    //点击登录按钮触发setUsername();
    $("#loginbtn").on("click", function () {
        setUsername();
    });

    //用户名表单中回车触发setUsername();
    $("#name").on("keyup", function (event) {
        if (event.keyCode === 13) {
            setUsername();
        }
    });

    //发送信息表单中回车触发 sendMessage();
    $("#chatinput").on("keyup", function (event) {
        if (event.keyCode === 13) {
            sendMessage();
            $("#chatinput").val(""); //清空
        }
    });


    /**socket.io部分逻辑代码*/
    // 验证用户名是否重复
    socket.on('judgeUsername', function (data) {
        $(".login-container .form-group").append("<div class='judge-warm'>用户名重复!</div>");
        setTimeout(function () {
            $(".judge-warm").remove();
        }, 1500)
    });

    //监听到登录成功后
    socket.on("loginSuccess", function (data) {
       
        if (data.username === _username) {
            beginChat(data);
            userstatus=true
        }
        if(userstatus){
            html='<li>'+data.username+'进入房间</li>'
            $('#userlist').append(html)
        }
    });

    //监听到事件发生就 显示消息
    socket.on("receiveMessage", function (data) {
        showMessage(data);
    });


});