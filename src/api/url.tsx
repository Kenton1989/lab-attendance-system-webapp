export function getUrl(name: string, version: string = "v1"): string {
  if (!name.startsWith("/")) {
    name = "/" + name;
  }
  if (!name.endsWith("/")) {
    name = name + "/";
  }

  return `/api/${version}${name}`;
}
