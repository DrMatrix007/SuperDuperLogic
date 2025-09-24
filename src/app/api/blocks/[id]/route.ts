import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/store-objects/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const storeObject = await prisma.storeObject.findUnique({
    where: { id },
  })

  if (!storeObject) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(storeObject)
}
