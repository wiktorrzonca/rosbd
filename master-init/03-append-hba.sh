#!/bin/bash
cat /docker-entrypoint-initdb.d/03-hba.conf.append >> "$PGDATA/pg_hba.conf"