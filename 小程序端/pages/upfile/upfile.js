// pages/upfile/upfile.js
import * as api from '../../static/api.js'
import * as inter from '../../static/interface.js'
var select
var targetFormat,fileName
const app = getApp();

//滑动切换页面
var startx,endx
var touch=false//是否触摸

var focus=false//转码格式输入框是否聚焦
var input1=false,input2=false//是否输入

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileType:'',
    filePath:'',
    name:'file',
    formData:{
      fileName:'',
      targetFormat:''
    },
    select:'',
    hideselect:true,
    img:false,
    aud:false,
    vid:false
  },

  //展示对话框
  show:function(){
    this.clearfile();
    this.setData({
      hideselect:false
    })
  },

  //选择图片
  addimg:function(){
    var that = this //访问域这里出过bug
    wx.chooseImage({
        success: function(res) {
          console.log('选择图片')
          console.log(res)
          var tmp = res.tempFilePaths[0]
          var pos = tmp.lastIndexOf('.')
          var i=0;
          var select="图片目标格式包括";
          for(i=0;i<app.globalData.image.length;i++)
            select += app.globalData.image[i]+'. ';
          that.setData({
            filePath: tmp,
            fileType: tmp.substr(pos+1,tmp.length),
            select:select,
            img:true,
            aud:false,
            vid:false,
          })
        },
        fail:function(res){
          wx.showToast({
            title: res.errMsg,
            icon:'none'
          })
          that.setData({
            img:false
          })
        }
      })
    },
  
  //添加音频
  addaud:function(){
    var that=this;
      wx.chooseVideo({
        success: function(res) {
          console.log('选择音频')
          console.log(res)
          var tmp = res.tempFilePath
          var pos = tmp.lastIndexOf('.')
          var i=0;
          var select="音频目标转码格式包括";
          for (i = 0; i < app.globalData.audio.length;i++)
            select += app.globalData.audio[i]+'. ';
          that.setData({
            filePath: tmp,
            fileType: tmp.substr(pos+1,tmp.length),
            select:select,
            aud:true,
            img:false,
            vid:false
          })
        },
        fail:function(res){
          wx.showToast({
            title: res.errMsg,
            icon:'none'
          })
          that.setData({
            aud:false
          })
        }
      })
  },

  //添加视频
  addvid:function(){
    var that=this;
      wx.chooseVideo({
        success: function(res) {
          console.log('选择视频')
          console.log(res)
          var tmp = res.tempFilePath
          var pos = tmp.lastIndexOf('.')
          var i=0
          var select="视频目标转码格式包括："
          for (i = 0; i < app.globalData.video.length;i++)
            select += app.globalData.video[i]+'. ';
          that.setData({
            filePath: tmp,
            fileType: tmp.substr(pos+1,tmp.length),
            select:select,
            vid:true,
            img:false,
            aud:false,
          })
        },
        fail:function(res){
          wx.showToast({
            title: res.errMsg,
            icon:'none'
          })
          that.setData({
            vid:false
          })
        }
      })
  },

  //清空信息，并取消展示对话框
  clearfile:function(){
    this.setData({
      fileType:'',
      filePath:'',
      formData:{
        fileName:'',
        targetFormat:''
      },
      select:'',
      hideselect:true,
      img:false,
      aud:false,
      vid:false
    })
  },

  //获取文件名称
  inputFN:function(e){
    input1=true;
    fileName=e.detail.value
    this.setData({
      formData:{
        fileName:fileName
      }
    })
  },

  //输入框获取焦点
  getfocus:function(){
    focus=true
  },

  //获取目标格式
  inputTF:function(e){
    console.log(focus)
    if(focus){
      var type=e.detail.value
      var tmp=new Array()
      console.log(this.data.img)
      if(this.data.img){
        tmp = app.globalData.image
      }
      else if(this.data.aud){
        tmp = app.globalData.audio
      }
      else if(this.data.vid){
        tmp = app.globalData.video
      }
      console.log(tmp.indexOf(type))
      if(tmp.indexOf(type)>-1){
        targetFormat=e.detail.value
        this.setData({
          formData:{
            targetFormat:targetFormat
          }
        })
        console.log('转码目标文件信息')
        console.log(this.data)
        input2=true
        focus=false
      }
     else {
        wx.showToast({
          title: '格式不匹配，请重新输入',
          icon:'none'
        })
     }
    }
  },

  //获取相关信息,取消展示对话框
  getInfo:function(){
    console.log('input1:'+input1)
    console.log('input2:'+input2)
    console.log(focus)
    if(!input2&&focus)
      this.inputTF();
    if(input1&&input2){
      fileName = fileName+'.'+this.data.fileType
      this.setData({
        formData:{
          fileName:fileName,
          targetFormat:targetFormat,
        },  
        hideselect:true
      })
      console.log('文件信息：')
      console.log(this.data)
      this.submit();
    }
    else{
      wx.showToast({
        title: '请填写完整!',
        icon:'none'
      })
    }
  },

  //上传文件并转码
  submit:function(){
    console.log('文件信息：')
    console.log(this.data)
    // api.postfile(inter.API_UPLOADFILE,this.data,app.globalData.sessionId, (res)=>{
    //       // wx.hideLoading()
    //       console.log('上传信息：')
    //       console.log(res)
    //       if(res.code == '000'){
    //         wx.showToast({
    //           title: '上传成功，转码中...'
    //         })
    //         app.globalData.fileId=res.fileId
    //         this.getstatus()
    //       }
    //       else{
    //         wx.showToast({
    //           title: '上传失败，请稍后重试',
    //           icon:'none'
    //         })
    //       }  
    var that=this;
    wx.uploadFile({
          header:{
            // 'content-type':'multipart/form-data',
            'content-type':'application/json',
            'sessionId':app.globalData.sessionId
          },
          url: api.baseUrl+inter.API_UPLOADFILE,
          filePath: this.data.filePath,
          name: this.data.name,
          formData:{
            fileName:this.data.formData.fileName,
            targetFormat:this.data.formData.targetFormat,
          },
          success(res){
            wx.showToast({
              title: '上传成功！',
            })
            console.log('上传信息：')
            console.log(res)
            var s = res.data
            s=s.substring(s.lastIndexOf(':')+1,s.lastIndexOf('}'))
            console.log('fileId:'+s)
            app.globalData.fileId=s
            console.log(app.globalData.fileId)
            that.getstatus();
          },
          fail(res){
            console.log(res)
            wx.showToast({
              title: '上传失败，请检查网络稍后重试',
              icon:'none'
            })
          },
      })
  },

  //获取转码状态
  getstatus:function(){
    var status='first'
    var time = 0;
    // console.log(inter.API_CHECKSTATUS + app.globalData.fileId)
    // console.log(this.data)      
    setTimeout(function(){
        if(time==300){
          clearTimeout();
        }
        api.post(inter.API_CHECKSTATUS+app.globalData.fileId,this.data,app.globalData.sessionId,(res)=>{
          console.log('转码信息：')
          time++;
          console.log(res)
          if(res.code=='000'){
            wx.showToast({
              title: '文件转码成功！',
            })
            wx.redirectTo({
              url: '/pages/myfile/myfile',
            })
            clearTimeout();
          }
          else if(res.code=='006'){
            if (status == 'first'){
              wx.showLoading({
                title: '文件转码中……',
              })
            }
          }
          else{
            wx.showToast({
              title:'转码错误，请稍后重试',
              icon:'none'
            })
          }
        })
      },1000)
    if(time==300){
      wx.hideLoading();
      wx.showToast({
        title: '转码超时，请稍后重试',
        icon:'none'
      })
    }
  },

  //开始触摸
  touchStart:function(e){
    startx=e.touches[0].pageX
    touch=true
    console.log('startx：'+startx)
  },

  //触摸移动
  touchMove:function(e){
    endx=e.touches[0].pageX
    if(touch && endx - startx > 50){
      console.log('右移，展示左页面')
      wx.redirectTo({
        url: '/pages/myfile/myfile',
      })
      touch=false
    }
  },

  //触摸结束
  touchEnd:function(e){
    console.log('endx:'+endx)
    touch=true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      formData:{
        fileName:'点击添加文件'
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})