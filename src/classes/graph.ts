export interface GraphNode<T = any> {
  id: string;
  name?: string;
  group?: string;
  value?: T;
}

export interface GraphLink {
  source: string;
  target: string;
  name?: string;
}

export interface GraphData {
  name?: string;
  description?: string;
  nodes: GraphNode[];
  links: GraphLink[];
}
