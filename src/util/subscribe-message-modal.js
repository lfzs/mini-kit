import { fly, g } from '@util'

export default async function({ content = '', tmplIds = [], targetType = '', targetId = '' }) {
  tmplIds = tmplIds.filter(Boolean)
  if (!tmplIds.length) return g.p.showToast({ title: content, icon: 'none' })
  g.hideLoading()

  const sendSubscribeMessage = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    if (acceptIds.length) fly.post('subscribe_records/batch', { targetable_type: targetType, targetable_id: targetId, template_ids: acceptIds })
  }

  const { subscriptionsSetting: { mainSwitch, itemSettings = {} } } = await g.p.getSetting({ withSubscriptions: true })
  if (!mainSwitch) return g.p.showToast({ title: content, icon: 'none' })

  const onceIds = tmplIds.filter(id => !itemSettings[id]) // 订阅一次的 id
  if (!onceIds.length) {
    g.requestSubscribeMessage({ tmplIds, success: res => sendSubscribeMessage(res) })
    return g.p.showToast({ title: content, icon: 'none' })
  }

  return new Promise(resolve => {
    g.showModal({
      content,
      confirmText: '确定',
      showCancel: false,
      fail: resolve,
      success: ({ confirm }) => {
        if (!confirm) return resolve()
        g.requestSubscribeMessage({
          tmplIds,
          success: res => sendSubscribeMessage(res),
          complete: resolve,
        })
      },
    })
  })
}
