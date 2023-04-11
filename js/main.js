import TodoItem from "./todo-item.js";
import TodoList from "./todo-list.js";

const todoList = new TodoList();

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  // Add Listeners
  setFocusOnItemEntry();
  const itemEntryForm = document.getElementById('item-entry-form');
  itemEntryForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    processSubmission();
  })
  
  const clearItems = document.getElementById('clear-items');
  clearItems.addEventListener('click', (event) => {
    const list = todoList.getList();
    if(list.length) {
      const confirmed = confirm("Are you sure you want to clear the entire list?");
      if(confirmed) {
        todoList.clearList();
        updatePersistentData(todoList.getList())
        refreshThePage();
      }
    }
  })

  loadListItems();
  refreshThePage();
};

const loadListItems = () => {
  const storedListItems = localStorage.getItem('my-todo-list');
  if(typeof storedListItems !== 'string') return;
  const parsedListItems = JSON.parse(storedListItems);
  parsedListItems.forEach(item => {
    const newTodoItem = createNewItem(item._id, item._item);
    todoList.addItemToList(newTodoItem);

  })
}

const refreshThePage = () => {
  clearListDisplay();
  renderList();
  clearItemEntryField();
  setFocusOnItemEntry();
};

const clearListDisplay = () => {
  const parentElement = document.getElementById('list-items');
  deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const renderList = () => {
  const list = todoList.getList();
  list.forEach(item => {
    buildListItem(item);
  });
};

const buildListItem = (item) => {
  const div = document.createElement('div');
  div.className = "item";
  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = item.getId();
  checkbox.tabIndex = 0;
  addClickListnerToCheckbox(checkbox);
  const label = document.createElement("label");
  label.htmlFor = item.getId();
  label.textContent = item.getItem();
  div.appendChild(checkbox);
  div.appendChild(label);
  const container = document.getElementById('list-items');
  container.appendChild(div);
};

const addClickListnerToCheckbox = (checkbox) => {
  checkbox.addEventListener('click', event => {
    todoList.removeItemFromList(checkbox.id);
    const removedText = getLabelText(checkbox.id);
    updatePersistentData(todoList.getList());
    updateScreenReaderConfirmation(removedText, "removed from list");
    setTimeout(() => {
      refreshThePage();
    }, 1000);
  });
};

const getLabelText = (checkboxId) => {
  return document.getElementById(checkboxId).nextElementSibling.textContent;
}

const updatePersistentData = (listItems) => {
  localStorage.setItem('my-todo-list', JSON.stringify(listItems));
}

const clearItemEntryField = () => {
  document.getElementById('new-item').value = "";
}

const setFocusOnItemEntry = () => {
  document.getElementById('new-item').focus();
}

const processSubmission = () => {
  const newEntryText = getNewEntry();
  if(!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const todoItem = createNewItem(nextItemId, newEntryText);
  todoList.addItemToList(todoItem);
  updatePersistentData(todoList.getList());
  updateScreenReaderConfirmation(newEntryText, "added");
  refreshThePage();
}

const getNewEntry = () => {
  return document.getElementById('new-item').value.trim();
}

const calcNextItemId = () => {
  let nextItemId = 1;
  const list = todoList.getList();
  if(list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
}

const createNewItem = (itemId, itemText) => {
  const todo = new TodoItem();
  todo.setId(itemId);
  todo.setItem(itemText);
  return todo;
}

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}`;
}