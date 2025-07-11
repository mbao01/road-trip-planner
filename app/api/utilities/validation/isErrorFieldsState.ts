import { validator } from "./validator";

type T = ReturnType<typeof validator>;

export const isErrorFieldsState = (state: T | any): state is T => {
  return state && state.fieldErrors && state.success === false;
};
