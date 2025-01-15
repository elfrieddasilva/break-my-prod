import { NextResponse} from "next/server";

export abstract class BaseController {
 
  protected abstract executeImpl (req: Request): Promise<void | any>;

  public async execute (req: Request): Promise<void> {
    try {
      await this.executeImpl(req);
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      this.fail('An unexpected error occurred')
    }
  }

  public static jsonResponse (code: number, message: string) {
    return new NextResponse(message, {status: code});
  }

  public ok<T> (dto?: T) {
    if (!!dto) {
        return new NextResponse(JSON.parse(dto as any), {
        status: 200
        })
    } else {
      return new NextResponse("Ok", {status: 200});
    }
  }

  public created () {
    return new NextResponse("created", {status: 201});
  }

  public clientError ( message?: string) {
    return BaseController.jsonResponse(400, message ? message : 'Unauthorized');
  }

  public unauthorized ( message?: string) {
    return BaseController.jsonResponse(401, message ? message : 'Unauthorized');
  }

  public forbidden ( message?: string) {
    return BaseController.jsonResponse(403, message ? message : 'Forbidden');
  }

  public notFound ( message?: string) {
    return BaseController.jsonResponse(404, message ? message : 'Not found');
  }

  public conflict ( message?: string) {
    return BaseController.jsonResponse(409, message ? message : 'Conflict');
  }

  public tooMany ( message?: string) {
    return BaseController.jsonResponse(429, message ? message : 'Too many requests');
  }


  public fail ( error: Error | string) {
    console.error(error);
    return new NextResponse(error.toString(), {status: 500});
  }
}