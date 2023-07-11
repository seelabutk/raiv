export function getSortFunction(sortType) {
  switch (sortType) {
    case 'created':
      return sortByCreated
    case 'updated':
      return sortByUpdated
    case 'size':
      return sortBySize
    case 'title':
      return sortByTitle
    default:
      return sortByCreated
  }
}

export function sortByCreated(a, b) {
  if (a.metadata.created < b.metadata.created) {
    return 1
  }
  if (a.metadata.created > b.metadata.created) {
    return -1
  }
  return 0
}

export function sortByUpdated(a, b) {
  if (a.metadata.updated < b.metadata.updated) {
    return 1
  }
  if (a.metadata.updated > b.metadata.updated) {
    return -1
  }
  return 0
}

export function sortBySize(a, b) {
  if (a.metadata.size < b.metadata.size) {
    return 1
  }
  if (a.metadata.size > b.metadata.size) {
    return -1
  }
  return 0
}

export function sortByTitle(a, b) {
  a = a.name.toLowerCase()
  b = b.name.toLowerCase()
  if (a < b) {
    return 1
  }
  if (a > b) {
    return -1
  }
  return 0
}
