// 图片弹窗

import { apiIsAuth, nav, g } from '@util'

Component({
  properties: {
    show: Boolean,
    img: String,
    url: String,
    saveBtn: Boolean,
    closeBtn: Boolean,
  },

  methods: {
    onClose() {
      this.setData({ show: false })
    },

    onImg() {
      const { img, url } = this.data
      url ? nav(url) : g.previewImage({ urls: [img] })
    },

    async onSave() {
      const isAuth = await apiIsAuth('saveImageToPhotosAlbum')
      if (isAuth) {
        g.saveImageToPhotosAlbum({ filePath: this.data.img }) // filePath 需要是临时路径
        this.onClose()
      }
    },
  },

})
