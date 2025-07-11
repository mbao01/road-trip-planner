export const isTempId = (id?: string) => {
  return Boolean(id?.startsWith("::TEMP::-"));
};
