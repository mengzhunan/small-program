Page({
  /** * 页面的初始数据*/
  data: {
    imgs: [],
    fragmentImg: null,
    images: [],
    fragmentIndex: 0,
    ep_id: null,
    comic_id: null
  },

  /** * 生命周期函数--监听页面加载 */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })

    this.setData({
      ep_id: options.ep_id,
      comic_id: options.comic_id,
    })

    let demo = wx.getStorageSync('history') || []
    let item = {
      comicId: options.comic_id,
      epId: options.ep_id
    }
    let arr = [item, ...demo.filter(h => h.comicId != item.comicId)]
    wx.setStorageSync('history', arr)
    wx.showLoading({
      title: '加载中',
    })
    wx: wx.request({
      url: `https://apis.netstart.cn/mbcomic/GetImageIndex?ep_id=${options.ep_id}`,
      success: (result) => {
        this.setData({
          imgs: result.data.data.images,
          fragmentImg: new Array(Math.ceil(result.data.data.images.length / 10)).fill(null).map((o, i) => result.data.data.images.slice(i * 10, (i + 1) * 10))
        })
        wx.request({
          url: 'https://apis.netstart.cn/mbcomic/ImageToken',
          data: {
            urls: JSON.stringify(this.data.fragmentImg[this.data.fragmentIndex].map(o => o.path + '@760w_380h.jpg')),
          },
          success: (result) => {
            var img = this.data.images
            img[this.data.fragmentIndex] = result.data.data
            this.setData({
              images: img,
              fragmentIndex: this.data.fragmentIndex + 1
            })
          },
          complete: () => {
            wx.hideLoading()
          },
        })
      },
    })
    // 获取当前阅读漫画的列表，放到本地存储，为方便阅读下一章
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/ComicDetail?',
      data: {
        comic_id: this.data.comic_id
      },
      success: (res) => {
        // 计算下一章节id
        let ep_list = res.data.data.ep_list.reverse()
        wx.setStorageSync("ep_list", ep_list)
      },
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
  onReachBottom() {
    if (this.data.fragmentIndex <= (this.data.fragmentImg.length - 1)) {
      console.log("加载分页");
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: 'https://apis.netstart.cn/mbcomic/ImageToken',
        data: {
          urls: JSON.stringify(this.data.fragmentImg[this.data.fragmentIndex].map(o => o.path + '@760w_380h.jpg')),
        },
        success: (result) => {
          var img = this.data.images
          img[this.data.fragmentIndex] = result.data.data
          this.setData({
            images: img,
            fragmentIndex: this.data.fragmentIndex + 1
          })
        },
        complete: () => {
          wx.hideLoading()
        },
      })
    } else {
      console.log("分页已全部加载完成，跳转下一章");
      let ep_list = wx.getStorageSync("ep_list");
      var fragmentId = ep_list.findIndex(o => o.id == this.data.ep_id)
      var nextId
      if (fragmentId >= ep_list.length - 1) {
        // 没有下一章
        console.log("这是最后一章");
      } else {
        nextId = fragmentId + 1
        wx.redirectTo({
          url: `/pages/reading/reading?comic_id=${this.data.comic_id}&ep_id=${ep_list[nextId].id}`,
        })
      }
    }
  },

  /** * 用户点击右上角分享 */
  onShareAppMessage() {}
})