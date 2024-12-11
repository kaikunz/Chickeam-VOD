#!/bin/sh

npx prisma migrate dev

npm run xlsx_import

exec "$@"