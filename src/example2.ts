
import { Renderer } from "./lib/renderer";

/*
  This example uses reactive mode to update the style of the second child after 3 seconds.
*/

export function example2()
{

  const rendy = new Renderer('example2');

  const reactiveSchema = rendy.watch({
    tag: 'div',
    props: {
      class: 'class1',
      id: 'wrapper'
    },
    children: [
      {
        tag: 'h1',
        text: 'Example 2',
        props: {
          class: 'bg-red'
        }
      },
      {
        tag: 'p',
        text: 'This texts padding will be updated magically after 3 seconds.',
        props: {
          class: 'bg-blue'
        }
      }
    ]
  });


  setTimeout(() => {

    reactiveSchema.children![1].props['style'] = 'padding: 3em';

  }, 3000);

}
