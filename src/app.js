import './util/page'
import './util/component'
import {
  // @if PLATFORM='weixin'
  MEMORY_WARNING_LEVEL,
  // @endif
  g,
} from '@util'

App({

  onLaunch() {
    this.reporter()
  },

  onShow() {
    this.checkUpdateManager()
  },

  reporter() {
    // @if PLATFORM='weixin'
    const LOGGER = g.getRealtimeLogManager() // 实时日志管理器实例
    g.onPageNotFound(({ path, query, isEntryPage }) => LOGGER.warn(`onPageNotFound: path${path},query${query},isEntryPage${isEntryPage}`))
    g.onMemoryWarning(({ level }) => LOGGER.warn(`onMemoryWarning: level${MEMORY_WARNING_LEVEL[level]}`))
    g.onError(error => LOGGER.error(`onError: ${error}`))
    // @endif
  },

  // 新版本提示
  checkUpdateManager() {
    const updateManager = g.getUpdateManager()
    updateManager.onUpdateReady(() => updateManager.applyUpdate())
  },

})
