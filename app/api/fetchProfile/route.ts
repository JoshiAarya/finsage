import { getServerSession } from "next-auth";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();
  
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: {
        email: true,
        name: true,
        monthlyIncome: true,
      },
    });
  
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  
    return NextResponse.json({data: user}, {status: 200});
  } catch (error) {
    return NextResponse.json({error: "Failed to fetch profile"}, {status: 500});
  }
}
