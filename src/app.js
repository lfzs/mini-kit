import './util/page'
import { MEMORY_WARNING_LEVEL, g } from '@util'

App({

  onLaunch() {
    this.reporter()
  },

  onShow() {
    this.checkUpdateManager()
  },

  reporter() {
    const LOGGER = g.getRealtimeLogManager() // 实时日志管理器实例
    g.onPageNotFound(({ path, query, isEntryPage }) => LOGGER.warn(`onPageNotFound: path${path},query${query},isEntryPage${isEntryPage}`))
    g.onMemoryWarning(({ level }) => LOGGER.warn(`onMemoryWarning: level${MEMORY_WARNING_LEVEL[level]}`))
    g.onError(error => LOGGER.error(`onError: ${error}`))
  },

  // 新版本提示
  checkUpdateManager() {
    const updateManager = g.getUpdateManager()
    updateManager.onUpdateReady(() => updateManager.applyUpdate())
  },

})
