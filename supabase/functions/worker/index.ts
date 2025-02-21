import { EdgeWorker } from "@pgflow/edge-worker";
import { delay } from "@std/async";
import postgres from "postgres";

const EDGE_WORKER_DB_URL = Deno.env.get("EDGE_WORKER_DB_URL")!;
const sql = postgres(EDGE_WORKER_DB_URL, { prepare: false });

const serviceRoleClient = createClient({});

async function handler(message: { i: number }) {
  await delay(50);
  const seqValue = await sql`SELECT nextval('test_seq')`;

  console.log("Handler invoked", { message, seqValue });
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
