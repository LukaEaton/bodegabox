import { FetchOptions } from "../types";

const RequestService = {
  async apiRequest<TResponse = any, TBody = any>(url: string,options: FetchOptions<TBody> = {}): Promise<TResponse> {
    const { method = "GET", body, headers = {} } = options;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const err = new Error("Request failed");
      (err as any).status = response.status;
      throw err;
    }

    return response.json();
  }
};

export default RequestService;