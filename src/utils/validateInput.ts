import { z } from 'zod';

function url(url: string) {
  const urlSchema = z.string().url();

  console.log(urlSchema.safeParse(url).error);

  return urlSchema.safeParse(url).success;
}

function email(email: string) {
  const emailSchema = z.string().email();

  return emailSchema.safeParse(email).success;
}

export const validateInput = { email, url };
