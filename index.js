// 通讯录功能:添加,删除,修改,查找联系人,获取全部联系人
// GET请求(拿):获取全部联系人,查找联系人,删除
// POST请求(给):添加,修改
const express=require('express')    // http主要框架
const app=express()
const bodyParser=require('body-parser')  // 解析http请求体的工具
// const jsonParser=bodyParser.json()
const urlencodedparser=bodyParser.urlencoded({extended:false})
const { ObjectID } = require('mongodb')
// 数据库
const MongoControl=require('./es6封装dbc升级').MongoControl
const contactControl=new MongoControl('test','contact')

// 错误处理函数
var handle500=function(res){
    res.status(500).send('数据库查询错误')
}

app.use(express.static('./static'))
// 获取全不联系人
app.get('/getAllContact',(req,res)=>{
    contactControl.find({},(err,result)=>{
        if(err){
            handle500(res)
            return
        }
        res.send(result)
    })
})
// 获取一个联系人
app.get('/getContact',(req,res)=>{
    var _id=req.query._id
    contactControl.findById(_id,(err,result)=>{
        if(err){
            handle500(res)
            return
        }
        res.send(result)
    })
})
// 查找联系人
// http://localhost:4001/search?wd=18845116443
app.get('/search',(req,res)=>{
    var wd=req.query.wd
    // 正则表达式
    var reg=new RegExp(wd,'i')
    contactControl.find({
        // 可以对name进行搜索
        // 也可以对phoneNumber进行搜索
        // 需要用正则表达式去匹配字符
        $or:[
            {name:{$regex:reg}},
            {phoneNumber:{$regex:reg}}
        ]
    },(err,result)=>{
        if(err){
            handle500(res)
            return
        }
        res.send(result)
    })
})
// 删除联系人
// http://localhost:4001/remove?_id=605317f4a67f93afebd71de2
app.get('/remove',(req,res)=>{
    var _id=req.query._id
    contactControl.removeById(_id,(err,result)=>{
        if(err){
            handle500(res)
        }
        res.send(result)
    })
})
// 添加联系人
app.post('/addContact',urlencodedparser,(req,res)=>{
    // 抽取提交的联系人姓名,联系电话
    var {name,phoneNumber}=req.body
    var data={
        name:name,
        phoneNumber:phoneNumber
    }
    contactControl.insert(data,(err,result)=>{
        if(err){
            handle500()
            return
        }
        res.send({result:'ok'})
    })
})
// 修改联系人
// 1.找到联系人__修改某个属性*****
// 2.删除旧联系人__重新创建
app.post('/revise',urlencodedparser,(req,res)=>{
    // 1.获取id,新的名字,新的号码
    var {_id,name,phoneNumber}=req.body
    contactControl.updateById(_id,{name:name,phoneNumber:phoneNumber},function(err,result){
        if(err){
            handle500(res)
            console.log('修改联系人中插入数据出错')
            return
        }
        res.send({result:'ok'})
    })
    // **********
    // 覆盖方法
    // 不太好
    // contactControl.insert({
    //     name:name,
    //     phoneNumber:phoneNumber
    // },(err,result)=>{
    //     if(err){
    //         handle500(res)
    //         console.log('修改联系人中插入数据出错')
    //         return
    //     }
    //     contactControl.removeById(_id,(error,result)=>{
    //         if(error){
    //             handle500(res)
    //             console.log('修改联系人,删除旧数据出错')
    //             return
    //         }
    //         res.send({result:'ok'})
    //     })
    // })
})
app.listen(4001)
