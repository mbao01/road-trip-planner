type ErrorState = { success: false; errors: string[]; message?: string };

export const isErrorState = <T>(state: T | ErrorState): state is ErrorState => {
  const errorState = state as ErrorState;

  return Boolean(errorState && errorState.errors && !errorState.success);
};
