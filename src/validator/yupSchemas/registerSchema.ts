import * as yup from "yup";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username is too short!")
    .max(32, "Username can be a maximum of 32 characters!")
    .required("Username required!"),
  firstName: yup
    .string()
    .min(1, "First name is too short!")
    .max(32, "First name can be a maximum of 32 characters!")
    .required("First name required!"),
  lastName: yup
    .string()
    .min(1, "Last name is too short!")
    .max(32, "Last name can be a maximum of 32 characters!")
    .required("Last name required!"),
  email: yup.string().email("Invalid format for email!").required("Email required!"),
  password: yup
    .string()
    .min(6, "Password must be minimum 6 characters!")
    .max(64, "Password can be a maximum of 64 characters!")
    .required("Password required!"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match!")
    .required("Password confirmation required!"),
});

export default registerSchema;
