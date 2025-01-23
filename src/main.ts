import { example1 } from "./example1";
import { example2 } from "./example2";
import { Renderer } from "./lib/renderer";

(new Renderer('control')).render({
  tag: 'div',
  props: {},
  children: [
    {
      tag: 'button',
      text: 'Example 1',
      listeners: {
        click: example1
      }
    },
    {
      tag: 'button',
      text: 'Example 2',
      listeners: {
        click: example2
      }
    }
  ]
})

