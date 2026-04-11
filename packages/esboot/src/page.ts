export interface SSGPageDefinition {
  enable?: boolean;
  hydrate?: boolean;
  render: () => unknown | Promise<unknown>;
}

export interface PageDefinition {
  title?: string;
  template?: string;
  name?: string;
  ssg?: SSGPageDefinition;
}

export function definePage<T extends PageDefinition>(page: T): T {
  return page;
}
