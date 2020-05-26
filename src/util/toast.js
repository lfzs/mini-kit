import { g } from '@util'

export default function toast(title, icon = 'none', duration = 1500, mask = true) {
  g.hideLoading()
  return new Promise((resolve, reject) => {
    g.showToast({ title, icon, duration, mask, fail: reject })
    setTimeout(resolve, duration)
  })
}
