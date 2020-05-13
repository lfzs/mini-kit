import { mineStore } from '@store'
import { TOKEN_KEY, fly, wxp } from '@util'

export default new class {

  token = ''

  saveToken(token) {
    this.token = token
    wx.setStorage({ key: TOKEN_KEY, data: token })
  }

  removeToken() {
    this.token = ''
    wx.removeStorageSync(TOKEN_KEY)
  }

  getToken() {
    this.token = this.token || wx.getStorageSync(TOKEN_KEY)
    return this.token
  }

  // 是否可以使用 wx.getUserInfo 获取用户信息
  async canGetUserInfo() {
    const { authSetting } = await wxp.getSetting()
    return !!authSetting['scope.userInfo']
  }

  // code 为调用 wx.getUserInfo 前获取的。 userInfo 格式为 wx.getUserInfo 获取的值
  async login(code = '', userInfo = {}) {
    const body = { code, encrypted_data: userInfo.encryptedData, iv: userInfo.iv }
    const { data: { access_token } } = await fly.post('user/token', body)
    this.saveToken(access_token)

    mineStore.updateUserInfo(userInfo.userInfo)
  }

}
