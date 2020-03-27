import './util/page'
import { MEMORY_WARNING_LEVEL } from '@util'

App({

  onLaunch() {
    this.onMemoryWarning()
  },

  onShow() {
    this.checkUpdateManager()
  },

  onMemoryWarning() {
    wx.onMemoryWarning(({ level }) => {
      const logger = wx.getRealtimeLogManager()
      logger.warn(`【memoryWarning】${level}: ${MEMORY_WARNING_LEVEL[level]}`)
    })
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
