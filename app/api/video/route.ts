import prisma from "@/prisma/prisma";

export async function GET(req: Request) {
  try {
    const videos = await prisma.video.findMany();
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}