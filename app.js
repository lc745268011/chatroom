var express = require("express"); //引用express模块
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");

server.listen("3000",function () {
   console.log("正在监听端口 3000");
});

app.get("/",function (req,res) {
   res.redirect("./chat.html");
});

app.use("/",express.static(path.join(__dirname, "/public")));


var users = []; //用来保存所有的用户信息  

io.on("connection",function (socket) {

    socket.on("login",function (data) {
        /**
         * 先保存在socket中
         * 循环数组判断用户名是否重复,如果重复，则触发usernameErr事件
         * 将用户名删除，之后的事件要判断用户名是否存在
         */
        socket.username = data.username;

        for (var user in users) {
            if(users[user].username === data.username){
                socket.emit('judgeUsername',{err: '用户名重复'});
                socket.username = null;
                break;
            }
        }
        //如果用户存在，将该用户的信息存进数组中
        if (socket.username){
            users.push({
                username: data.username,
                message: []
            });
            ///然后触发loginSuccess事件告诉浏览器登陆成功了
            io.emit("loginSuccess",data);
        }
    });

    //发送消息
    socket.on("sendMessage",function (data) {
        for (var _user in users){
            if (users[_user].username === data.username ){
                users[_user].message.push(data.message);

                //信息存储之后触发receiveMessage将信息发给所有浏览器
                io.emit("receiveMessage",data);
                break;
            }
        }
    });

    //断线
    socket.on("disconnect",function () {

    });
});
