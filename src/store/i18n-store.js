import { observable, action } from 'mobx'
import { LANGUAGE, LOCAL } from '@util'

export default new class {
  @observable language = ''
  default = 'zh' // 编码默认配置的语言

  needUpdateNavigationBar = false // 是否需要更新标题
  needUpdateTabBar = false // 是否需要更新 tabbar

  @action
  init() {
    const prev = wx.getStorageSync(LANGUAGE)
    this.language = prev || this.default
    prev && (prev !== this.default) && this.needUpdate()
  }

  @action
  setLanguage(language) {
    if (language === this.language) return
    this.language = language
    wx.setStorage({ key: LANGUAGE, data: language })
    this.needUpdate()
  }

  needUpdate() {
    this.needUpdateNavigationBar = true
    this.needUpdateTabBar = true
  }

  setTabbar() { // 在 tabbar 页面调用才有效果
    const tabbar = [
      { index: 0, text: LOCAL[this.language]['首页'] },
      { index: 1, text: LOCAL[this.language]['我的'] },
    ]
    tabbar.forEach(item => wx.setTabBarItem(item))
    this.needUpdateTabBar = false
  }

  t(value) {
    return LOCAL[this.language][value]
  }
}

// page.util 在 onShow 执行即可
// _updateTitle() {
//   if (i18nStore.needUpdateTabBar && isTabPage()) i18nStore.setTabbar()
//   if (i18nStore.needUpdateNavigationBar) wx.setNavigationBarTitle({ title: i18nStore.t(getCurrentPageRoute()) })
// }
