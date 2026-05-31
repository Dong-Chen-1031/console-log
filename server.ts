const port = Number(process.env.PORT ?? 3000);
const indexFile = Bun.file(`${import.meta.dir}/public/index.html`);

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/") {
      return new Response(indexFile, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    if (req.method === "POST" && url.pathname === "/log") {
      try {
        const body = await req.json();
        const message = typeof body?.message === "string" ? body.message.trim() : "";

        if (!message) {
          return Response.json({ error: "message is required" }, { status: 400 });
        }

        console.log(message);
        return Response.json({ ok: true });
      } catch {
        return Response.json({ error: "invalid JSON body" }, { status: 400 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
});

console.log(`Server is running on http://localhost:${server.port}`);
