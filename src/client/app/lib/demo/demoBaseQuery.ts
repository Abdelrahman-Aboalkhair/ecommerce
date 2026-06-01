import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { resolveDemoRequest } from "./handlers/resolve";

type DemoBaseQueryArgs = string | { url: string; method?: string; body?: unknown; params?: Record<string, string> };

export const demoBaseQuery: BaseQueryFn<
  DemoBaseQueryArgs,
  unknown,
  { status: number; data?: unknown }
> = async (args) => {
  const normalized =
    typeof args === "string"
      ? { url: args, method: "GET" as const }
      : {
          url: args.url,
          method: args.method ?? "GET",
          body: args.body,
          params: args.params,
        };

  let url = normalized.url;
  if (normalized.params && Object.keys(normalized.params).length > 0) {
    const qs = new URLSearchParams(
      normalized.params as Record<string, string>
    ).toString();
    url = `${url}${url.includes("?") ? "&" : "?"}${qs}`;
  }

  await new Promise((r) => setTimeout(r, 80));

  const result = resolveDemoRequest({
    url,
    method: normalized.method,
    body: normalized.body,
  });

  if (result.error) {
    return result.error as { status: number; data?: unknown };
  }

  return { data: result.data };
};
