// app/api/transactions/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";


const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || "0", 10); // 0-indexed
  const year = parseInt(searchParams.get("year") || "0", 10);
  const category = searchParams.get("category");

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const filters: any = {
    userId: user.id,
    createdAt: {
      gte: startDate,
      lt: endDate,
    },
  };

  if (category) {
    filters.category = category;
  }

  const transactions = await prisma.transaction.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });

  // Pie chart summary
const categorySummary: Record<string, number> = {};
for (const tx of transactions) {
  const cat = tx.category;
  const amt = Number(tx.amount); // Make sure it's a number
  categorySummary[cat] = (categorySummary[cat] || 0) + amt;
}
const total = Object.values(categorySummary)
  .map(val => Number(val)) // or parseFloat(val)
  .reduce((a, b) => a + b, 0);

  console.log("Total is \n", total);
  
  const pieData = Object.entries(categorySummary).map(([cat, val]: any) => {
  const numVal = Number(val);
  return {
    category: cat,
    percent: total > 0 ? Number(((numVal / total) * 100).toFixed(2)) : 0,
  };
});

  console.log(pieData)

  return NextResponse.json({
    transactions,
    pieData,
  });
}
