type TagKey = keyof HTMLElementTagNameMap;

export type SchemaItem = {
  tag: TagKey;
  text?: string;
  props: {
    [key: string]: string;
  };
  children?: SchemaItem[];
}
