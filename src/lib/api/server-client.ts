import { getServerAuthToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

class ServerAPIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const baseURL = this.baseURL.endsWith("/")
      ? this.baseURL
      : `${this.baseURL}/`;
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    const url = new URL(cleanEndpoint, baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const token = await getServerAuthToken();

    const url = this.buildURL(endpoint, params);

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 401) {
        redirect("/logout");
      }

      if (!response.ok) {
        const errorMessage = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(errorMessage || "An error occurred");
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }

      return response.text() as T;
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }

      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      throw new Error(
        `API error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const serverApiClient = new ServerAPIClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
);
