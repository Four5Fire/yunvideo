//index.js
//获取应用实例
import * as api from '../../static/api.js'
import * as inter from '../../static/interface.js'
const app = getApp()

Page({
  data: {
    motto: '欢迎进入文件转码助手',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clickable:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  start:function(){
    let data = this.data.userInfo
    data.code = this.data.code
    console.log('用户信息：')
    console.log(data)
    api.post(inter.API_LOGIN, data, '', (res)=>{
      wx.hideLoading()
      console.log('登录信息：')
      console.log(res)
      if(res.code == '000'){
        app.globalData.token = res.data
        this.setData({
          hasUserInfo:true
        })
        app.globalData.userInfo = this.data.userInfo
        //获取自定义登录态
        app.globalData.sessionId = res.sessionId
        wx.redirectTo({
          url: '../upfile/upfile',
        })
      }
      else{
        wx.showToast({
          clickable:true,
          title: res.desc,
          icon:'none',
          mask:true
        })
      }
    })
  },
  onLoad: function () {   
    var that = this
    wx.showNavigationBarLoading()
    wx.login({
      success:res=>{
        this.setData({
          show:true
        })
        if(res.code){
          //登陆成功
          var code = res.code
          this.setData({
            code:res.code
          })
          //查看是否授权
          wx.getSetting({
            success:res=>{
              if(res.authSetting['scope.userInfo']){
                //已授权，获取头像昵称
                wx.getUserInfo({
                  success:res=>{
                    let info = res.userInfo
                    this.setData({
                      authed:true,
                      userInfo:info,
                      clickable:false
                    })
                    setTimeout(()=>this.start(),1000)
                  }
                })
              }
              else{
                //授权失败
                that.setData({
                  authed:false,
                  clickable:true
                })
              }
            },
            complete:()=>wx.hideNavigationBarLoading()
          })
        }
        else{
          //登陆失败
          console.log('登陆错误')
          wx.showModal({
            title: '网络错误',
            content: '网络请求失败，请检查网络连接或重新打开小程序',
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    setTimeout(()=>this.start(), 1000);
  }
})
