export default class {
  static caches = Object.create(null)

  static findOrCreate(id) {
    const key = `${this.name}${id}`
    return this.caches[key] = this.caches[key] || { ...new this(), id }
  }
}
