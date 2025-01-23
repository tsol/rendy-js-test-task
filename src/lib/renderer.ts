import { createElement, makeReactive, recursivelyUpdateIfDiffers } from "./renderer-tools";
import { SchemaItem } from "./types";



export class Renderer {

  private container: HTMLElement;

  constructor(id: string = 'app') {

    const container = document.querySelector<HTMLElement>(`#${id}`);
    if (!container) 
      throw new Error(`Can't mount: container not found (id = ${id})`);
    
    this.container = container;
  }

  /**
   * Forces rendering of the schema to the container.   
   */
  render(schema: SchemaItem) {
    const element = createElement(schema);
    const firstChild = this.container.firstChild;

    if (firstChild) {
      firstChild.replaceWith(element);
    } else {
      this.container.appendChild(element);
    }  
  }

  /**
   * Updates the container with the new schema. Only updates the differences.
   */
  update(schema: SchemaItem) {
    const firstChild = this.container.firstChild as HTMLElement;

    if (!firstChild) {
      this.render(schema);
      return;
    }

    recursivelyUpdateIfDiffers(firstChild, schema);
  }

  /**
   * Creates a reactive version of the schema that updates the container when changed.
   */
  watch(schema: SchemaItem) {

    this.update(schema);
    
    const reactiveSchema = makeReactive(schema, () => {
      this.update(reactiveSchema);
    });

    return reactiveSchema;
  }

}
