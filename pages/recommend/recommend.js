Page({
  data: {
    // 轮播图
    banner: null,
    // 漫画列表
    cartoonList: null,
    // 页码
    page_num: 2,
  },

  // 跳转到漫画详情
  navToParticulars(event) {
    wx.navigateTo({
      url: `/pages/particulars/particulars?id=${event.currentTarget.dataset.id}&title=${event.currentTarget.dataset.title}`,
    })
  },

  /** * 生命周期函数--监听页面加载 */
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    // 请求轮播图数据
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/Banner',
      success: (res) => {
        this.setData({
          banner: res.data.data
        })
      },
    })

    // 漫画列表数据
    let load = () => {
      wx.request({
        url: 'https://apis.netstart.cn/mbcomic/HomeRecommend',
        success: (res) => {
          this.setData({
            cartoonList: res.data.data.list
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
    load();
  },

  /** * 页面上拉触底事件的处理函数 */
  onReachBottom() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/HomeRecommend',
      data: {
        seed: 1,
        drag: 1,
        page_num: this.data.page_num
      },
      success: (res) => {
        this.setData({
          cartoonList: [...this.data.cartoonList, ...res.data.data.list],
          page_num: this.data.page_num + 1,
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  /** 用户点击右上角分享*/
  onShareAppMessage() {}
})