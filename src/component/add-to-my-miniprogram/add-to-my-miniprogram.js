// 添加到我的小程序
import { uiStore } from '@store'
import { ADD_TO_MY_MINIPROGRAM } from '@util'

Component({

  properties: {
    custom: Boolean, // 当前页面是否是自定义导航
  },

  lifetimes: {
    ready() {
      uiStore.setNavbarInfo()
      const { windowWidth } = uiStore.systemInfo
      const { right, width } = uiStore.menuButtonInfo
      this.setData({
        rightGap: windowWidth - right,
        upRight: Math.floor(3 / 4 * width),
        totalHeight: this.data.custom ? uiStore.navbarInfo.totalHeight : 0,
      })
      this.toggle()
    },

  },

  data: {
    show: false,
    rightGap: 0,
    upRight: 0,
    totalHeight: 0,
  },

  methods: {
    show() {
      setTimeout(() => this.setData({ show: true }), 5000)
      setTimeout(() => this.setData({ show: false }), 10000)
      wx.setStorage({ key: ADD_TO_MY_MINIPROGRAM, data: Date.now() })
    },

    toggle() {
      const timestamp = wx.getStorageSync(ADD_TO_MY_MINIPROGRAM)
      if (!timestamp) this.show()
    },
  },

})
