import { observable } from 'mobx'

export default new class {
  @observable menuButtonInfo = {} // 用来存储 menuButton 信息，custom-navbar 组件会更新此字段
  @observable systemInfo = {}

  constructor() {
    this.setSystemInfo()
  }

  setSystemInfo() {
    const { platform } = this.systemInfo
    if (!platform) this.systemInfo = wx.getSystemInfoSync()
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
