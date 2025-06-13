import { getServerSession } from "next-auth";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

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
    const { name, targetAmount, currentAmount, deadline } = body;

    if(targetAmount<=0||currentAmount<=0){
        return NextResponse.json({error: "Amount must be positive"}, {
            status: 400
        });
    }

    try {
        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                name,
                currentAmount,
                targetAmount,
                deadline
            },
        });

        return NextResponse.json({ message: "Goal added", goal }, {status: 201});
    } catch (error) {
        console.error("Failed to add Goal:", error);
            return NextResponse.json({ error: "Error adding Goal" }, { status: 500 });
        }
}