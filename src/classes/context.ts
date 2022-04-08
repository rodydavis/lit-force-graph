import { GraphData, GraphNode } from "./graph";

export interface RenderContext {
  data: GraphData;
  element: HTMLElement;
  onHover: (node?: GraphNode) => void;
}

export type Renderer = (context: RenderContext) => void;
