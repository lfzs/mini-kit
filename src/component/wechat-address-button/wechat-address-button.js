// 获取微信地址
import { toast, wxp } from '@util'

Component({
  externalClasses: ['custom-class'],
  properties: {
    text: {
      type: String,
      value: '使用微信地址',
    },
  },

  data: { canGetWechatAddress: true },

  methods: {

    async openSetting() {
      await wxp.openSetting()
      this.emitAddress()
    },

    emitAddress() {
      let { canGetWechatAddress } = this.data
      wx.chooseAddress({
        success: ({ userName, telNumber, provinceName, cityName, countyName, detailInfo }) => {
          this.triggerEvent('click', {
            receiver_name: userName,
            tel_number: telNumber,
            province_name: provinceName,
            city_name: cityName,
            county_name: countyName,
            detail_info: detailInfo,
          })
          canGetWechatAddress = true
        },
        fail: ({ errMsg }) => {
          const isRefuse = /deny|response|denied/.test(errMsg) // 判断是否是拒绝触发的
          console.log(errMsg) // eslint-disable-line no-console
          if (isRefuse) {
            canGetWechatAddress = false
            toast('授权失败，点击重试')
          } else {
            toast('获取失败，点击重试')
          }
        },
        complete: () => this.setData({ canGetWechatAddress }),
      })
    },

  },
})
