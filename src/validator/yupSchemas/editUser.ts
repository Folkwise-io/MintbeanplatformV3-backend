import * as yup from "yup";

const editUserSchema = yup.object().shape({
  firstName: yup.string().min(1, "First name is too short!").max(32, "First name can be a maximum of 32 characters!"),
  lastName: yup.string().min(1, "Last name is too short!").max(32, "Last name can be a maximum of 32 characters!"),
});

export default editUserSchema;
