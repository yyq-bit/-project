var contactList=$('#contact-list')
var addContactBtn=$('#add-contact-btn')
var addContactModal=$('#add-contact-modal')
var addContactSubmit=$('#add-contact-submit')
var addContactName=$('#name')
var addContactPhoneNumber=$('#phoneNumber')
var reviseContactModal=$('#revise-contact-modal')
var reviseSubmit=$('#revise-submit')
var reviseName=$('#revise-name')
var revisePhoneNumber=$('#revise-phoneNumber')
var searchInput=$('#search-input')
var revise_id=''  //保存当前要修改的id
// var contact={
//     arr:[],
//     getAllContactById:function(_id){
//         for(var i=0;i<this.arr.length;i++){
//             if(this.arr[i]._id==_id){
//                 return this.arr[i]
//             }
//         }
//         return null
//     }
// }
// 这样获取不到removeBtn
// 因为是先调用main函数,在getAllContact(),再fillData()
// 调用完fillData()页面中才有remove-btn这个新增的类名
// 而获取元素是在最开始就可以获取
// 所以获取不到,同理 revise-btn也获取不到
// var removeBtn=$('.remove-btn')
// 让填充完页面就获取这个元素
var addEventListener=function(){
    // 删除联系人
    var removeBtn=$('.remove-btn')
    removeBtn.on('click',function(){
        var _id=$(this).attr('data-id')
        //  点击按钮__删除联系人
        removeContact(_id)
    })
    // 修改联系人
    var reviseBtn=$('.revise-btn')
    reviseBtn.on('click',function(){
        reviseContactModal.modal('show')
        revise_id=$(this).attr('data_id')
        // ********
        // var nowRevise=contact.getAllContactById(revise_id)
        // 点击修改联系人之后
        // 把弹出的框框联系人的名字,号码都显示出来
        // if(nowRevise){
        //     reviseName.val(nowRevise.name)
        //     revisePhoneNumber.val(nowRevise.phoneNumber)
        // }
        // ***********
        // 点击修改联系人之后
        // 去node的获取一个联系人接口
        // 去获取当前联系人信息
        $.ajax({
            type:'GET',
            url:'/getContact',
            data:{
                _id:revise_id
            },success:function(e){
                // console.log(e)
                var nowRevise=e[0]
                if(nowRevise){
                    reviseName.val(nowRevise.name)
                    revisePhoneNumber.val(nowRevise.phoneNumber)
                }
            }
        })
    })
}
// 获取全部联系人
var getAllContact=function(){
    $.ajax({
        type:'GET',
        url:'/getAllContact',
        data:{

        },
        success:function(result){
            // console.log(result)
            // 赋值
            // contact.arr=result
            // 成功获取信息后
            // 填充页面
            fillData(result)
        }
    })
}
// 填充到页面中
var fillData=function(arr){
    var html=''
    arr.forEach(element => {
        // 每次填充新页面的时候给删除联系人按钮添加id属性
        html+=`
            <li class="list-group-item">
                <h3>${element.name}</h3>
                <p>${element.phoneNumber}</p>
                <div class="btn-group" role="group" aria-label="...">
                    <a type="button" href="tel:${element.phoneNumber}" class="btn btn-default">拨打号码</a>
                    <button type="button" class="btn btn-default revise-btn" data_id="${element._id}">修改联系人信息</button>
                    <button type="button" class="btn btn-default remove-btn" data-id="${element._id}">删除联系人</button>
                </div>
            </li>`
    });
    contactList.html(html)
    // *****
    addEventListener()
}
// 添加联系人
var addContact=function(name,phoneNumber){
    $.ajax({
        type:'POST',
        url:'/addContact',
        data:{
            name:name,
            phoneNumber:phoneNumber
        },
        success:function(result){
            // 添加完之后,重新调用获取全部联系人方法
            getAllContact()
        }
    })
}
// 删除联系人
var removeContact=function(_id){
    $.ajax({
        type:'GET',
        url:'/remove',
        data:{
            _id:_id
        },
        success:function(){
            getAllContact()
        }
    })
}
// 修改联系人
var reviseContact=function(_id,phoneNumber,name){
    $.ajax({
        type:'POST',
        url:'/revise',
        data:{
            _id:_id,
            name:name,
            phoneNumber:phoneNumber
        },
        success:function(){
            getAllContact()
        }
    })
}
var search=function(wd){
    $.ajax({
        type:'GET',
        url:'/search',
        data:{
            wd:wd
        },success:function(e){
            // console.log(e)
            fillData(e)
        }
    })
}
// 初始化监听器
var initListener=function(){
    // 添加联系人
    addContactBtn.on('click',function(){
        addContactModal.modal('show')
    })
    addContactSubmit.on('click',function(){
        var name=addContactName.val()
        // 添加完记得清空
        addContactName.val('')
        var phoneNumber=addContactPhoneNumber.val()
        addContactPhoneNumber.val('')
        addContact(name,phoneNumber)
        addContactModal.modal('hide')
    })
    reviseSubmit.on('click',function(){
        // 获取名字,电话
        var name=reviseName.val()
        reviseName.val('')
        var phoneNumber=revisePhoneNumber.val()
        revisePhoneNumber.val('')
        var id=revise_id
        revise_id=''
        reviseContact(id,phoneNumber,name)
        reviseContactModal.modal('hide')
    })
    searchInput.on('input',function(){
        // console.log($(this).val())
        search($(this).val())
    })
}
// 主函数
var main=function(){
    getAllContact()
    initListener()
}
main()