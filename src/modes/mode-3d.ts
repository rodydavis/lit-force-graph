import ForceGraph from "3d-force-graph";
import { RenderContext } from "../classes/context.js";

export function render3D(context: RenderContext) {
  const graph = ForceGraph({
    controlType: "trackball",
    rendererConfig: { antialias: true, alpha: true },
  });
  const style = getComputedStyle(context.element);
  const lineColor = style.getPropertyValue("--graph-line-color").trim();
  const bgColor = style.getPropertyValue("--graph-background-color").trim();
  const nodeColor = style.getPropertyValue("--graph-node-color").trim();
  graph(context.element)
    .graphData(context.data)
    .width(Number(style.width.slice(0, -2)))
    .height(Number(style.height.slice(0, -2)))
    .showNavInfo(false)
    .linkColor(() => lineColor)
    .backgroundColor(bgColor)
    .nodeThreeObject((node: any) => {
      const color = node.color ?? nodeColor;
      node.color = color;
      return false as any;
    })
    .nodeThreeObjectExtend(true)
    .onNodeHover((node: any, prev: any) => {
      if (node) {
        const graphNode = context.data.nodes.find((n) => n.id === node.id);
        context.onHover(graphNode);
      }
      if (prev) {
        context.onHover(undefined);
      }
    })
    .cooldownTicks(100);
}
