import { deleteEmail, getEmailById, updateEmail } from '@/src/backends/service/emailService';
import { responseHandler } from '@/src/backends/utils/responseHandler';

export const GET = async (
    request: Request,
    { params }: { params: { id: string } },
  ) => {
    try {
        const template = await getEmailById(Number(params.id));
        return responseHandler(template, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 400);        
    }
  }

export const PUT = async (
    request: Request,
    { params }: { params: { id: string } },
) => {
    try {
        const { title, content } = await request.json();
        const response = await updateEmail(Number(params.id), {title, content});
        return responseHandler(response, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 400);
    }
};


export const DELETE = async (
    request: Request,
    { params }: { params: { id: string } },
) => {
    try {
        const response = await deleteEmail(Number(params.id));
        return responseHandler(response, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 400);
    }
};