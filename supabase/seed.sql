-- CREATE SEQUENCE IF NOT EXISTS test_seq;
--
SELECT * FROM pgmq.create('tasks');
SELECT
    pgmq.send_batch(
        queue_name => 'tasks',
        msgs => array_agg(
            jsonb_build_object(
                'i', i,
                'initial', i
            )
        )
    )
FROM generate_series(1, 1) AS i;
