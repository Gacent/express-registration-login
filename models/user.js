var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/test",{useNewUrlParser:true});
var Schema=mongoose.Schema;


var userSchema=new Schema({
	email:{
		type:String,
		required:true
	},
	nickname:{
		type:String,
		require:true
	},
	password:{
		type:String,
		require:true
	},
	created_time:{
		type:Date,
		//注意这里不要写Date.now()，因为会即刻调用
		//直接给方法:Date.now
		//当你去new Model的时候，如果没有传递create_time,则mongoose会调用default指定的方法，使用其返回值作为默认值
		default:Date.now
	},
	last_modified_time:{
		type:Date,
		default:Date.now
	},
	avatar:{
		type:String,
		default:'/public/img/avatar-max-img.png'
	},
	bio:{	//简介
		type:String,
		default:""
	},
	gender:{
		type:Number,
		enum:[-1,0,1],
		default:-1
	},
	birthday:{
		type:Date
	},
	status:{
		type:Number,
		//0 没有权限限制
		//1 不可以评论
		//2 不可以登录
		//是否可以评论
		//是否可以登录使用
		enum:[0,1,2],
		default:0
	}
})

module.exports=mongoose.model('User',userSchema);
