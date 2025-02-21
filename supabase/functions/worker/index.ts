import { EdgeWorker } from "@pgflow/edge-worker";
import { delay } from "@std/async";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const EDGE_WORKER_DB_URL = Deno.env.get("EDGE_WORKER_DB_URL")!;
const sql = postgres(EDGE_WORKER_DB_URL, { prepare: false });

// const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// const serviceRoleClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type Payload = {
  i: number;
  initial: number;
};

async function sendNextMessage(message: Payload) {
  return await sql`
    SELECT *
    FROM pgmq.send(
      queue_name => 'tasks',
      msg => jsonb_build_object(
        'i', ${message.i}::bigint + 1,
        'initial', ${message.initial}::bigint
      )
    )
  `;
}

async function handler(message: Payload) {
  await delay(50);

  console.log("Handler invoked", {
    message,
    result: await sendNextMessage(message),
  });
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
