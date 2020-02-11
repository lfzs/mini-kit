import { fetchAction, fly } from '@util'
import { observable } from 'mobx'

export default new class {
  @observable data = {};
  @observable userInfo = {}

  @fetchAction
  fetchData() {
    return fly.get('user')
  }

  updateUserInfo(userInfo = {}) {
    if (userInfo.nickName) {
      userInfo.nickname = userInfo.nickName
      userInfo.avatar = userInfo.avatarUrl
      delete userInfo.nickName
      delete userInfo.avatarUrl
    }
    this.userInfo = { ...this.userInfo, ...userInfo }
    return fly.put('user', userInfo)
  }
}
