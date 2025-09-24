import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const storeObjects = await prisma.storeObject.findMany()
  return NextResponse.json(storeObjects)
}
