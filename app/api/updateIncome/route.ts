// app/api/user/income/route.ts
import { getServerSession } from "next-auth";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const { monthlyIncome } = await req.json();
    if (monthlyIncome == null || isNaN(monthlyIncome) || monthlyIncome <= 0) {
      return NextResponse.json({ error: "Invalid income value" }, { status: 400 });
    }
  
    const user = await prisma.user.update({
      where: { email: session.user?.email || "" },
      data: { monthlyIncome },
    });
  
    return NextResponse.json({ message: "Income updated", data: user }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong"}, {status: 500});
  }
}
