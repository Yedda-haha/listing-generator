export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { url, headers: reqHeaders, body: reqBody } = body;

      if (!url) {
        return new Response(JSON.stringify({ error: "Missing url" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const resp = await fetch(url, {
        method: "POST",
        headers: reqHeaders || { "Content-Type": "application/json" },
        body: typeof reqBody === "string" ? reqBody : JSON.stringify(reqBody),
      });

      const data = await resp.text();

      return new Response(data, {
        status: resp.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
