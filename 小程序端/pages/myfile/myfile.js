// pages/myfile/myfile.js
import * as api from '../../static/api.js'
import * as inter from '../../static/interface.js'
const app = getApp();

//页面左右滑动
var startx,endx
var touch=false//是否触摸

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[{
      fileName:'',
      fileId:'',
      status:'',
      time:'',
      status:''
    }]
  },

  download:function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定下载该文件？',
      success: function (res) {
        if (res.confirm) {
          console.log(e)
          var fileId = e.currentTarget.dataset.id;
          console.log('fileId:'+fileId)
          api.post(inter.API_DOWNLOADFILE + fileId, that.data, app.globalData.sessionId, (res) => {
            wx.hideLoading();
            console.log(res)
            if (res) {
              wx.showToast({
                title: '下载成功',
                icon: 'none'
              })
            }
            else {
              console.log(res)
              wx.showToast({
                title: '下载失败，请检查网络稍后重试',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  //触摸开始
  touchStart:function(e){
    startx=e.touches[0].pageX
    console.log('startx:'+startx)
    touch=true
  },

  //触摸移动
  touchMove:function(e){
    endx=e.touches[0].pageX
    if(touch && startx - endx > 50){
      console.log('左移，展示右页面')
      wx.redirectTo({
        url: '/pages/upfile/upfile',
      })
      touch=false
    }
  },

  //触摸结束
  touchEnd:function(e){
    touch=false
    console.log('endx:'+endx)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var files = [{
    //   "fileName": "test1.mp4",
    //   "fileId": app.globalData.fileId,
    //   "status": "0",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test2.mp3",
    //   "fileId": "1546956625692",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test2.jpg",
    //   "fileId": "1546974867691",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test2.avi",
    //   "fileId": "0233YtPa2R0CBM0H8dTa2HhJPa23YtPB1544350445486",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test2.avi",
    //   "fileId": "0233YtPa2R0CBM0H8dTa2HhJPa23YtPB1544350445486",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // }, {
    //   "fileName": "test2.avi",
    //   "fileId": "0233YtPa2R0CBM0H8dTa2HhJPa23YtPB1544350445486",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test2.avi",
    //   "fileId": "0233YtPa2R0CBM0H8dTa2HhJPa23YtPB1544350445486",
    //   "status": "1",
    //   "time": "2018-12-11 12:01:02"
    // },
    // {
    //   "fileName": "test1.mp4",
    //   "fileId": "0233YtPa2R0CBM0H8dTa2HhJPa23YtPB1544350446361",
    //   "status": "0",
    //   "time": "2018-12-11 12:01:02"
    // }]
    // var tmp = this.data;
    // console.log(tmp)
    // for (var i = 0; i < files.length; i++) {
    //   var name = files[i].fileName;
    //   var pos = name.indexOf('.')
    //   name = name.substring(pos + 1, name.length)
    //   console.log(name)
    //   if (app.globalData.image.indexOf(name) > -1) {
    //     files[i].status = 'img'
    //   }
    //   else if (app.globalData.audio.indexOf(name) > -1) {
    //     files[i].status = 'aud'
    //   }
    //   else if (app.globalData.video.indexOf(name) > -1) {
    //     files[i].status = 'vid'
    //   }
    // }
    // this.setData({
    //   files: files
    // })
    // console.log(this.data)

    api.post(inter.API_GETFLIST, this.data, app.globalData.sessionId, (res) => {
      wx.hideLoading();
      console.log(res)
      if(res.code=='000'){
        var files = res.taskFile
        for (var i = 0; i < files.length; i++) {
          var name = files[i].fileName;
          var pos = name.indexOf('.')
          name = name.substring(pos + 1, name.length)
          console.log(name)
          if (app.globalData.image.indexOf(name) > -1) {
            files[i].status = 'img'
          }
          else if (app.globalData.audio.indexOf(name) > -1) {
            files[i].status = 'aud'
          }
          else if (app.globalData.video.indexOf(name) > -1) {
            files[i].status = 'vid'
          }
        }
        this.setData({
          files: files
        })
        console.log(this.data)
      }
      else{
        console.log(res)
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon:'none'
        })
      }
    })
  
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