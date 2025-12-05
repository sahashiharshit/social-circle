export type Errors = {
  email?: string,
  password?: string

}
export type FormState = {
  errors: Errors
}
export type SignupValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};