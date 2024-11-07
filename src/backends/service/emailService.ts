// src/services/emailTemplateService.ts
// import EmailTemplate from "../models/emailtemplates";
// import { query } from "../config/db";

// export const getAllEmailTemplates = async () => {
//   return await EmailTemplate.findAll();
// };

// export const getEmailTemplateById = async (id: number) => {
//   return await EmailTemplate.findByPk(id);
// };

// export const createEmailTemplate = async (title: string, content: string) => {
//   return await EmailTemplate.create({ title, content });
// };

// export const updateEmailTemplate = async (id: number, title: string, content: string) => {
//   const emailTemplate = await EmailTemplate.findByPk(id);
//   if (emailTemplate) {
//     emailTemplate.title = title;
//     emailTemplate.content = content;
//     return await emailTemplate.save();
//   }
//   throw new Error('Email template not found');
// };

// export const deleteEmailTemplate = async (id: number) => {
//   const emailTemplate = await EmailTemplate.findByPk(id);
//   if (emailTemplate) {
//     return await emailTemplate.destroy();
//   }
//   throw new Error('Email template not found');
// };

import { query } from "../config/db";

// Function to create the email_templates table if it doesn't exist
const createTableIfNotExist = async () => { 
  await query({
    query: "CREATE TABLE IF NOT EXISTS email_templates (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, content TEXT)",
    values: []
  });
};

// Function to get all email templates
export const getAllEmails = async () => {
  await createTableIfNotExist();
  const emails = await query({
    query: "SELECT * FROM email_templates",
    values: []
  });

  return emails;
};

// Function to add a new email template
export const addEmail = async (data: { title: string; content: string; }) => {
  const { title, content } = data;
  let message = '';
  
  const addedEmail = await query({
    query: "INSERT INTO email_templates (title, content) VALUES (?, ?)",
    // @ts-ignore
    values: [title, content],
  });

  
    // @ts-ignore
  if (addedEmail.insertId) {
    message = 'Success';
  }

    // @ts-ignore
  return { message, id: addedEmail.insertId };
};

// Function to get an email template by ID
export const getEmailById = async (id: number) => {
  const email = await query({
    query: "SELECT * FROM email_templates WHERE id = ?",
    // @ts-ignore
    values: [id],
  });

    // @ts-ignore
  return email.length > 0 ? email[0] : null; // Return the email or null if not found
};

// Function to update an email template by ID
export const updateEmail = async (id: number, data: { title?: string; content?: string; }) => {
  const { title, content } = data;
  const updates = [];
  const values: (string | number)[] = [];

  if (title) {
    updates.push("title = ?");
    values.push(title);
  }

  if (content) {
    updates.push("content = ?");
    values.push(content);
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id); // Add the ID to the end of the values array

  const result = await query({
    query: `UPDATE email_templates SET ${updates.join(", ")} WHERE id = ?`,
    // @ts-ignore
    values: values,
  });

    // @ts-ignore
  return result.affectedRows > 0; // Return true if the update was successful
};

// Function to delete an email template by ID
export const deleteEmail = async (id: number) => {
  const result = await query({
    query: "DELETE FROM email_templates WHERE id = ?",
    // @ts-ignore
    values: [id],
  });

    // @ts-ignore
  return result.affectedRows > 0; // Return true if the deletion was successful
};