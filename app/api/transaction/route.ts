import { getServerSession } from "next-auth";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";
import { error } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {email: session.user?.email||""},
    })

    if(!user){
        return NextResponse.json({message: "User not found"}, {
            status: 404
        });
    }

    const body = await req.json();
    const { amount, category, description, vendor, method, originalInput } = body;

    if(amount<=0){
        return NextResponse.json({error: "Amount must be positive"}, {
            status: 400
        });
    }

    try {
        const transaction = await prisma.transaction.create({
            data: {
            userId: user.id,
            amount,
            category,
            description,
            vendor,
            method,
            originalInput,
            },
        });

        return NextResponse.json({ message: "Transaction added", transaction }, {status: 201});
    } catch (error) {
        console.error("Failed to add transaction:", error);
            return NextResponse.json({ error: "Error adding transaction" }, { status: 500 });
        }
}