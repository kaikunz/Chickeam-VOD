#!/bin/sh

npx prisma migrate dev --name init

npm run xlsx_import

exec "$@"