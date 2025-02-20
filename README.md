# Pool Exhaustion Repro

This is a reproduction of the pool exhaustion problem with **Edge Worker**.

## Local Testing

### Setup

1. Clone the repo
2. Start Supabase `npx supabase@2.12.1 start`
   This will create `test_seq`, `tasks` queue and will send 500k messages
3. Start Edge Runtime `npx supabase@2.12.1 functions serve`
4. Start Edge Worker `curl http://localhost:54321/functions/v1/worker`
   Processing should immediately start

### Observe

Check pooler logs with `docker logs supabase_pooler-pool-exhaustion-repro`

## Cloud Testing

1. Clone the repo
1. Link a remote project `npx supabase@2.12.1 link`
1. Reset remote db `npx supabase@2.12.1 db reset --linked`
1. Set `EDGE_WORKER_DB_URL` env var to URL for db pool in Transaction Mode
1. Deploy worker `npx supabase@2.12.1 functions deploy worker`
1. Start worker 

   - replace `ANON_KEY` with your anon key
   - replace `project_ref` with your project ref
   - replace `eu-west-3` with your db region for best performance

   ```bash
   curl --request POST 'https://<project_ref>.supabase.co/functions/v1/worker' \
     --header 'Authorization: Bearer ANON_KEY' \
     --header 'Content-Type: application/json' \
     --header 'x-region: eu-west-3'
   ```

## Observe

Check logs in dashboard
