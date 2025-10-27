export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface FetchOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}