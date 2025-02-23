import prisma from "@/prisma/prisma";
import { auth } from "@/auth";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { timeStamp } from "console";

const SECRET_KEY = process.env.JWT_SECRET || "kinmha112";


export async function POST(req: Request) {

  const session = await auth();
  const user = session?.user;
  let userId;

  try {
    const body = await req.json();
    const { slug, edit } = body;

    
    if (!user) {
      userId = "unknown";
    } else {
      userId = user.id;
    }

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Slug is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    
    let video;
    let hasPurchased = false;
    let videoWithPurchase = null;
    let path = "";

    

    const videoTypeCheck = await prisma.video.findFirst({
      where: { slug },
      select: {
        id: true,
        type: true,
      },
    });

    

    if (!videoTypeCheck) {
      return new Response(
        JSON.stringify({ error: "Video not found"}),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    


    const { type } = videoTypeCheck;

    if (type == 1) {

      video = await prisma.video.findFirst({
        where: { slug },
        include: {
          user: {
            select: {
              nickname: true,
              follower: true,
              image: true,
            },
          },
          love_log: {
            where: { userId }, 
            select: { id: true },
          },
        },
      });

      path = video?.path || "";

    } else if (type == 2) {
      
      if (user) {
        const videoWithPurchase = await prisma.video.findFirst({
          where: { slug },
          include: {
            purchase: {
              where: { userId: user.id },
            },
            user: {
              select: {
                nickname: true,
                follower: true,
                image: true,
              },
            },
            love_log: {
              where: { userId: user.id }, 
              select: { id: true },
            },
            
          },
          
        });
        if (videoWithPurchase) {
          if (videoWithPurchase.purchase.length > 0) {
            hasPurchased = true;
            video = videoWithPurchase;
            path = videoWithPurchase.path || "";
          } else {
            video = await prisma.video.findFirst({
              where: { slug },
              select: {
                id: true,
                title: true,
                description:true,
                price_rent: true,
                price_sell: true,
                type:true,
                Love_count:true,
                user: {
                  select: {
                    nickname: true,
                    follower: true,
                    image: true,
                  },
                },
                love_log: {
                  where: { userId: user.id }, 
                  select: { id: true },
                  },

              },
            });
          }
        }
      } else {
        video = await prisma.video.findFirst({
          where: { slug },
          select: {
            id: true,
            title: true,
            description:true,
            price_rent: true,
            price_sell: true,
            type:true,
            Love_count:true,
            user: {
              select: {
                nickname: true,
                follower: true,
                image: true,
              },
            },
            love_log: {
              where: { userId: userId }, 
              select: { id: true },
              },

          },
        });
      }
    } else if (type == 4 && edit === 1) {
      hasPurchased = true;
      video = await prisma.video.findFirst({
        where: { slug },
        select: {
          id: true,
          title: true,
          description:true,
          type:true,
          Love_count:true,
          path:true,
          user: {
            select: {
              nickname: true,
              follower: true,
              image: true,
            },
          },
          love_log: {
            where: { userId: userId }, 
            select: { id: true },
            },

        },
      });


    } else if (type == 5) {
      hasPurchased = true;
      video = await prisma.video.findFirst({
        where: { slug },
        select: {
          id: true,
          title: true,
          description:true,
          type:true,
          Love_count:true,
          path:true,
          user: {
            select: {
              nickname: true,
              follower: true,
              image: true,
            },
          },
          love_log: {
            where: { userId: userId }, 
            select: { id: true },
            },

        },
      });


    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported video type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!video) {
      return new Response(
        JSON.stringify({ error: "Video not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    let jwtdata;

      jwtdata = {
        slug: slug,
        path: path,
        permission: hasPurchased,
        userId: userId
      };
      

    let str = `${Date.now()}~${slug}:${path}`;
    
    const token = jwt.sign({ jwtdata }, SECRET_KEY, { expiresIn: "4h" });
    
    const SEC_LOCK = "#$wel".padEnd(16, " ");
    const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(SEC_LOCK, "utf8"), null);
    let encrypted = cipher.update(str, "utf8", "base64");
    encrypted += cipher.final("base64");

    


    return new Response(
      JSON.stringify({ ...video, hasPurchased, type, hasLoved: video.love_log.length > 0, token:token, key:encrypted }),
      {
        status: 200,
        headers: { "Content-Type": "application/json"},
        
      }
    );
  } catch (error) {
    console.error("Error fetching video by slug:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
