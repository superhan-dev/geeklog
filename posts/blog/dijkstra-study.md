# Tag

- Algorithm
- Dijkstra
- Graph

# Dijkstra Algorithm

다익스트라 알고리즘은 그래프의 가중치를 그리디 알고리즘의 원리로 무조건 짧으면 취하는 방식으로 노드간 길이를 구한다.

이때 사용되는 방식은 BFS를 사용하며 우선순위 큐 또는 최소힙을 사용하여 노드간의 거리를 구할 수 있다.

다익스트라를 공부하기 앞서 우선순위 큐와 최소힙을 공부해 보자.

# Priority Queue

`Priority Queue`의 주요 메소드로는 `enqueue`, `dequeue`, `sort`가 있다. 넣을때 정렬하고 pop하여 뺀다. 값을 넣을때는 value와 priority를 함께 넣어 줘야하며 `sort` 할때 priority에 따라 정렬하여 우선순위를 유지한다.

```Javascript
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(value, priority) {
    this.queue.push({ value, priority });
    console.log(`Enqueued: `, this.queue);
    this.sort();
  }

  dequeue() {
    return this.queue.shift();
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}

const pq = new PriorityQueue();

pq.enqueue("A", 3);
pq.enqueue("B", 1);

```

---

# Min Heap

가장 작은 값을 최상위 노드로 갖는 트리 구조를 가르키며 `push`, `pop`, `bubleDown`, `bubleUp`, `swap` 과 같은 기본 메소드를 갖는다.

- push
  리스트 가장 끝에 값을 넣고 부모 노드와 값을 비교하면서 끌어올린다.

- pop
  가장 작은 노드를 반환하고 가장 끝의 값을 최상위 노드에 넣고 내려가며 적절한 위치를 찾는다.

```javascript
class MinHeap {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
    this.bubleUp();
  }
  pop() {
    if (this.items.length === 0) {
      return null;
    }
    let min = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.bubbleDown();

    return min;
  }
  swap(a, b) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  bubleUp() {
    let index = this.items.length;
    while (index > 0) {
      let parentIndex = Math.floor(index - 1 / 2);
      if (this.items[parentIndex] < this.items[index]) break;

      this.items[parentIndex] = this.items[index];

      parentIndex = index;
    }
  }
  bubleDown() {
    let index = 0;
    // left의 자식 노드의 index가 length 보다 작다면 반복한다.
    while (index * 2 + 1 < this.items.length) {
      let leftChild = index * 2 + 1;
      let rightChild = index * 2 + 2;
      let smallerChild =
        rightChild < this.items.length &&
        this.items[rightChile] < this.items[leftChild]
          ? rightChild
          : leftChild;

      this.swap(index, smallerChild);
      index = smallerChild;
    }
  }
}
```

# 공부중인 코드

```javascript
const graph = {
  A: { B: 9, C: 3 },
  B: { A: 9, D: 2 },
  C: { A: 3, D: 8, E: 1 },
  D: { B: 2, C: 8, E: 7, F: 4 },
  E: { C: 1, D: 7, F: 6 },
  F: { D: 4, E: 6 },
};

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(value, priority) {
    this.queue.push({ value, priority });
    console.log(`Enqueued: `, this.queue);
    this.sort();
  }

  dequeue() {
    return this.queue.shift();
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}

const pq = new PriorityQueue();

pq.enqueue("A", 3);
pq.enqueue("B", 1);

class MinHeap {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
    console.log("push:", this.items);
    this.bubbleUp();
  }

  pop() {
    if (this.items.length === 0) {
      return null;
    }

    let min = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    const temp = this.items.pop();
    this.bubbleDown();

    return min;
  }
  swap(a, b) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  bubbleUp() {
    let index = this.items.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.items[parentIndex] <= this.items[index]) break;

      this.swap(parentIndex, index);

      index = parentIndex;
    }
  }
  bubbleDown() {
    let index = 0;

    // left의 자식 노드의 index가 length 보다 작다면 반복한다.
    while (index * 2 + 1 < this.items.length) {
      let leftChild = index * 2 + 1;
      let rightChild = index * 2 + 2;
      let smallerChild =
        rightChild < this.items.length &&
        this.items[rightChild] < this.items[leftChild]
          ? rightChild
          : leftChild;

      // 이 코드가 없으면 1,3,5,4,8이 되고 있다면 1,3,4,5,8이 된다.
      // 왜 그런거지?
      // 이 코드는 현재 노드가 자식 노드보다 작거나 같을때 멈추라는 뜻이다.
      // 즉, 더 이상 내려갈 필요가 없다는 것이다.
      // 하지만 해당 코드가 없다면 계속해서 자식 노드와 비교하며 내려가게 된다.
      if (this.items[index] <= this.items[smallerChild]) break;

      this.swap(index, smallerChild);
      index = smallerChild;
    }
  }
}

const minHeap = new MinHeap();
minHeap.push(5);
minHeap.push(3);
minHeap.push(8);
minHeap.push(1);
minHeap.push(4);

console.log(minHeap.pop()); // 1
console.log(minHeap.pop()); // 3
console.log(minHeap.pop()); // 4
console.log(minHeap.pop()); // 5
console.log(minHeap.pop()); // 8
```
