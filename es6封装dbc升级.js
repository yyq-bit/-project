const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectId=mongodb.ObjectId
const mongodbUrl='mongodb://127.0.0.1:27017'

class MongoControl{
    constructor(dbName,tableName){
        this.dbName=dbName
        this.tableName=tableName
    }
    __init__(callback){
        MongoClient.connect(mongodbUrl,{useNewUrlParser:true},(err,client)=>{
            if(err){
                callback(err)
                return
            }
            var db=client.db(this.dbName)
            callback(
                null,db.collection(this.tableName),client
            )
        })
    }
    find(findQuery,callback){
        this.__init__((err,collection,client)=>{
            collection.find(findQuery).toArray((err,res)=>{
                callback(err,res)
                client.close()
            })
        })
    }
    findById(_id,callback){
        var findQuery={_id:ObjectId(_id)}
        this.find(findQuery,callback)
    }
    insert(data,callback){
        this.__init__((err,collection,client)=>{
            collection.insert(data,(err,res)=>{
                callback(err,res)
                client.close()
            })
        })
    }
    removeById(_id,callback){
        this.__init__((err,collection,client)=>{
            collection.remove({_id:ObjectId(_id)},(err,result)=>{
                callback(err,result.result)
                client.close()
            })
        })
    }
    update(findQuery,newData,callback){
        this.__init__((err,collection,client)=>{
            collection.update(findQuery,{$set:newData},(err,res)=>{
                callback(err,res)
                client.close()
            })
        })
    }
    updateById(_id,newData,callback){
        var findQuery={_id:ObjectId(_id)}
        this.update(findQuery,newData,callback)
    }
}
var user=new MongoControl('test','test')
// user.find({
//     name:'qf'
// },function(err,res){
//     console.log(res)
// })
// user.insert({
//     name:'yyq',
//     age:20
// },function(err,res){
//     console.log(res)
// })
// user.update({name:'yyq'},{age:21},function(err,res){
//     console.log(res)
// })
// user.removeById("6052cbe64d5dc403b57c7cff",function(err,res){
//     console.log(res)
// })
// user.findById("6051e46c0eb8c96a3fa38d75",(err,res)=>{
//     console.log(res)
// })
// user.updateById("6051e46c0eb8c96a3fa38d75",{age:47},(err,res)=>{
//     console.log(res)
// })
// 把整个构造器引出去
exports.MongoControl=MongoControl