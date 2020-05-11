// 添加到我的小程序
import { autorun } from 'mobx'
import { uiStore } from '@store'
import { ADD_TO_MY_MINIPROGRAM } from '@util'

Component({

  lifetimes: {
    ready() {
      uiStore.setSystemInfo()
      uiStore.setMenuButtonInfo()
      const { systemInfo: { windowWidth }, menuButtonInfo: { right, width } } = uiStore
      this.setData({
        rightGap: windowWidth - right,
        upRight: Math.ceil(3 / 4 * width),
      })
      this.disposer = autorun(() => this.setData({ customNavbarHeight: uiStore.customNavbarHeight }))
      this.toggle()
    },

    detached() { this.disposer() },
  },

  data: {
    show: false,
    rightGap: 0,
    upRight: 0,
    customNavbarHeight: 0,
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
