export function getUrl(name: string, version: string = "v1"): string {
  if (!name.startsWith("/")) {
    name = "/" + name;
  }

  if (name.endsWith("/")) {
    name = name.substring(0, name.length - 1);
  }

  return `/api/${version}${name}`;
}
