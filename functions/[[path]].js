// Cloudflare Pages Functions entrypoint
// This wraps the Next.js standalone build for Cloudflare Workers

import { createRequestHandler } from './.next/server/app/page.js';

export default {
  async fetch(request, env, ctx) {
    // Set up D1 and R2 bindings from environment
    globalThis.process = { env: { ...env, NODE_ENV: 'production' } };
    
    try {
      return await createRequestHandler(request);
    } catch (e) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
