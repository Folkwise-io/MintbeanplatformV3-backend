import * as yup from "yup";

export const editKanbanCanonCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!"),
  body: yup.string().min(3, "Too Short!"),
});
