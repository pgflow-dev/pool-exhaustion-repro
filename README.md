# Pool Exhaustion Repro

This is a reproduction of the pool exhaustion problem with **Edge Worker**.

## Setup

1. Clone the repo
2. Start Supabase `npx supabase@2.6.8 start`
   This will create `test_seq`, `tasks` queue and will send 500k messages
3. Start Edge Runtime `npx supabase@2.6.8 functions serve`
4. Start Edge Worker `curl http://localhost:54321/functions/v1/worker`
   Processing should immediately start

## Observe

Check pooler logs with `docker logs supabase_pooler-pool-exhaustion-repro`

