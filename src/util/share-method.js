// Page 和 Component 构造器会 merge 此对象
import { nav, g } from '@util'
import _ from 'lodash'

export default {
  noop: _.noop(),

  previewImage(e) {
    const { url, urls } = e.target.dataset
    g.previewImage({ current: url, urls: urls ? urls : [url] })
  },

  nav(e) {
    const { url } = e.currentTarget.dataset
    nav(url)
  },
}
