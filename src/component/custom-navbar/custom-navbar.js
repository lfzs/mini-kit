// 自定义导航
import { uiStore } from '@store'
import { goBack, isTabPage } from '@util'

Component({

  properties: {
    statusBar: { type: Boolean, value: true },
    statusBarBackground: { type: String, value: '#000' },
    nav: { type: Boolean, value: true },
    navBackground: { type: String, value: '#000' },
    title: String,
  },

  observers: {
    'title': function(title) { wx.setNavigationBarTitle({ title }) },
  },

  lifetimes: {
    attached() { this.init() },
  },

  data: {
    windowWidth: 375,
    isTabPage: true,
  },

  methods: {
    goBack() { this.data.isTabPage || goBack() },
    noop() {},

    init() {
      uiStore.setMenuButtonInfo()
      const isIOS = uiStore.isIOS()
      let { systemInfo: { statusBarHeight, windowWidth }, menuButtonInfo } = uiStore
      statusBarHeight = statusBarHeight - (isIOS ? 4 : 1) // 误差校正

      const topGap = menuButtonInfo.top - statusBarHeight // 胶囊顶部和状态栏的间隙
      const rightGap = windowWidth - menuButtonInfo.right // 胶囊右边的间隙
      const navHeight = topGap * 2 + menuButtonInfo.height // 导航条的高度

      uiStore.setCustomNavbarHeight(statusBarHeight + navHeight)

      this.setData({
        menuButtonInfo,
        statusBarHeight,
        topGap,
        rightGap,
        navHeight,
        windowWidth,
        isTabPage: isTabPage(),
      })
    },

  },
})
