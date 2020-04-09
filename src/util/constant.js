export const TOKEN_KEY = `token_${process.env.NODE_ENV}`
export const LANGUAGE = `language_${process.env.NODE_ENV}`

export const MEMORY_WARNING_LEVEL = {
  5: 'TRIM_MEMORY_RUNNING_MODERATE',
  10: 'TRIM_MEMORY_RUNNING_LOW',
  15: 'TRIM_MEMORY_RUNNING_CRITICAL',
}

export const LOCAL = { // 参照 i18n.wxs, 提供给 js 文件使用
  zh: {
    '首页': '首页',
    '我的': '我的',
  },

  en: {
    '首页': 'Home',
    '我的': 'Mine',
  },
}
