import { uiStore } from '@store'
import { goBack, isTabPage, canBack } from '@util'

Component({

  properties: {
    statusBar: { type: Boolean, value: true },
    statusBarBackground: { type: String, value: '#000' },
    nav: { type: Boolean, value: true },
    navBackground: { type: String, value: '#000' },
    title: String,
  },

  lifetimes: {
    attached() { this.init() },
  },

  data: {
    windowWidth: 375,
    canBack: true,
    isTabPage: true,
  },

  methods: {
    goBack() { goBack() },
    preventTouchmove() {},

    init() {
      uiStore.setMenuButtonInfo()
      const { systemInfo: { statusBarHeight, windowWidth }, menuButtonInfo } = uiStore

      const topGap = menuButtonInfo.top - statusBarHeight // 胶囊顶部和状态栏的间隙
      const rightGap = windowWidth - menuButtonInfo.right // 胶囊右边的间隙
      const navHeight = topGap * 2 + menuButtonInfo.height // 导航条的高度
      uiStore.setCustonNavbarHeight(statusBarHeight + navHeight)

      this.setData({
        menuButtonInfo,
        statusBarHeight,
        topGap,
        rightGap,
        navHeight,
        windowWidth,
        canBack: canBack(),
        isTabPage: isTabPage(),
      })
    },

  },
})
