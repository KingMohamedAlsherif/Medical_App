import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

/**
 * Initialize a Plato TRPC client.
 * @param apiKey - API key for authentication.
 * @param opts - Client options including base URL.
 */
export const initPlatoClient = (apiKey: string, opts: { url: string }) => {
  return createTRPCClient<any>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: opts.url,
        async fetch(input, init) {
          const res = await fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });

          // ✅ Add this safeguard to detect HTML responses (like 404/redirects)
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("text/html")) {
            const text = await res.text();
            console.error("Received HTML instead of JSON:", text.slice(0, 200));
            throw new Error(
              `Invalid response from TRPC endpoint (${opts.url}) — got HTML instead of JSON.`
            );
          }

          return res;
        },
      }),
    ],
  });
};

export const platoTrpc = initPlatoClient(process.env.PLATO_API_KEY!, {
  url: process.env.PLATO_API_URL!,
});
