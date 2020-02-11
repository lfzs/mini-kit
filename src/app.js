import './util/page'

App({

  onShow() {
    this.checkUpdateManager()
  },

  // 新版本提示
  checkUpdateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '提示',
        content: '新版本已经准备好，是否重启更新应用？',
        success: () => updateManager.applyUpdate(),
      })
    })
  },

})
