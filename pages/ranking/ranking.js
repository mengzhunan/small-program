Page({
  /** * 页面的初始数据*/
  data: {
    active: 0,
    navTitle: ['日漫榜', '国漫榜', '免费榜'],
    cartoonArr: null,
    cartoon: null,
    cartoonList: null,
  },

  initDB() {
    // 获取数据库引用
    const db = wx.cloud.database()
    // 通过数据库引用上的 collection 方法获取一个集合的引用
    const cartoon = db.collection('ComicDatabase')
    // 获取集合的引用并不会发起网络请求去拉取它的数据
    this.setData({
      cartoon
    })
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad() {
    this.initDB()
    wx.showLoading({
      title: '正在加载...',
    })

    wx.cloud.callFunction({
      name: 'acquire'
    }).then((res) => {
      let {
        result
      } = res
      this.setData({
        cartoonArr: result.data.data,
        cartoonList: result.data.data[0].list
      })
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },

  onChange(event) {
    let data = [];
    this.setData({
      active: event.target.dataset.type
    })
    this.data.cartoonArr.forEach((item) => {
      if (event.target.dataset.type == item.type) {
        data = item.list
      }
    })
    this.setData({
      cartoonList: data
    })
  },

  navTodetail(event) {
    wx.navigateTo({
      url: `/pages/particulars/particulars?id=${event.currentTarget.dataset.id}&title=${event.currentTarget.dataset.title}`,
    })

  },

  /** * 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** * 生命周期函数--监听页面显示 */
  onShow() {},

  /** * 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** * 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** * 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {},

  /** * 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** * 用户点击右上角分享 */
  onShareAppMessage() {}
})