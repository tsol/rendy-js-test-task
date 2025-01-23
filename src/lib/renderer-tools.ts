import { SchemaItem } from "./types";

export function createElement(schema: SchemaItem): HTMLElement {
  const element = document.createElement(schema.tag);

  for (const [key, value] of Object.entries(schema.props)) {
    element.setAttribute(key, value);
  }

  if (schema.listeners) {
    for (const [eventType, listener] of Object.entries(schema.listeners)) {
      addEventListener(element, eventType, listener);
    }
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

  const existingListeners = getAttachedListeners(dom);
  for (const eventType in existingListeners) {
    if (!schema.listeners || !schema.listeners[eventType]) {
      removeEventListener(dom, eventType, existingListeners[eventType]);
    }
  }

  if (schema.listeners) {
    for (const [eventType, listener] of Object.entries(schema.listeners)) {
      const existingListener = existingListeners[eventType];
      if (existingListener !== listener) {
        if (existingListener) {
          removeEventListener(dom, eventType, existingListener);
        }
        addEventListener(dom, eventType, listener);
      }
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
          callback(); 
        }
        return success;
      }
      return true;
    }
  });
}



function addEventListener(dom: HTMLElement, type: string, listener: EventListenerOrEventListenerObject) {
  dom.addEventListener(type, listener);
  (dom as any).__listeners = (dom as any).__listeners || {};
  (dom as any).__listeners[type] = listener; 
}

function removeEventListener(dom: HTMLElement, type: string, listener: EventListenerOrEventListenerObject) {
  dom.removeEventListener(type, listener);
  (dom as any).__listeners = (dom as any).__listeners || {};
  (dom as any).__listeners[type] = undefined; 
}

function getAttachedListeners(dom: HTMLElement) {
  return (dom as any).__listeners || {};
}
