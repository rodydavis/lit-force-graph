export class Graph {
  private ids = new Set();
  private graph: GraphData = {
    nodes: [],
    links: [],
  };

  addNode<T = any>(node: GraphNode<T>) {
    if (this.ids.has(node.id)) {
      return this.graph.nodes.find((n) => n.id === node.id)!;
    }
    this.ids.add(node.id);
    this.graph.nodes.push(node);
    return node;
  }

  addLink<T = any>(link: GraphLink<T>) {
    this.graph.links.push(link);
    return link;
  }

  toJSON() {
    return this.graph;
  }
}

export interface GraphNode<T = any> {
  id: string;
  name?: string;
  group?: string;
  value?: T;
}

export interface GraphLink<T = any> {
  source: string;
  target: string;
  name?: string;
  value?: T;
}

export interface GraphData<A = any, B = any> {
  name?: string;
  description?: string;
  nodes: GraphNode<A>[];
  links: GraphLink<B>[];
}
