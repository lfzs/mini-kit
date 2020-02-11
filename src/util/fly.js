import Fly from 'flyio/dist/npm/wx'
import { host, wxp } from '@util'
import { tokenStore } from '@store'
import _ from 'lodash'

const fly = new Fly()
fly.config.baseURL = `${host}/app/api/v1`

fly.interceptors.request.use(handleRequest)
fly.interceptors.response.use(handleResponse, handleError)

async function handleRequest(request) {
  // 请求不需要带 token 时，可以注释以下两行
  const token = await tokenStore.getToken()
  token && (request.headers.Authorization = token)
  return request
}

function handleResponse(res) {
  const { headers = {} } = res
  if (headers['x-page']) {
    res.meta = {
      per_page: +headers['x-per-page'][0],
      page: +headers['x-page'][0],
      total: +headers['x-total'][0],
    }
  }
  return res
}

async function handleError(err) {
  if (err.status === 401) {
    // 向后台换取 token 的接口是否需要用加密数据。保留一种即可

    // 需要
    const canGetUserInfo = await tokenStore.canGetUserInfo()
    if (canGetUserInfo) {
      wx.login()
      const userInfo = await wxp.getUserInfo()
      await tokenStore.login(userInfo)
      return fly.request(err.request)
    }

    // 不需要
    // await tokenStore.login()
    // return fly.request(err.request)
  }
  throw { ..._.get(err, 'response.data', {}), status: err.status }
}

export default fly
