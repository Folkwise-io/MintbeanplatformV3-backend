import * as yup from "yup";

const createProjectInputSchema = yup.object().shape({
  userId: yup.string().uuid("userId must be a valid UUID"),
  meetId: yup.string().uuid("userId must be a valid UUID"),
  title: yup.string().max(255, "Title can be a maximum of 255 characters").required("Project title required!"),
  sourceCodeUrl: yup.string().url("Source code URL must be a valid URL").required("Source code URL required!"),
  liveUrl: yup.string().url("Deployment URL must be a valid URL").required("Deployment URL required!"),
});

export default createProjectInputSchema;
