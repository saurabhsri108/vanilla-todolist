export default class TodoList {
  constructor() {
    this._list = [];
  }

  getList() {
    return this._list;
  }

  clearList() {
    this._list = [];
  }

  addItemToList(item) {
    this._list.push(item);
  }

  removeItemFromList(id) {
    const list = this._list.filter(i => i._id != id);
    console.log({list});
    this._list = list;
  }
}