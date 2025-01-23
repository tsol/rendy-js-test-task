import { SchemaItem } from "./types";

export function createElement(schema: SchemaItem): HTMLElement {
  const element = document.createElement(schema.tag);

  for (const [key, value] of Object.entries(schema.props)) {
    element.setAttribute(key, value);
  }

  if (schema.text) {
    element.textContent = schema.text;
  }

  if (schema.children) {
    for (const childSchema of schema.children) {
      const childElement = createElement(childSchema);
      element.appendChild(childElement);
    }
  }

  console.log('createElement', element);
  return element;
}


export function recursivelyUpdateIfDiffers(dom: HTMLElement, schema: SchemaItem) {

  if (dom.tagName.toLowerCase() !== schema.tag) {
    dom.replaceWith(createElement(schema));
    return;
  }

  const currentText = Array.from(dom.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE) 
    .map(node => node.nodeValue)
    .join('');

  if (currentText !== (schema.text || '')) {
    dom.textContent = schema.text || ''; // Update text content
  }

  for (const [key, value] of Object.entries(schema.props)) {
    if (dom.getAttribute(key) !== value) {
      dom.setAttribute(key, value);
    }
  }
  
  for (const attr of dom.getAttributeNames()) {
    if (!schema.props[attr]) {
      dom.removeAttribute(attr);
    }
  }

  if (schema.children) {
    if (dom.children.length !== schema.children.length) {
      dom.innerHTML = '';
      for (const childSchema of schema.children) {
        dom.appendChild(createElement(childSchema));
      }
    } else {
      for (let i = 0; i < schema.children.length; i++) {
        recursivelyUpdateIfDiffers(dom.children[i] as HTMLElement, schema.children[i]);
      }
    }
  }


}


export function makeReactive(schema: SchemaItem, callback: () => void): SchemaItem {
  return new Proxy(schema, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "object" && value !== null) {
        return makeReactive(value, callback);
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const oldValue = Reflect.get(target, prop, receiver);
      if (oldValue !== value) {
        const success = Reflect.set(target, prop, value, receiver);
        if (success) {
          callback(); // Trigger the callback when the property changes
        }
        return success;
      }
      return true;
    }
  });
}


