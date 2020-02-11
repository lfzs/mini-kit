import { homeStore } from '@store'

Page({
  store: {
    homeStore,
  },

  onLoad() {
    return homeStore.fetchData()
  },
})
