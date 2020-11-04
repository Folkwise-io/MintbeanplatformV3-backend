import * as yup from "yup";

export const createKanbanCanonCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required(),
  body: yup.string().min(3, "Too Short!").required(),
});

export const editKanbanCanonCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!"),
  body: yup.string().min(3, "Too Short!"),
});
