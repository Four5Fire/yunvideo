// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    page:{
      type:String,
      observer: function(nowpage,lastpage,changepath){
        if(nowpage=='my'){
          this.setData({
            mycolor:'#2ec979',
            upcolor:'#2eb879',
            mysize:'22px',
            upsize:'20px'
          })
        }
        else{
          this.setData({
            upcolor:'#2ec979',
            mycolor:'#2eb879',
            upsize:'22px',
            mysize:'20px'
          })
        }
      }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mycolor:'',
    upcolor:'',
    mysize:'',
    upsize:''
  },

  /**
   * 组件的方法列表
   */
  methods:{
  tomy:function(){
      wx.redirectTo({
        url: '/pages/myfile/myfile',
      })
  },
  toup:function(){
      wx.redirectTo({
        url: '/pages/upfile/upfile',
      })
    },
  },
})
