import * as yup from "yup";

export const createKanbanCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required("Required"),
  body: yup.string().min(3, "Too Short!").required("Required"),
  // TODO: check for index
});

export const editKanbanCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!"),
  body: yup.string().min(3, "Too Short!"),
  // TODO: check for index
});
