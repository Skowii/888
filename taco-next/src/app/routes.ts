export type RouteName =
  | "command"
  | "desk"
  | "jobs"
  | "chat"
  | "workforce"
  | "factory"
  | "projects"
  | "visual"
  | "capabilities"
  | "migration"
  | "settings";

export type Route = {
  name: RouteName;
  id?: string;
};

const NAMES: RouteName[] = [
  "command",
  "desk",
  "jobs",
  "chat",
  "workforce",
  "factory",
  "projects",
  "visual",
  "capabilities",
  "migration",
  "settings",
];

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, "").replace(/^\//, "");
  const [head, ...rest] = path.split("/").filter(Boolean);
  const name = (NAMES.includes(head as RouteName) ? head : "command") as RouteName;
  const id = rest.length ? decodeURIComponent(rest.join("/")) : undefined;
  return { name, id };
}

export function hrefFor(name: RouteName, id?: string): string {
  if (!id) return `#/${name}`;
  return `#/${name}/${encodeURIComponent(id)}`;
}
