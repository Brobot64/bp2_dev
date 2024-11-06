// src/services/emailTemplateService.ts
import EmailTemplate from "../models/emailtemplates";

export const getAllEmailTemplates = async () => {
  return await EmailTemplate.findAll();
};

export const getEmailTemplateById = async (id: number) => {
  return await EmailTemplate.findByPk(id);
};

export const createEmailTemplate = async (title: string, content: string) => {
  return await EmailTemplate.create({ title, content });
};

export const updateEmailTemplate = async (id: number, title: string, content: string) => {
  const emailTemplate = await EmailTemplate.findByPk(id);
  if (emailTemplate) {
    emailTemplate.title = title;
    emailTemplate.content = content;
    return await emailTemplate.save();
  }
  throw new Error('Email template not found');
};

export const deleteEmailTemplate = async (id: number) => {
  const emailTemplate = await EmailTemplate.findByPk(id);
  if (emailTemplate) {
    return await emailTemplate.destroy();
  }
  throw new Error('Email template not found');
};
