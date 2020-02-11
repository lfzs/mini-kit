import { uiStore } from '@store'
import { goBack, isTabPage, canBack } from '@util'

Component({

  properties: {
    statusBar: {
      type: Boolean,
      value: true,
    },

    statusBarBackground: {
      type: String,
      value: 'rgba(0, 0, 0, 0.2)',
    },

    nav: {
      type: Boolean,
      value: true,
    },

    navBackground: {
      type: String,
      value: '#000',
    },

    title: {
      type: String,
      value: '',
      observer(newVal) {
        if (newVal) wx.setNavigationBarTitle({ title: newVal })
      },
    },
  },

  lifetimes: {
    attached() {
      uiStore.setSystemInfo()
      this.getMenuButtonInfo()
      this.setData({
        statusBarHeight: uiStore.systemInfo.statusBarHeight,
        windowWidth: uiStore.systemInfo.windowWidth,
        canBack: canBack(),
        isTabPage: isTabPage(),
      })
    },
  },

  data: {
    menuButtonInfo: {},
    statusBarHeight: {},
    windowWidth: 375,
    canBack: true,
    isTabPage: true,
  },

  methods: {
    goBack() { goBack() },
    preventTouchmove() {},

    getMenuButtonInfo() {
      if (uiStore.menuButtonInfo.height) {
        const menuButtonInfo = this.setMenuButtonInfo(uiStore.menuButtonInfo)
        return this.setData({ menuButtonInfo })
      }

      try {
        const _menuButtonInfo = wx.getMenuButtonBoundingClientRect()
        const menuButtonInfo = this.setMenuButtonInfo(_menuButtonInfo)

        this.setData({ menuButtonInfo })
        uiStore.menuButtonInfo = menuButtonInfo
      } catch (error) {
        const menuButtonInfo = this.setMenuButtonInfo()
        this.setData({ menuButtonInfo })
      }
    },

    setMenuButtonInfo(menuButtonInfo = {}) {
      const { statusBarHeight, screenWidth } = uiStore.systemInfo
      const { width = 96, height = 32, top, right } = menuButtonInfo

      const topGap = top ? top - statusBarHeight : (uiStore.isIOS() ? 4 : 8)
      const rightGap = right ? screenWidth - right : 7

      const totalHeight = topGap * 2 + height // 导航条的高度(不包括状态栏高度)

      return { topGap, width, height, totalHeight, rightGap }
    },
  },
})

/*
  wx.getMenuButtonBoundingClientRect 接口出错时的默认值
  胶囊的 width 为 96px
  胶囊的 height 为 32px
  胶囊顶部距离状态栏的间隙 ios 是 4px android 是 8px
  胶囊距离右边的间隙 7px

  使用 px 做单位，不要使用相对单位 rpx
*/
