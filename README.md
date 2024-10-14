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

## STEP 2 : ติดตั้ง Package
คุณต้องติดตั้ง Package ทั้งหมดที่จำเป็นสำหรับโปรเจ็คนี้โดยจะอิงจากไฟล์ package.json ด้วยคำสั่งนี้
```
npm install
```

## STEP 3 : Prisma Migrate Model ลงฐานข้อมูล
เมื่อทุกอย่างพร้อมแล้วคุณก็สามารถ Migrate ลงฐานข้อมูลด้วยคำสั่งนี้
```
npx prisma migrate dev --name init
```

## STEP 4 : Run
```
npm run dev
```
