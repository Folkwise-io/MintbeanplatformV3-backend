import * as yup from "yup";

export const createKanbanCanonInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required("Required"),
  description: yup.string().min(3, "Too Short!").max(150, "Too Long!").required("Required"),
});

export const editKanbanCanonInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!"),
  description: yup.string().min(3, "Too Short!").max(150, "Too Long!"),
});
