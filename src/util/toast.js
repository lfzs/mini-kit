export function toast(title, duration = 1500, icon = 'none') {
  wx.hideLoading()
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      duration,
      icon,
      mask: true,
      fail: reject,
    })
    setTimeout(resolve, duration)
  })
}

export function successToast(title, duration = 1500) {
  return toast(title, duration, 'success')
}
