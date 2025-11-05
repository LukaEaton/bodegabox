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
      let errorMessage = "Request failed";
      try {
        const data = await response.json();
        if (data?.error) errorMessage = data.error;
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }
      const err = new Error(errorMessage);
      (err as any).status = response.status;
      throw err;
    }

    return response.json();
  }
};

export default RequestService;