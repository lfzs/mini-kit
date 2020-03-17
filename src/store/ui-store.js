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
    try {
      this.systemInfo = wx.getSystemInfoSync()
    } catch (error) {
      this.systemInfo = wx.getSystemInfoSync()
    } finally {
      this.systemInfo.platform || (this.systemInfo = wx.getSystemInfoSync())
    }
  }

  setMenuButtonInfo() {
    const { height } = this.menuButtonInfo
    if (!height) {
      try {
        this.menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      } catch (error) {
        this.menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      } finally {
        this.menuButtonInfo.height || (this.menuButtonInfo = wx.getMenuButtonBoundingClientRect())
      }
    }
  }

  isIOS() {
    const { platform } = this.systemInfo
    if (platform) {
      return platform.toUpperCase() === 'IOS' || platform.toUpperCase() === 'DEVTOOLS'
    } else {
      this.setSystemInfo()
      return this.systemInfo.platform.toUpperCase() === 'IOS' || platform.toUpperCase() === 'DEVTOOLS'
    }
  }
}
