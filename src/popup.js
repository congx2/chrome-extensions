const isFolder = obj => {
  return obj && obj.title && !hasOwnKey(obj, 'url')
}

const isBookmark = obj => {
  return obj && obj.title && obj.url
}

const isFragment = node => {
  const FRAGMENT_NODE_TYPE = 11
  return node && node.nodeType === FRAGMENT_NODE_TYPE
}

const getFavicon = url => {
  const a = document.createElement('a')
  a.href = url
  const origin = a.origin.replace(/\/?$/, '')
  return `${origin}/favicon.ico`
}

const sortBookmarkAfterFolder = list => {
  if (!Array.isArray(list) || !list.length) {
    return []
  }
  const order = node => isFolder(node) ? 2 : isBookmark(node) ? 1 : 0
  const comparer = (a, b) => order(b) - order(a)
  return list.slice().sort(comparer)
}

const createElement = (tag) => {
  if (typeof tag !== 'string') {
    return document.createDocumentFragment()
  }
  if (/<[a-z]/i.test(tag)) {
    const div = document.createElement('div')
    div.innerHTML = tag
    return div.firstElementChild
  }
  return document.createElement(tag)
}

const createBookmarkNode = node => {
  const { id, title, url } = node
  const favicon = getFavicon(url)
  const html = `
    <li id="${id}" class="bookmark">
      <a class="bookmark-link" href="${url}" title="${title}" target="_blank">
        <img class="favicon" src="${favicon}" />
        <span>${title}</span>
      </a>
    </li>
  `
  return createElement(html)
}

const createFolderHeaderNode = node => {
  const html = `
    <h3 class="folder-header">
      <img class="folder-arrow-icon" src="./images/arrow-right.png" alt="icon" />
      <span>${node.title}</span>
    </h3>
  `
  return createElement(html)
}

const createBookmarkTree = bookmarkTreeNodeList => {
  const list = sortBookmarkAfterFolder(bookmarkTreeNodeList)
  let container = document.createDocumentFragment()

  for (let i = 0; i < list.length; i++) {
    const item = list[i]

    if (isFragment(container) && (isBookmark(item) || isFolder(item))) {
      container = document.createElement('ul')
    }

    if (isBookmark(item)) {
      container.appendChild(createBookmarkNode(item))
      continue
    }

    let node = document.createDocumentFragment()
    if (isFolder(item)) {
      node = document.createElement('li')
      node.id = item.id
      node.classList.add('folder')
      node.appendChild(createFolderHeaderNode(item))
    }

    if (Array.isArray(item.children) && item.children.length) {
      node.appendChild(createBookmarkTree(item.children))
    }
    container.appendChild(node)
  }

  return container
}


const createBookmarkTreeNode = tree => {
  const treeContainer = document.getElementById('bm-tree')
  treeContainer && treeContainer.appendChild(createBookmarkTree(tree))
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.bookmarks.getTree().then(tree => {
    console.log(tree)
    createBookmarkTreeNode(tree)
  })
}, false)
