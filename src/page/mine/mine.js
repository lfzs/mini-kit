import { userStore } from '@store'

Page({
  store: {
    userStore,
  },

  onLoadAfter: false,

  async onLoad() {
    await userStore.fetchData()
    this.onLoadAfter = true
  },

  onShow() {
    this.onLoadAfter && userStore.fetchData()
  },

})
