function fetchApi(type, params, method) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: API_URL + '/' + type,
        data: params,
        header: { 'Content-Type': 'application/json' },
        method: method,
        success: resolve,
        fail: reject
      })
    })
  }
  module.exports = {
    fetchApi,
    API_URL,
    appcode
  }


  

// 解决本地上传远程的冲突两种方式的区别

// git push -f origin master
// or
// git push origin master -f
// 本地强制上传到远程，把远程的覆盖

// git pull --rebase origin master
// 拉取远程的文件把本地的覆盖，再上传

// 一般推荐第一种
