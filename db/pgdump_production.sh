#!/bin/bash
mkdir -p backups
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
ssh MintbeanProduction "sudo -u postgres pg_dumpall --column-inserts" > backups/backup.production.$current_time.sql
echo "backups/backup.production.$current_time.sql"
