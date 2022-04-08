import "aframe";
import "@ar-js-org/ar.js";
import ForceGraph from "3d-force-graph-ar";
import { RenderContext } from "../classes/context.js";

export function renderAR(context: RenderContext) {
  const graph = ForceGraph();
  const style = getComputedStyle(context.element);
  //   const lineColor = style.getPropertyValue("--graph-line-color").trim();
  //   const bgColor = style.getPropertyValue("--graph-background-color").trim();
  graph(context.element)
    .graphData(context.data)
    .width(Number(style.width.slice(0, -2)))
    .height(Number(style.height.slice(0, -2)))
    .cooldownTicks(100);
}
