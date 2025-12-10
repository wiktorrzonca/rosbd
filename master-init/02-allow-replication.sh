#!/bin/bash
echo "Configuring replication..."
echo "wal_level = replica" >> "$PGDATA/postgresql.conf"
echo "max_wal_senders = 10" >> "$PGDATA/postgresql.conf"
echo "wal_keep_size = 1024MB" >> "$PGDATA/postgresql.conf"