import crypto from "crypto-js";

export const encrypt = (text: string) => {
  const result = crypto.AES.encrypt(text, process.env.SECURE_SECRET!);
  return result.toString();
};

export const decrypt = (text: string) => {
  const result = crypto.AES.decrypt(text, process.env.SECURE_SECRET!);
  return result.toString(crypto.enc.Utf8);
};
