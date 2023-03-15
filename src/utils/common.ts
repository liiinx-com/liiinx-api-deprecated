// export { default as deepMerge } from "deepmerge";
export const isSubsetOf = (superset: string[], subset: string[]) =>
  subset.every((item) => superset.includes(item));
