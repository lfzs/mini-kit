import { autorun, toJS } from 'mobx'
import { homePage, nav } from '@util'

const oldPage = Page

Page = (config = {}) => {
  const { onLoad, onReady, onHide, onShow, onUnload, onShareAppMessage, store } = config

  const transformLifeTime = {

    onLoad() {
      this._disposers = []
      this.store = (typeof store === 'function') ? store.call(this, this.options) : (store || {})
      Object.entries(this.store).forEach(([key, value]) => {
        const disposer = autorun(() => this.setData({ [key]: getProperties(value) }), { name: key })
        this._disposers.push(disposer)
      })

      // 挂载到页面 以便 loading-screen 调用
      this._init = () => onLoad && onLoad.call(this, this.options)
    },

    onReady() {
      onReady && onReady.call(this)
    },

    onShow() {
      onShow && onShow.call(this)
    },

    onUnload() {
      this._disposers.forEach(disposer => disposer())
      onUnload && onUnload.call(this)
    },

    onHide() {
      onHide && onHide.call(this)
    },

    onShareAppMessage() {
      const title = ''
      const imageUrl = ''

      if (onShareAppMessage) {
        return onShareAppMessage.call(this)
      } else {
        return { title, path: homePage, imageUrl }
      }
    },
  }

  const util = {
    preventTouchmove() { /** 阻止滚动穿透 */ },

    previewImage(e) {
      const { url, urls } = e.target.dataset
      wx.previewImage({ current: url, urls: urls ? urls : [url] })
    },

    nav(e) {
      const { url } = e.currentTarget.dataset
      nav(url)
    },
  }

  delete config.store
  return oldPage(Object.assign({}, util, config, transformLifeTime))
}

function getProperties(store) {
  const newStore = { ...toJS(store) }

  // 只提取 get 属性
  const descriptors = Object.getOwnPropertyDescriptors(store)
  Object.entries(descriptors).forEach(([name, descriptor]) => {
    if (descriptor.get && !descriptor.enumerable) newStore[name] = store[name]
  })

  return newStore
}
