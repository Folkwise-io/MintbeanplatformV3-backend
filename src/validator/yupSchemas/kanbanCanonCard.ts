import * as yup from "yup";
import { KanbanCanonCardStatusEnum } from "../../types/gqlGeneratedTypes";

export const createKanbanCanonCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required(),
  body: yup.string().min(3, "Too Short!").required(),
  // below are optional
  status: yup.mixed<KanbanCanonCardStatusEnum>().oneOf(Object.values(KanbanCanonCardStatusEnum)),
  index: yup.number(),
});

export const editKanbanCanonCardInputSchema = yup.object().shape({
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!"),
  body: yup.string().min(3, "Too Short!"),
  // below are optional
  status: yup.mixed<KanbanCanonCardStatusEnum>().oneOf(Object.values(KanbanCanonCardStatusEnum)),
  index: yup.number(),
});
