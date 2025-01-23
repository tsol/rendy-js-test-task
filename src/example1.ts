
import { Renderer } from "./lib/renderer";
import { SchemaItem } from "./lib/types";

/*
  This example renders text and in two seconds updates the text of the first child.
  Only text inside h1 changes.
*/

export function example1()
{
  const rendy = new Renderer('example1');

  const schema: SchemaItem = {
    tag: 'div',
    props: {
      class: 'class1',
      id: 'wrapper'
    },
    children: [
      {
        tag: 'h1',
        text: 'Hello, World!',
        props: {
          class: 'bg-red'
        }
      },
      {
        tag: 'p',
        text: 'This is a simple test of a handcrafted reactive framework.',
        props: {
          class: 'bg-blue'
        }
      }
    ]
  };

  rendy.update(schema);

  setTimeout(() => {
    schema.children![0].text = 'Schema updated!';
    rendy.update(schema);
  }, 2000);

}
