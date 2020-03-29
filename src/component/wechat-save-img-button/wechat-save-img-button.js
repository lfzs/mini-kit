// 保存图片
import { toast, wxp } from '@util'

Component({
  externalClasses: ['custom-class'],
  properties: {
    text: {
      type: String,
      value: '保存图片',
    },
    filePath: String,
  },

  data: {
    canSaveImg: true,
  },

  methods: {

    async openSetting() {
      await wxp.openSetting()
      this.emitSaveImg()
    },

    emitSaveImg() {
      let { canSaveImg, filePath } = this.data
      wx.saveImageToPhotosAlbum({
        filePath,
        success: res => {
          this.triggerEvent('click', res)
          canSaveImg = true
        },
        fail: ({ errMsg }) => {
          const isRefuse = /deny|response|denied/.test(errMsg) // 判断是否是拒绝触发的
          console.log(errMsg) // eslint-disable-line no-console
          if (isRefuse) {
            canSaveImg = false
            toast('授权失败，点击重试')
          } else {
            toast('保存失败，点击重试')
          }
        },
        complete: () => this.setData({ canSaveImg }),
      })
    },

  },
})
