type SuccessState = { success: true; message?: string };

export const isSuccessState = <T>(state: T | SuccessState): state is SuccessState => {
  const successState = state as SuccessState;

  return Boolean(successState && successState.success);
};
