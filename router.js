var express = require("express");
var User = require("./models/user");
var md5 = require("blueimp-md5");
var router = express.Router();

router.get("/", function(req, res, next) {
	var user = req.session.user;
	//console.log(user)
	res.render("index.html", {
		user: user
	});
})

router.get("/login", function(req, res, next) {
	res.render("login.html");
})

router.post("/login", function(req, res, next) {
	//1.获取数据
	//2.查询数据库，用户名密码是否正确
	//3.发送响应数据
	var body = req.body;
	User.findOne({
		email: body.email,
		password: md5(md5(body.password))
	}, function(err, user) {
		if(err) {
			return next(err);
		}
		if(!user) {
			return res.status(200).json({
				err_code: 1,
				message: "Email or password is invalid"
			})
		}
		//记录session
		req.session.user = user;
		return res.status(200).json({
			err_code: 0,
			message: "ok"
		})
	})
})

router.get("/register", function(req, res, next) {
	res.render("register.html");
})

router.post("/register", function(req, res, next) {
	//1.获取表单提交数据
	//	req.body
	//2.操作数据库
	//	判断用户是否存在
	//	如果已经存在，不允许注册
	//	如果不存在，注册新建用户
	//3.发送响应
	var body = req.body;

	//express提供一个响应方法：json
	//该方法接收一个对象作为参数，会自动转换成字符串发送给浏览器   
	User.findOne({
		$or: [{
				email: body.email
			},
			{
				nickname: body.nickname
			}
		]
	}, function(err, data) {
		if(err) {
			return next(err);
		}
		if(data) {
			return res.status(200).json({
				err_code: 1,
				message: '邮箱或昵称已经存在'
			})
		}
		body.password = md5(md5(body.password));
		new User(body).save(function(err, user) {
			if(err) {
				return next(err);
			}
			req.session.user = user;
			return res.status(200).json({
				err_code: 0,
				message: 'ok'
			})
		})
	})
})

router.get("/logout", function(req, res, next) {
	//清除登录状态
	//重定向登录页
	req.session.user = null;
	res.redirect("/login");
})

module.exports = router;