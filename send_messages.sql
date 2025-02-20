SELECT
    pgmq.send_batch(
        queue_name => 'tasks',
        msgs => array_agg(
            jsonb_build_object('i', i)
        )
    )
FROM generate_series(1, 500000) AS i;
