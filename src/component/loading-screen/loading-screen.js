// 拦截页面的 onLoad
import { tokenStore } from '@store'
import { goHome, autoLoading, wxp } from '@util'

Component({
  properties: {},

  data: {
    loading: true,
    status: -1,
    errorInfo: '',
  },

  lifetimes: {
    ready() {
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
        console.log(e) // eslint-disable-line no-console
        this.setData({ status: e.status || -1 })
      } finally {
        this.setData({ loading: false })
      }
    },

    async handleAuth(e) {
      if (!e.detail.userInfo) return

      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await autoLoading(tokenStore.login(code, userInfo))
      return this.init()
    },

    goHome() {
      goHome()
    },
  },
})
