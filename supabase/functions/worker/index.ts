import { EdgeWorker } from "jsr:@pgflow/edge-worker@0.0.3";
import { delay } from "jsr:@std/async";
import postgres from "npm:postgres@3.4.5";

const EDGE_WORKER_DB_URL = Deno.env.get("EDGE_WORKER_DB_URL")!;
const sql = postgres(EDGE_WORKER_DB_URL, { prepare: false });

async function handler(message: { i: number }) {
  await delay(50);

  console.log("Handler invoked", { message, dbTime: await sql`SELECT now()` });
}

EdgeWorker.start(handler, {
  maxConcurrent: 10,
  maxPgConnections: 4,
});

/* To start the worker:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/worker' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
