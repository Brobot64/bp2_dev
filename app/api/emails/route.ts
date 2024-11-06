

import * as emailTemplateService from '@/src/backends/service/emailService'
import { responseHandler } from '@/src/backends/utils/responseHandler';

export const POST = async (request: Request) => {
    try {
        const { title, content } = await request.json();
        const template = await emailTemplateService.createEmailTemplate(title, content);
        return responseHandler(template, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 200);
    }
}


export const GET = async (request: Request) => {
    try {
        const template = await emailTemplateService.getAllEmailTemplates()
        return responseHandler(template, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 200);
    }
}