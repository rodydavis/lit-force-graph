import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { Renderer } from "./classes/context";
import { GraphData, GraphNode } from "./classes/graph";
import { render as render2D } from "./modes/mode-2d";
import { render as render3D } from "./modes/mode-3d";

export const tagName = "lit-force-graph";

@customElement(tagName)
export class LitForceGraph extends LitElement {
  static styles = css`
    :host {
      background-color: var(--graph-background-color, #000011);
      color: var(--graph-foreground-color, #ffffff);
      width: var(--graph-width, 100%);
      height: var(--graph-height, 100vh);
    }

    #graph {
      width: 100%;
      height: 100%;
      width: var(--graph-width, 100%);
      height: var(--graph-height, 100vh);
    }

    #controls {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100 !important;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    #controls div {
      padding: 5px;
    }

    #info {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 100 !important;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    #tooltips {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
      justify-content: center;
    }

    .node-tooltip {
      background-color: var(--graph-foreground-color, #ffffff);
      color: var(--graph-background-color, #000011);
      border-radius: 5px;
      font-size: 12px;
      padding: 5px;
      opacity: 0.67;
    }

    #graph-description {
      opacity: 0.67;
    }

    .scene-tooltip {
      color: var(--graph-foreground-color, #ffffff);
      background-color: transparent;
      display: none;
    }
  `;

  @query("#graph") graph!: HTMLElement;
  @property() src = "";
  @property() mode = "2D";
  @property({ type: Object }) data?: GraphData;
  @state() hovered?: GraphNode;

  renderers = new Map<string, Renderer>([
    ["2D", render2D],
    ["3D", render3D],
  ]);

  render() {
    return html` <main
      accept="application/json"
      @drop="${this.onDrop}"
      @dragover="${(e: Event) => e.preventDefault()}"
    >
      <div id="graph"></div>
      <div id="controls">
        <div>
          <label for="render-mode">Render mode</label>
          <select id="render-mode" @change=${this.onChangeMode}>
            ${Array.from(this.renderers.keys()).map((mode) => {
              return html` <option value="${mode}">${mode}</option> `;
            })}
          </select>
        </div>
      </div>
      <div id="info">
        <h2 id="graph-name">${this.data?.name}</h2>
        <div id="graph-description">${this?.data?.description}</div>
      </div>
      <div id="tooltips">
        ${this.hovered
          ? html` <div class="node-tooltip">
              ${this.hovered?.name ?? this.hovered?.id}
            </div>`
          : html``}
      </div>
    </main>`;
  }

  async firstUpdated() {
    await this.refresh();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.addEventListener("change", () => {
      this.refresh();
    });
  }

  /**
   * Set the graph data and update the renderer
   *
   * @param data Graph JSON
   */
  setData(data: GraphData) {
    this.data = data;
    const renderer = this.renderers.get(this.mode);
    renderer?.({
      element: this.graph,
      data,
      onHover: (node) => (this.hovered = node),
    });
  }

  private async refresh() {
    // Get json from script tag
    const children = Array.from(this.children);
    const elem = children.find((child) => child.tagName === "SCRIPT");
    if (elem) {
      // Render from script tag contents
      if (elem.textContent) {
        const data = JSON.parse(elem.textContent);
        if (data) this.setData(data);
        // Render from script tag src
      } else if (elem.hasAttribute("src")) {
        const url = elem.getAttribute("src")!;
        const data = await fetch(url).then((res) => res.json());
        if (data) this.setData(data);
      }
    } else if (this.src.length > 0) {
      // Render from src attribute
      const data = await fetch(this.src).then((res) => res.json());
      if (data) this.setData(data);
    }
  }

  private onChangeMode(e: Event) {
    const mode = (e.target as HTMLSelectElement).value;
    this.mode = mode;
    if (!this.data) return;
    this.setData({ ...this.data! });
  }

  private onDrop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const json = JSON.parse(reader.result as string);
        this.data = json;
        this.setData(json);
      };
      reader.readAsText(file);
    }
    return false;
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ): void {
    if (name === "src" && value) {
      this.refresh();
    }
    if (name === "data" && value) {
      this.setData(JSON.parse(value));
    }
    if (name === "mode" && value) {
      this.mode = value;
      if (this.data) {
        this.setData({ ...this.data! });
      }
    }
    super.attributeChangedCallback(name, _old, value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-force-graph": LitForceGraph;
  }
}
