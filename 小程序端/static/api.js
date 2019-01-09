export const baseUrl = 'https://www.playcall.cn/yunVideo'

export function get(url, data, callback, token=''){
  wx.request({
    url: baseUrl+url,
    data:data,
    method:'GET',
    header:{
      'content-type':'application/json',
      'Authorization':'Bearer '+token
    },
    sucess:(res)=>{
      callback(res.data)
    }
  })
}

export function post(url, data, sessionId, callback, token=''){
  wx.request({
    url: baseUrl+url,
    data:data,
    method:'POST',
    header:{
      'content-type':'application/json',
      'Authorization':'Bearer '+token,
      'sessionId':sessionId
    },
    success:(res)=>{
      callback(res.data)
    }
  })
}

export function postfile(url, data, sessionId, callback, token=''){
  wx.request({
    url: baseUrl+url,
    data:data,
    method:'POST',
    header:{
      'content-type':'multipart/form-data',
      'Authorization':'Bearer '+token,
      'sessionId':sessionId
    },
    success:(res)=>{
      callback(res.data)
    }
  })
}

export function put (url, data, callback, token='' ){
  wx.request({
    url: baseUrl+url,
    data:data,
    method:'PUT',
    header:{
      'content-type':'application/json',
      'Authorization': 'Bearer '+token
      },
    success:(res)=>{
      callback(res.data)
    }
  })
}