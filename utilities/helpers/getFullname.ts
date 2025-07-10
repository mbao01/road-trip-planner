export const getFullname = (
  person: Partial<{ firstname: string | null; lastname: string | null }>
) => {
  const { firstname = "", lastname = "" } = person;
  return `${firstname} ${lastname}`.trim();
};
