// 添加到我的小程序
import { uiStore } from '@store'
import { ADD_TO_MY_MINIPROGRAM } from '@util'

Component({

  lifetimes: {
    ready() {
      uiStore.setNavbarInfo()
      const { windowWidth } = uiStore.systemInfo
      const { right, width } = uiStore.menuButtonInfo
      const { totalHeight } = uiStore.navbarInfo
      this.setData({
        rightGap: windowWidth - right,
        upRight: Math.floor(3 / 4 * width),
        totalHeight,
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
      setTimeout(() => this.setData({ show: true }), 3000)
      setTimeout(() => this.setData({ show: false }), 8000)
      wx.setStorage({ key: ADD_TO_MY_MINIPROGRAM, data: Date.now() })
    },

    toggle() {
      const timestamp = wx.getStorageSync(ADD_TO_MY_MINIPROGRAM)
      if (timestamp) {
        // const days = (Date.now() - timestamp) / 1000 / 60 / 60 / 24
        // if (days >= 7) this.show() // 超过 7 天就提示
      } else {
        this.show()
      }
    },
  },

})
