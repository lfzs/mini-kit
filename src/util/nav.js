export const homePage = '/page/home/home'

export const tabPages = [
  'page/home/home',
  'page/mine/mine',
]

export function getCurrentPage() {
  return getCurrentPages().pop()
}

export function isTabPage(url = getCurrentPageRoute()) {
  return tabPages.some(item => url.indexOf(item) > -1)
}

export function getCurrentPageRoute() {
  const page = getCurrentPages().pop()
  return page.route
}

export function getPrevPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

export function goHome() {
  wx.switchTab({ url: homePage })
}

export function canBack() {
  return getCurrentPages().length > 1
}

export function goBack() {
  canBack() ? wx.navigateBack() : goHome()
}

export function redirectTo(url) {
  wx.redirectTo({ url })
}

export function nav(url) {
  if (!url) return goHome()
  const type = isTabPage(url) ? 'switchTab' : 'navigateTo'
  wx[type]({ url })
}
