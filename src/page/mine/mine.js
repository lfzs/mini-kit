import { userStore } from '@store'

Page({
  store: {
    userStore,
  },

  onLoad() {
    return userStore.fetchData()
  },

})
