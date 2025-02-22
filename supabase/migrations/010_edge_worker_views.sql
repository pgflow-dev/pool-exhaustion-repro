ALTER TABLE edge_worker.workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY anonymous_access ON edge_worker.workers
FOR SELECT TO anon USING (true);

GRANT USAGE ON SCHEMA edge_worker TO anon;
GRANT USAGE ON SCHEMA edge_worker TO authenticated;

-- Active workers are workers that have sent a heartbeat in the last 6 seconds
create or replace view edge_worker.active_workers as
select
    worker_id,
    queue_name,
    function_name,
    started_at,
    stopped_at,
    last_heartbeat_at
from edge_worker.workers
where last_heartbeat_at > now() - make_interval(secs => 7);

GRANT SELECT ON edge_worker.active_workers TO anon;
GRANT SELECT ON edge_worker.active_workers TO authenticated;

-- Inactive workers are workers that have not sent
-- a heartbeat in the last 6 seconds
create or replace view edge_worker.inactive_workers as
select
    worker_id,
    queue_name,
    function_name,
    started_at,
    stopped_at,
    last_heartbeat_at
from edge_worker.workers
where last_heartbeat_at < now() - make_interval(secs => 7);

GRANT SELECT ON edge_worker.inactive_workers TO anon;
GRANT SELECT ON edge_worker.inactive_workers TO authenticated;
