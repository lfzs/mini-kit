// 拦截页面的 onLoad
import { tokenStore } from '@store'
import { goHome, autoLoading } from '@util'

Component({
  properties: {},

  data: {
    loading: true,
    status: -1,
    errorInfo: '',
  },

  lifetimes: {
    ready() {
      wx.login()
      return this.init()
    },
  },

  pageLifetimes: {
    show() {
      this.data.status === 401 && tokenStore.getToken() && this.init() // 其他页面授过权,更新当前页面
    },
  },

  methods: {

    async init() {
      const currentPage = getCurrentPages().pop()
      try {
        this.setData({ loading: true })
        await currentPage._init()
        this.setData({ status: -1 })
      } catch (e) {
        console.log(e) //eslint-disable-line no-console
        this.setData({ status: e.status || -1 })
      } finally {
        this.setData({ loading: false })
      }
    },

    preventTouchmove() { /** 阻止滚动穿透 */ },

    async handleAuth(e) {
      const { errMsg } = e.detail
      if (errMsg.indexOf('deny') > -1) return
      await autoLoading(tokenStore.login(e.detail))
      return this.init()
    },

    goHome() {
      goHome()
    },
  },
})
