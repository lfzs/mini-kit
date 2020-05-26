import { g } from '@util'
export default function(target, name, descriptor) {
  const func = descriptor.value

  descriptor.value = function(...args) {
    g.vibrateShort()
    Promise.resolve(func.apply(this, args))
      .then(() => g.stopPullDownRefresh())
      .catch(() => {
        g.stopPullDownRefresh()
        g.showToast({ title: '请求失败', icon: 'none' })
      })
  }
}
