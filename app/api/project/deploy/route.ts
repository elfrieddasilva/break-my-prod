import { deployProjectController } from "@/core/project/modules/deploy-project/infra";
//import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await deployProjectController.execute(req);
    } catch (error) {
        deployProjectController.fail((error as Error));
    }
}