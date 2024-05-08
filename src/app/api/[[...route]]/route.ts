import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type EnvConfig = {
	UPSTASH_REDIS_REST_TOKEN: string;
	UPSTASH_REDIS_REST_URL: string;
};
app.use("/*", cors());
app.get("/search", async (c) => {
	try {
		const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
			env<EnvConfig>(c);

		// For measuring performance
		const start = performance.now();

		// -------------

		const redis = new Redis({
			token: UPSTASH_REDIS_REST_TOKEN,
			url: UPSTASH_REDIS_REST_URL,
		});

		// q because http://localhost:3000/api/search?q=hello
		const query = c.req.query("q")?.toUpperCase();

		if (!query) {
			return c.json(
				{
					message: "Invalid search query",
				},
				{ status: 400 }
			);
		}

		const res = [];
		const rank = await redis.zrank("terms", query);

		if (rank !== null && rank !== undefined) {
			// 100 -> arbitrary number
			const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

			for (const element of temp) {
				if (!element.startsWith(query)) {
					break;
				}

				// Result that we want to return
				if (element.endsWith("*")) {
					// Remove the trailing *
					res.push(element.substring(0, element.length - 1));
				}
			}
		}

		// -------------

		const end = performance.now();

		return c.json({
			results: res,
			duration: end - start,
		});
	} catch (err) {
		console.error(err);

		return c.json(
			{
				results: [],
				message: "Something went wrong.",
			},
			{
				status: 500,
			}
		);
	}
});

// Useful for deploying to vercel
export const GET = handle(app);

// For deploying to cloudflare workers
export default app as never;
