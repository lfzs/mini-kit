// 微信授权按钮
import { userStore } from '@store'

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    text: {
      type: String,
      value: '提交',
    },
  },

  methods: {
    handleAuth(e) {
      const { userInfo } = e.detail
      if (!userInfo) return
      this.triggerEvent('submit')
      userStore.updateUserInfo(userInfo)
    },
  },

})
