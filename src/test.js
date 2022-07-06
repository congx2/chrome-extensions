const hasOwnKey = (obj, key) => {
  return obj && Object.prototype.hasOwnProperty.call(obj, key)
}

const isFolder = obj => {
  return obj && obj.title && !hasOwnKey(obj, 'url')
}

const isBookmark = obj => {
  return obj && obj.title && obj.url
}

const sortBookmarkAfterFolder = list => {
  if (!Array.isArray(list) || !list.length) {
    return []
  }
  const order = node => isFolder(node) ? 2 : isBookmark(node) ? 1 : 0
  const comparer = (a, b) => order(b) - order(a)
  return list.slice().sort(comparer)
}


const list = [
  { id: 1, title: 'B1', url: 'U1' },
  { id: 2, title: 'B2', url: 'U2' },
  { id: 3, title: 'F1' },
  { id: 4, title: 'F2' },
  { id: 5, title: 'F3' },
  { id: 6, title: 'B6', url: 'U6' },
  { id: 7, title: 'F4' },
  { id: 8, title: 'B7', url: 'U7' },
  { id: 9, title: 'F5' }
]

const f = sortBookmarkAfterFolder(list)
console.log(list)
console.log(f)
