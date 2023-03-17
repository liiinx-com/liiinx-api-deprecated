const merge = require("deepmerge");

export const deepMergeAll = (items: any[], options?: any) => {
  return merge.all(
    items.map((i) => (i ? i : {})),
    options,
  );
};

export const isSubsetOf = (superset: string[], subset: string[]) =>
  subset.every((item) => superset.includes(item));
