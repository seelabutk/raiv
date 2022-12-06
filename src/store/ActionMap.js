import Action from '@/store/Action'

export default class ActionMap {
  constructor() {
    this.action = null
    this.children = []
    this.lastAction = null
    this.target = null
  }

  _load(node) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      child.target = document.elementFromPoint(...child.clickPosition)

      this._load(child)
    }
  }

  load(storageObj) {
    this.children = storageObj.actions

    this._load(this)

    if (storageObj.lastAction !== null) {
      const lastActionTarget = document.elementFromPoint(
        ...storageObj.lastAction.clickPosition
      )
      const searchResult = this.find(lastActionTarget)

      this.lastAction = searchResult[0].children[searchResult[1]]
    } else {
      this.lastAction = null
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

    if (this.lastAction === null) {
      this.children.push(action)
    } else {
      this.lastAction.children.push(action)
    }

    this.lastAction = action
  }

  remove(target) {
    let removedAction = null
    const searchResult = this._find(this, target)

    if (searchResult !== null) {
      const parent = searchResult[0]
      const index = searchResult[1]

      if (this.lastAction.target === target) {
        // If the parent of the removed action is the root, then we want to set this.lastAction to null so that the next addAction call works.
        if (parent !== this) {
          this.lastAction = parent
        } else {
          this.lastAction = null
        }
      }

      removedAction = parent.children.splice(index, 1)
    }

    return removedAction
  }
}
