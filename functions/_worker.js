import { handleRequest } from './.next/server/app/page.js';

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, { env, ctx });
  },
};
