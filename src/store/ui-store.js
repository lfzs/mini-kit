import { observable, action } from 'mobx'

export default new class {
  @observable custonNavbarHeight = 0 // 自定义导航条的高度(状态栏 + 标题栏)，单位 px
  menuButtonInfo = {} // 右上角胶囊信息
  systemInfo = {}

  constructor() {
    this.setSystemInfo()
    this.setMenuButtonInfo()
  }

  @action
  setCustonNavbarHeight(height) {
    this.custonNavbarHeight = height
  }

  setSystemInfo() {
    const { platform } = this.systemInfo
    platform || (this.systemInfo = wx.getSystemInfoSync())
  }

  setMenuButtonInfo() {
    const { height } = this.menuButtonInfo
    if (!height) {
      let menuButtonInfo = {}
      try {
        menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      } catch (error) {
        menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      } finally {
        menuButtonInfo.height || (menuButtonInfo = wx.getMenuButtonBoundingClientRect())
      }
      this.menuButtonInfo = menuButtonInfo
    }
  }

  isIOS() {
    const { platform } = this.systemInfo
    if (platform) {
      return platform.toUpperCase() === 'IOS'
    } else {
      this.systemInfo = wx.getSystemInfoSync()
      return this.systemInfo.platform.toUpperCase() === 'IOS'
    }
  }
}
