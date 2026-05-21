import "server-only";

import { requireDirectusServerUrl } from "@/lib/directus/env-urls";
import {
  createDirectus,
  readItem,
  readItems,
  rest,
  staticToken,
  withOptions,
} from "@directus/sdk";
import type { RestClient } from "@directus/sdk";

export type DirectusItemsOptions = {
  query?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

let directusClient: RestClient<unknown> | null = null;

function getDirectusClient(): RestClient<unknown> {
  if (directusClient) return directusClient;

  const normalized = requireDirectusServerUrl();
  let client = createDirectus(normalized).with(rest());

  const token = process.env.DIRECTUS_TOKEN;
  if (token) {
    client = client.with(staticToken(token));
  }

  directusClient = client;
  return directusClient;
}

function mergeFetchInit(
  init: RequestInit,
  options: Pick<DirectusItemsOptions, "next" | "cache">,
): RequestInit & { next?: NextFetchRequestConfig } {
  const { next, cache } = options;
  const merged: RequestInit & { next?: NextFetchRequestConfig } = { ...init };

  if (next !== undefined) {
    merged.next = next;
  }
  if (cache !== undefined) {
    merged.cache = cache;
  } else if (next === undefined) {
    merged.cache = "no-store";
  }

  return merged;
}

export async function directusItems<T>(
  collection: string,
  options: DirectusItemsOptions = {},
): Promise<T[]> {
  const { query = {}, next, cache } = options;
  const client = getDirectusClient();

  const command = readItems(collection as never, query as never);

  return client.request(
    withOptions(command, (init) => mergeFetchInit(init, { next, cache })),
  ) as Promise<T[]>;
}

export async function directusItem<T>(
  collection: string,
  id: string | number,
  options: DirectusItemsOptions = {},
): Promise<T> {
  const { query = {}, next, cache } = options;
  const client = getDirectusClient();

  const command = readItem(collection as never, id, query as never);

  return client.request(
    withOptions(command, (init) => mergeFetchInit(init, { next, cache })),
  ) as Promise<T>;
}
