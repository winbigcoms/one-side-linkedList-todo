const listArray = [];

const addDOM = (node, listTitle) => {
  const { data, idx } = node;
  const li = makeLi({ ...data, idx }, listTitle);
  const listDOM = document.getElementById(listTitle).firstChild;
  listDOM.appendChild(li);
  return;
};

const setDOM = (node, type, listTitle) => {
  const ul = document.createElement("ul");
  const listDOM = document.getElementById(listTitle);
  if (type !== "init") {
    listDOM.removeChild(listDOM.firstChild);
  }
  if (!node) {
    listDOM.appendChild(ul);
    return;
  }
  const linkArr = nodeDatasToArray(node);

  linkArr.forEach((data) => {
    const li = makeLi(data, listTitle);
    ul.appendChild(li);
  });
  listDOM.appendChild(ul);
  return;
};

class LinkedListNode {
  idx = 0;
  data = {};
  nextNode = undefined;

  constructor(data, idx) {
    this.data = data;
    this.idx = idx;
  }

  getData() {
    return this.data;
  }

  setNext(node) {
    this.nextNode = node;
    return;
  }
}

class LinkedList {
  headNode = {};
  lastNode = {};
  lastIdx = 0;
  constructor(nodeList) {
    if (nodeList) {
      nodeList.forEach((nodeItem, idx) => {
        const newNode = new LinkedListNode(nodeItem, idx);
        if (idx === 0) {
          this.headNode = newNode;
        } else {
          this.lastNode.setNext(newNode);
        }
        this.lastNode = newNode;
        this.lastIdx = idx;
      });
    }
  }

  searchNode(targetIdx, node, beforeNode) {
    if (node && node.idx !== targetIdx) {
      return this.searchNode(targetIdx, node.nextNode, node);
    } else {
      return { node, beforeNode };
    }
  }

  linkNode(nodeItem, listTitle) {
    this.lastIdx++;
    const newNode = new LinkedListNode(nodeItem, this.lastIdx);
    if (this.headNode && this.headNode.data) {
      this.lastNode.setNext(newNode);
    } else {
      this.headNode = newNode;
    }
    this.lastNode = newNode;
    addDOM(this.lastNode, listTitle);
    return;
  }

  deleteNode(targetNodeIdx, listTitle) {
    const targetList = listArray.find((list) => list.title === listTitle);
    console.log(targetNodeIdx, targetList, listArray, listTitle);
    const searchedNode = targetList.data.searchNode(
      targetNodeIdx,
      targetList.data.headNode
    );
    const target = searchedNode.node;
    const front = searchedNode.beforeNode;
    const next = target.nextNode;
    if (front) {
      front.setNext(next);
    } else {
      this.headNode = next;
    }
    if (!next) {
      this.lastNode = front;
    }
    setDOM(targetList.data.headNode, "fix", listTitle);
  }
}

function nodeDatasToArray(node) {
  const returnArr = [];
  returnArr.push({ ...node.data, idx: node.idx });
  if (node.nextNode) {
    return [...returnArr, ...nodeDatasToArray(node.nextNode)];
  }
  return returnArr;
}

const makeLi = (data, listTitle) => {
  const li = document.createElement("li");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  li.setAttribute("class", "listItem");
  h3.setAttribute("class", "itemTitle");
  p.setAttribute("class", "itemDesc");

  h3.innerText = data.title;
  p.innerText = data.desc;
  li.appendChild(h3);
  li.appendChild(p);
  li.addEventListener("click", () => {
    const node = listArray.find((list) => list.title === listTitle);
    console.log(listArray, listTitle);
    node.data.deleteNode(data.idx, listTitle);
  });
  return li;
};

const makeListButton = document.getElementById("makeList");
const addListButton = document.getElementById("addList");

addListButton.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const listForm = document.getElementById("listForm");
  modal.style.display = "block";
  listForm.style.display = "flex";
});

makeListButton.addEventListener("click", () => {
  const title = document.getElementById("title");
  if (!title.value) return;

  const container = document.getElementById("listContainer");

  const wraaper = document.createElement("div");
  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  const ul = document.createElement("ul");
  const addBtn = document.createElement("button");
  const span = document.createElement("span");
  const span1 = document.createElement("span");

  addBtn.dataset.title = title.value;
  addBtn.setAttribute("class", "addList width30");
  addBtn.appendChild(span);
  addBtn.appendChild(span1);

  h2.innerText = title.value;

  div.setAttribute("id", title.value);
  div.setAttribute("class", "list");
  div.appendChild(ul);
  addBtn.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    const itemForm = document.getElementById("itemForm");
    const makeItem = document.getElementById("makeItem");
    modal.style.display = "block";
    itemForm.style.display = "flex";
    const title = e.currentTarget.dataset.title;
    const { data } = listArray.find((list) => list.title === title);

    function makeItemHanddler() {
      console.log(data);
      const itemTitle = document.getElementById("itemTitle");
      const itemDesc = document.getElementById("itemDesc");
      data.linkNode(
        {
          title: itemTitle.value,
          desc: itemDesc.value,
        },
        title
      );
      itemForm.value = "";
      makeItem.value = "";
      modal.style.display = "none";
      itemForm.style.display = "none";
      this.removeEventListener("click", makeItemHanddler);
    }

    makeItem.addEventListener("click", makeItemHanddler);
  });

  wraaper.appendChild(h2);
  wraaper.appendChild(div);
  wraaper.appendChild(addBtn);
  const newList = new LinkedList();
  listArray.push({ title: title.value, data: newList });
  container.appendChild(wraaper);
  modal.style.display = "none";
  listForm.style.display = "none";
  title.value = "";
});
