import * as yup from "yup";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username too short!")
    .max(32, "Username maximum 32 characters!")
    .required("Username required!"),
  firstName: yup
    .string()
    .min(1, "First name too short!")
    .max(32, "First name maximum 32 characters!")
    .required("First name required!"),
  lastName: yup
    .string()
    .min(1, "Last name too short!")
    .max(32, "Last name maximum 32 characters!")
    .required("Required"),
  email: yup.string().email("Invalid email!").required("Last name required!"),
  password: yup
    .string()
    .min(6, "Password must be minimum 6 characters!")
    .max(64, "Password maximum 64 characters!")
    .required("Password required!"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match!")
    .required("Password confirmation required!"),
});

export default registerSchema;
