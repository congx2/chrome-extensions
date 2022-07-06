const getStringTag = value => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

const isPlainObject = value => {
  return getStringTag(value) === 'Object'
}

const hasOwnKey = (obj, key) => {
  return obj && Object.prototype.hasOwnProperty.call(obj, key)
}

