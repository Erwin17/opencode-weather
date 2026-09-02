import { afterEach } from "bun:test";

type Handler = (url: string) => object | Promise<object>;

export function mockFetch(handler: Handler): void {
  const fake = (async (input: unknown) => {
    const url = String(input);
    const body = await handler(url);
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch;
  globalThis.fetch = fake;
}

export function mockFetchError(status: number): void {
  globalThis.fetch = (async () => {
    return new Response("error", { status });
  }) as unknown as typeof fetch;
}

afterEach(() => {
  delete (globalThis as { fetch?: unknown }).fetch;
});
