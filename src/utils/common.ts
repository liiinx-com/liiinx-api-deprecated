const merge = require("deepmerge");
const render = require("json-templater/string");

export const deepMergeAll = (items: any[], options?: any) => {
  return merge.all(
    items.map((i) => (i ? i : {})),
    options,
  );
};

export const isSubsetOf = (superset: string[], subset: string[]) =>
  subset.every((item) => superset.includes(item));

export const fillTheGaps = (content: string, value: object): string => {
  return render(content, value);
};
