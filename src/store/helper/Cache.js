export default class {
  static caches = Object.create(null)

  static findOrCreate(id) {
    const key = `${this.name}${id}`
    let value = this.caches[key]

    if (!value) {
      value = new this()
      value.id = id
      this.caches[key] = value
    }

    return this.caches[key]
  }
}
