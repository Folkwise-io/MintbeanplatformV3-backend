import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(2, "Too Short!").max(64, "Too Long!").required("Required"),
});

export default loginSchema;
