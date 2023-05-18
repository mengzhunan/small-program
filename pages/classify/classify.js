Page({
  /** * 页面的初始数据*/
  data: {
    allLabel: null,
    selectedLabel: {
      style_id: -1,
      area_id: -1,
      is_finish: -1,
      is_free: -1,
      order: 0,
      page_num: 1,
      page_size: 15
    },
    selectedComics: []
  },

  changeSelectedLabel(event) {
    let selectedLabel = {
      ...this.data.selectedLabel
    }
    selectedLabel[event.currentTarget.dataset.key] = event.currentTarget.dataset.value

    this.setData({
      selectedLabel: selectedLabel
    })

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/ClassPage',
      data: this.data.selectedLabel,
      success: (res) => {
        this.setData({
          selectedComics: res.data.data
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  navToDetail(event) {
    wx.navigateTo({
      url: `/pages/particulars/particulars?id=${event.currentTarget.dataset.id}&title=${event.currentTarget.dataset.title}`,
    })
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/AllLabel',
      success: (res) => {
        this.setData({
          allLabel: res.data.data
        })
        wx.request({
          url: 'https://apis.netstart.cn/mbcomic/ClassPage',
          success: (res) => {
            this.setData({
              selectedComics: res.data.data
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
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