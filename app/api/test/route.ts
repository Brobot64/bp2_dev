import { responseHandler } from "@/src/backends/utils/responseHandler";


export const GET = async (request: Request) => {
    try {
        const message = 'Hello To the World';
        return responseHandler({msg: message}, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 400);        
    }
}