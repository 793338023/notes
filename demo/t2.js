// 小顶堆

class MinHeap {
  heap = [];

  getLeftIndex(index) {
    return index * 2 + 1;
  }
  getRightIndex(index) {
    return index * 2 + 2;
  }
  getParentIndex(index) {
    if (index === 0) {
      return;
    }
    return Math.floor((index - 1) / 2);
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  siftUp(index) {
    let parentIndex = this.getParentIndex(index);
    while (index > 0 && this.heap[index] < this.heap[parentIndex]) {
      this.swap(index, parentIndex);
      index = parentIndex;
      parentIndex = this.getParentIndex(index);
    }
  }

  insert(value) {
    if (value !== null) {
      this.heap.push(value);
      this.siftUp(this.heap.length - 1);
      return true;
    }
    return false;
  }

  siftDown(index) {
    let temIndex = index;
    const leftIndex = this.getLeftIndex(temIndex);
    const rightIndex = this.getRightIndex(index);
    if (
      leftIndex < this.heap.length &&
      this.heap[temIndex] > this.heap[leftIndex]
    ) {
      temIndex = leftIndex;
    }
    if (
      rightIndex < this.heap.length &&
      this.heap[temIndex] > this.heap[rightIndex]
    ) {
      temIndex = rightIndex;
    }
    if (temIndex !== index) {
      this.swap(temIndex, index);
      this.siftDown(temIndex);
    }
  }

  extract() {
    if (this.heap.length === 0) {
      return;
    }
    if (this.heap.length === 1) {
      return this.heap.shift();
    }
    const remve = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    return remve;
  }
}

/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  const minHeap = new MinHeap();
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      minHeap.insert(matrix[i][j]);
    }
  }
  let ret = 0;
  while (k--) {
    ret = minHeap.extract();
  }
  return ret;
};
