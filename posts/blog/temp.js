const N = 5,
  M = 6,
  S = 1;
const edges = [
  [1, 2, 2],
  [1, 3, 5],
  [2, 3, 1],
  [2, 4, 2],
  [3, 5, 3],
  [4, 5, 1],
];
// result
// 0
// 2
// 3
// 4
// 5
// ---
// const N = 6,
//   M = 4,
//   S = 1;
// const edges = [
//   [1, 2, 2],
//   [2, 3, 4],
//   [2, 4, 6],
//   [5, 6, 1],
// ];

// 0
// 2
// 6
// 8
// INF
// INF
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  sort() {
    this.items.sort((a, b) => a[1] - b[1]);
  }

  enqueue(value, priority) {
    this.items.push([value, priority]);
  }

  dequeue() {
    return this.items.shift();
  }
}

function dijkstra(n, edges, start) {
  const dist = Array.from({ length: n + 1 }).fill(Infinity);

  const adjList = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    adjList[u].push([v, w]);
    adjList[v].push([u, w]);
  }

  dist[start] = 0;

  const pq = new PriorityQueue();
  pq.enqueue(start, 0);

  while (pq.size() > 0) {
    const [u, currDist] = pq.dequeue();

    for (const [v, w] of adjList[u]) {
      if (dist[v] > currDist + w) {
        dist[v] = currDist + w;
        pq.enqueue(v, dist[v]);
      }
    }
  }

  return dist.slice(1);
}
const result = dijkstra(N, edges, S);
console.log(result);
console.log(result.map((d) => (d === Infinity ? "INF" : d)).join("\n"));
