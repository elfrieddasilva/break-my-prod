import { deployProjectController } from "@/core/deployment/modules/deploy-project/infra";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await deployProjectController.execute(req);
}