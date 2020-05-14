// 自定义导航
import { uiStore } from '@store'
import { goBack, isTabPage, APP_NAME } from '@util'

Component({

  properties: {
    statusBar: { type: Boolean, value: true },
    statusBarBackground: { type: String, value: '#000' },
    nav: { type: Boolean, value: true },
    navBackground: { type: String, value: '#000' },
    title: { type: String, value: APP_NAME },
  },

  observers: {
    'title': function(title) { wx.setNavigationBarTitle({ title }) },
  },

  lifetimes: {
    attached() { this.init() },
  },

  data: {
    isTabPage: true,
  },

  methods: {
    goBack() { this.data.isTabPage || goBack() },
    noop() {},

    init() {
      uiStore.setNavbarInfo()
      this.setData({
        navbarInfo: uiStore.navbarInfo,
        isTabPage: isTabPage(),
      })
    },

  },
})
