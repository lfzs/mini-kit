import { flow } from 'mobx'

// 类方法装饰器
export default function(target, name, descriptor) { //target 为构造函数
  const { value } = descriptor
  if (typeof value !== 'function') throw new Error(`${name} is not a function`)

  target.tryFetchData = function() { return this._state !== 'done' && this.fetchData() }

  // this 指向实例 => 将 _state 暴露到实例上
  descriptor.value = flow(function* (...args) {
    this._state = 'pending'
    try {
      const res = yield value.apply(this, args)
      this._state = 'done'
      return this.data = res.data || res // 会把 返回值 赋值到 data 上
    } catch (error) {
      this._state = 'error'
      throw error
    }
  })
}
