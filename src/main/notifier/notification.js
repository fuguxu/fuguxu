
export default class Notification {
  constructor (name, resolve) {
    this.name = name
    this.resolve = resolve
  }

  get name () {
    return this._name
  }

  set name (name) {
    this._name = name
  }

  get resolve () {
    return this._resolve
  }

  set resolve (resolve) {
    this._resolve = resolve
  }
}
