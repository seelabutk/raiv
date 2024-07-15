export function getSortFunction(sortType) {
  switch (sortType.value) {
    case 'created':
      return sortByCreated
    case 'updated':
      return sortByUpdated
    case 'size':
      return sortBySize
    case 'title':
      return sortByTitle
    case 'username':
      return sortByUsername
    case 'groupName':
      return sortByGroupName
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
export function sortByUsername(a, b) {
  a = a.username.toLowerCase()
  b = b.username.toLowerCase()
  if (a < b) {
    return 1
  }
  if (a > b) {
    return -1
  }
  return 0
}

export function sortByGroupName(a, b) {
  a = a.groupName.toLowerCase()
  b = b.groupName.toLowerCase()
  if (a < b) {
    return 1
  }
  if (a > b) {
    return -1
  }
  return 0
}