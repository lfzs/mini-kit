import { fly } from '@util'

export default function({ title = '', content = '', cancelText = '', confirmText = '确定', tmplIds = [], targetType = '', targetId = '' }) {
  tmplIds = tmplIds.filter(Boolean)
  if (!tmplIds.length) return
  wx.hideLoading()

  const sendSubscribeMessage = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    if (acceptIds.length) {
      fly.post('subscribe_records/batch', { targetable_type: targetType, targetable_id: targetId, template_ids: acceptIds })
    } else {
      wx.showToast({ title: '订阅失败，可在右上角设置中打开订阅', duration: 3000, icon: 'none' })
    }
  }

  return new Promise(resolve => {
    wx.showModal({
      title,
      content,
      showCancel: !!cancelText.length,
      cancelText,
      confirmText,
      fail: resolve,
      success: ({ confirm }) => {
        if (!confirm) return resolve()
        wx.requestSubscribeMessage({
          tmplIds,
          success: res => sendSubscribeMessage(res),
          complete: resolve,
        })
      },
    })
  })
}
