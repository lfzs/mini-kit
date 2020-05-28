import { g } from '@util'

export const tabPages = [
  '/page/home/home',
  '/page/mine/mine',
]

export const homePage = tabPages[0]

export function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

export function isTabPage(url = getCurrentPageRoute()) {
  return tabPages.some(tab => tab.includes(url))
}

export function getCurrentPageRoute() {
  const currentPage = getCurrentPage()

  const route =
  // @if PLATFORM='weixin'
  currentPage.route
  // @endif
  // @if PLATFORM='alipay'
  JSON.stringify(currentPage.__proto__.route)
  // @endif

  return `/${route}`
}

export function getPrevPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

export function goHome() {
  g.switchTab({ url: homePage })
}

export function canBack() {
  return getCurrentPages().length > 1
}

export function goBack() {
  canBack() ? g.navigateBack() : goHome()
}

export function redirect(url) {
  g.redirectTo({ url })
}

export function nav(url) {
  if (!url) return goHome()
  if (isTabPage(url)) return g.switchTab({ url })

  const pages = getCurrentPages()
  const type = pages.length < 10 ? 'navigateTo' : 'redirectTo'
  g[type]({ url })
}
