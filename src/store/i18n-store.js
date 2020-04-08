import { observable, action } from 'mobx'
import { LANGUAGE } from '@util'

export default new class {
  @observable language = ''

  @action
  init() {
    this.language = wx.getStorageSync(LANGUAGE) || 'zh'
  }

  @action
  setLanguage(language) {
    if (language === this.language) return
    this.language = language
    wx.setStorage({ key: LANGUAGE, data: language })
  }
}
