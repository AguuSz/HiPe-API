# FASTAPI

Little project made following this [tutorial](https://youtu.be/2Y3A4deNs9A?si=pqqMvB_pSEO3bE2B). It's a simple API that returns a list of countries based on a user search.

Made with the following technologies:

- Hono
- Redis
- Next.js
- Cloudflare workers
- Upstash

> It's called **fast** because how the way that the data is fetched and returned to the user. It's a simple project that uses redis to fetch data quickly, but also is deployed in Cloudflare workers, that allow you to have it deployed in several locations, improving latency.

## How to make it work

1. Clone the repository
2. Install dependencies with your prefered package manager (in my case, i used **pnpm**).
3. Rename `env.example` to `.env` and fill the variables with your own values.
   - This values are obtained once you create an account in Upstash.
4. Rename `wrangler.toml.example` to `wrangler.toml` and fill the variables with your own values.
   - This values are the exact same as in the `.env` file.
5. Create the following file `/src/lib/constants.ts` and fill it with the following content:

```typescript
export const baseUrl = "";
```

6. Populate the DB using the script in `/src/lib/seed.ts`.
7. Deploy the project with `pnpm run deploy`. (It's using a script present in the `package.json` file).
8. Copy the URL provided and paste it in the `baseUrl` variable in the `constants.ts` file.
9. Run the project with `pnpm run dev`.
10. Open your browser and go to `localhost:3000`.

## Things learned thorughout the project

- Get to know a new technology that looks primising ([Hono](https://hono.dev/)).
- Get to use [redis](https://redis.io/es/) for the first time.
- Get to know how to use [Cloudflare workers](https://workers.cloudflare.com/) and the advantages that it provides.
