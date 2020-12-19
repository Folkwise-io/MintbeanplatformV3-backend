import * as yup from "yup";

export const sendContactFormEmailInputSchema = yup.object().shape({
  subject: yup.string().min(1, "Email subject text required").required("Email subject required"),
  html: yup.string().min(1, "Email body html required").required("Email html equired"),
});
