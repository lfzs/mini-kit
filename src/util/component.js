import { shareMethod } from '@util'

const platform = {
  weixin: {
    addGlobalClass: true,

    getProperties: opt => opt,
    properties: 'properties',

    attached: 'attached',
    ready: 'ready',
    detached: 'detached',
  },
  alipay: {
    thisProperties: true,

    getProperties: weixinProperties2alipayProps,
    properties: 'props',

    attached: 'onInit',
    ready: 'didMount',
    detached: 'didUnmount',
  },
}[process.env.PLATFORM]

const oldComponent = Component

Component = (config = {}) => {
  const { properties = {}, methods = {}, options = {}, attached, ready, detached } = config

  const prop = platform.getProperties(properties)

  const interceptors = {
    [platform.properties]: prop,
    [platform.attached]: function() { attached && attached.call(this) },
    [platform.ready]: function() { ready && ready.call(this) },
    [platform.detached]: function() { detached && detached.call(this) },
    methods: Object.assign({}, shareMethod, methods),
  }

  if (platform.addGlobalClass) interceptors.options = Object.assign({}, options, { addGlobalClass: true }) // 设置微信样式不隔离, 支付宝默认不隔离
  if (platform.thisProperties) interceptors.properties = prop // 支付宝添加 this.properties 访问

  return oldComponent(Object.assign({}, config, interceptors))
}

function weixinProperties2alipayProps(weixinProperties) {
  // 支付宝不支持微信的 type optionalTypes observer
  const props = {}
  Object.keys(weixinProperties).map(key => props.key = weixinProperties[key].value)
  this.properties = props
  return props
}

