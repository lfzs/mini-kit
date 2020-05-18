import { mineStore } from '@store'

Page({
  store: {
    mineStore,
  },

  onShow() {
    mineStore.fetchData()
  },

})
