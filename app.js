var express = require("express");
var path = require("path");
var router = require("./router");
var bodyParser = require("body-parser");
var session = require('express-session')

var app = express();

app.use("/public", express.static(path.join(__dirname, './public/')));
app.use("/node_modules", express.static(path.join(__dirname, './node_modules/')));

app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/')); //默认就是./views目录,后期可以修改

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//Express框架中，默认不支持session和cookie
//可以使用第三方中间件：express-session
//安装，配置
//使用：
//	req.session来发访问和设置session成员
//	添加session数据：req.session.foo='bar'
//	访问session数据：req.session.foo
app.use(session({
	secret: 'keyboard cat', //配置加密字符串，它会在原有加密基础上和这几个字符串拼起来再加密 
	resave: false,
	saveUninitialized: true //无论是否使用session，都默认分配一把钥匙
}))

//路由挂载要在配置解析表单之后，才不会有问题
app.use(router)

//配置一个处理404的中间件
app.use(function(req, res) {
	res.render("404.html");
})

//配置一个错误处理的中间件
app.use(function(err, req, res, next) {
	return res.status(500).json({
		err_code: 500,
		message: err.message
	})
})

app.listen(3000, function() {
	console.log("监听3000")
})