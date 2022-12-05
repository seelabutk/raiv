import Action from '@/store/Action'

export default class ActionMap {
  constructor() {
    this.action = null
    this.children = []
    this.target = null
  }

  load(node) {
    let currentNode = node
    if (currentNode === undefined) {
      currentNode = this
    }

    for (let index = 0; index < currentNode.children.length; index++) {
      const child = currentNode.children[index]

      child.target = document.elementFromPoint(...child.clickPosition)

      this.load(child)
    }
  }

  // Returns the parent of action and its index in parent's children array for easy removal
  _find(node, target) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      if (child.target === target) {
        return [node, index]
      }

      const result = this._findAction(child, target)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  find(target) {
    return this._find(this, target)
  }

  add(target, event) {
    const action = new Action(target, event)

    if (this.lastAction.value === null) {
      this.actionMap.value.children.push(action)
    } else {
      this.lastAction.value.children.push(action)
    }

    this.lastAction.value = action

    this.save()
  }

  remove(target) {
    let removedAction = null
    const searchResult = this._find(this, target)

    if (searchResult !== null) {
      const parent = searchResult[0]
      const index = searchResult[1]

      if (this.lastAction.value.target === target) {
        // If the parent of the removed action is the root, then we want to set this.lastAction.value to null so that the next addAction call works.
        if (parent !== this.actionMap.value) {
          this.lastAction.value = parent
        } else {
          this.lastAction.value = null
        }
      }

      removedAction = parent.children.splice(index, 1)

      this.save()
    }

    return removedAction
  }
}
