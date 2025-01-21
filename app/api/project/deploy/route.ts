import { checkProjectController } from "@/core/project/modules/check-project/infra";
import { deployProjectController } from "@/core/project/modules/deploy-project/infra";
//import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await checkProjectController.execute(req);
        await deployProjectController.execute(req);
    } catch (error) {
        deployProjectController.fail((error as Error));
    }
}