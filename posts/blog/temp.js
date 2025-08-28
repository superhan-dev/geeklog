class MinHeap {
  constructor() {
    this.items = [];
  }

  swap(a, b) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  size() {
    return this.items.length;
  }

  push(value) {
    this.items.push(value);
    this.bubbleUp();
  }

  pop() {
    if (this.items.length === 0) return null;

    let min = this.items[0];
    this.items[0] = this.items[this.size() - 1];
    this.items.pop();

    this.bubbleDown();

    return min;
  }

  bubbleUp() {
    let index = this.size() - 1;

    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      // 부모의 값이 index보다 작으면 멈춘다.
      if (this.items[parentIndex] <= this.items[index]) break;

      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;
    while (index * 2 + 1 < this.size()) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smaller =
        right < this.size() && this.items[right] < this.items[left]
          ? right
          : left;

      // smaller 값이 index 보다 작다면 순회를 멈춘다.
      if (this.items[index] <= this.items[smaller]) break;

      this.swap(index, smaller);
      index = smaller;
    }
  }
}

const minHeap = new MinHeap();

const graph = {
  A: { B: 9, C: 3 },
  B: { A: 9, D: 2 },
  C: { A: 3, D: 8, E: 1 },
  D: { B: 2, C: 8, E: 7, F: 4 },
  E: { C: 1, D: 7, F: 6 },
  F: { D: 4, E: 6 },
};

function solution(graph, start) {
  const distances = {};

  for (const node in graph) {
    distances[node] = Infinity;
  }

  distances[start] = 0;
  const minHeap = new MinHeap();

  minHeap.push([distances[start], start]);

  const paths = { [start]: [start] };

  while (minHeap.size() > 0) {
    const [currDist, currNode] = minHeap.pop();

    if (distances[currNode] < currDist) continue;

    for (const adjNode in graph[currNode]) {
      const weight = graph[currNode][adjNode];

      const dist = currDist + weight;

      if (dist < distances[adjNode]) {
        distances[adjNode] = dist;

        paths[adjNode] = [...paths[currNode], adjNode];
        minHeap.push([dist, adjNode]);
      }
    }
  }

  const sortedPaths = {};
  Object.keys(paths)
    .sort()
    .forEach((node) => {
      sortedPaths[node] = paths[node];
    });

  console.log("최단 경로:", sortedPaths);

  return [distances, sortedPaths];
}

const temp = solution(graph, "A");

console.log("res:", temp);
