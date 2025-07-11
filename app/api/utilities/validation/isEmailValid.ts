const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (email: string): boolean => {
  return emailPattern.test(email);
};
