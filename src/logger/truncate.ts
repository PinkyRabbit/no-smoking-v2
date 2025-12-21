import winston from "winston";

type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined;

type SerializableValue =
  | Primitive
  | SerializableObject
  | SerializableValue[]
  | string;

interface SerializableObject {
  [key: string]: SerializableValue;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function truncateObject(
  value: unknown,
  maxDepth = 2,
  maxKeys = 50
): SerializableValue {
  const seen = new WeakSet<object>();

  function helper(v: unknown, depth: number): SerializableValue {
    if (isPrimitive(v)) return v;

    if (typeof v === "bigint") return `${v.toString()}n`;
    if (typeof v === "function")
      return `[Function${v.name ? `: ${v.name}` : ""}]`;
    if (typeof v === "symbol") return v.toString();

    if (v instanceof Date) return v.toISOString();
    if (v instanceof Error)
      return { name: v.name, message: v.message, stack: v.stack };

    if (Array.isArray(v)) {
      if (depth >= maxDepth) return `[Array(${v.length})]`;
      return v.slice(0, maxKeys).map((x) => helper(x, depth + 1));
    }

    if (isRecord(v)) {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);

      if (depth >= maxDepth) return "[Object]";

      const out: SerializableObject = {};
      const keys = Object.keys(v).slice(0, maxKeys);

      for (const key of keys) {
        out[key] = helper(v[key], depth + 1);
      }

      const hidden = Object.keys(v).length - keys.length;
      if (hidden > 0) out.__truncated_keys__ = hidden;

      return out;
    }

    return String(v);
  }

  return helper(value, 0);
}

export const truncateFormat = winston.format((info) => {
  if (typeof info.message !== "string") {
    info.message = truncateObject(info.message, 2);
  }

  for (const [k, v] of Object.entries(info)) {
    if (k === "level" || k === "message" || k === "timestamp") continue;
    info[k] = truncateObject(v, 2);
  }

  return info;
});
