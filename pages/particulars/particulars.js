Page({
  data: {
    particularsContent: null, // 漫画数据
    storageList: null, // 已追漫id
    // storageList: wx.getStorageSync('storageList') || [], // 已追漫id
    downState: true, // 控制内容显示两行
    sortState: true, // 升序降序状态
    slice: true, // 隐藏目录状态
    last_ep_id: null, //最后阅读章节ID
    comment: null
  },
  //  追漫
  storageAdd(event) {
    this.setData({
      storageList: [...this.data.storageList, event.target.dataset.id]
    })
    wx.setStorageSync('storageList', this.data.storageList)
  },
  // 取消追漫
  storageRemove(event) {
    this.setData({
      storageList: this.data.storageList.filter(o => o !== event.target.dataset.id)
    })
    wx.setStorageSync('storageList', this.data.storageList)
  },
  // 显示全部漫画简介
  down() {
    this.setData({
      downState: false
    })
  },
  // 升、降序切换
  sort() {
    this.setData({
      sortState: !this.data.sortState
    })
  },
  // 显示全部章节
  unfold() {
    this.setData({
      slice: false
    })
  },
  // 跳转到阅读页面
  navToReading(event) {
    // chapterid： 漫画ID   eqid：章节ID
    wx: wx.navigateTo({
      url: `/pages/reading/reading?comic_id=${event.target.dataset.chapterid}&ep_id=${event.target.dataset.eqid}&title=${this.data.particularsContent.title}`,
    })
  },

  navToDetails(event) {
    wx.navigateTo({
      url: `/pages/particulars/particulars?id=${event.currentTarget.dataset.id}&title=${event.currentTarget.dataset.title}`,
    })
  },

  /** * 生命周期函数--监听页面加载 */
  onLoad(options) {
    // 动态页面标题
    wx.setNavigationBarTitle({
        title: options.title,
      }),
      this.setData({
        storageList: wx.getStorageSync('storageList') || [], // 已追漫id
        comic_id: options.id, // 漫画id
        last_ep_id: wx.getStorageSync('history') ? wx.getStorageSync('history').find(o => o.comicId == options.id)?.epId : "" //章节ID
      }),
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
      url: `https://apis.netstart.cn/mbcomic/ComicDetail?`,
      data: {
        comic_id: options.id
      },
      success: (result) => {
        this.setData({
          particularsContent: result.data.data,
          last_ep: result.data.data.ep_list.find(o => o.id == this.data.last_ep_id)
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
    // 评论
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/reply?',
      data: {
        oid: options.id
      },
      success: ({
        data
      }) => {
        this.setData({
          comment: data.data.replies.slice(0, 6)
        })
      }
    })
    // 相关漫画
    wx.request({
      url: 'https://apis.netstart.cn/mbcomic/Recommend?',
      data: {
        comic_id: options.id
      },
      success: (({
        data
      }) => {
        this.setData({
          likeContent: data.data
        })
      })
    })
  },

  /** * 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** * 生命周期函数--监听页面显示 */
  onShow() {
    if (this.data.particularsContent) {
      // 章节ID
      this.setData({
        last_ep_id: wx.getStorageSync('history').find(o => o.comicId == this.data.comic_id)?.epId
      })
      // 章节内容
      this.setData({
        last_ep: this.data.particularsContent.ep_list.find(o => o.id == this.data.last_ep_id)
      })
    }
  },
})