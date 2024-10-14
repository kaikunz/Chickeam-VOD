# Chickeam-VOD Demo

สิ่งที่จำเป็นสำหรับการรัน (Requirement)
- Node.js with Next.JS
- PostgreSQL (Local)

## STEP 1 : Settings your database ตั้งค่าฐานข้อมูล
- เมื่อคุณ Clone และมี PostgreSQL บนเครื่องของคุณแล้ว คุณต้องตั้งค่าการเข้าถึงของ PostgreSQL ในไฟล์ `.env` เพื่อให้ Prisma สามารถ Migrate Model ของคุณได้
```
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=<your postgres port>
POSTGRES_USER=<your username>
POSTGRES_PASSWORD=<your password>
POSTGRES_DB=<db name>
```

หลังจากนั้น
