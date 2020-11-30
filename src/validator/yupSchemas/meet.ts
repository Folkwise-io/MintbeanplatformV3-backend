import * as yup from "yup";
import moment from "moment";

export const createMeetInputSchema = yup.object().shape({
  meetType: yup.string().required("Required"),
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required("Required"),
  description: yup.string().min(3, "Too Short!").required("Required"),
  instructions: yup.string().min(3, "Too Short!").required("Required"),
  registerLink: yup.string().url("Must be a valid URL (https://...)").required("Required"),
  coverImageUrl: yup.string().url("Must be a valid URL (https://...)").required("Required"),
  startTime: yup
    .string()
    .test("is-chronological", "Start time and end time must be chronological", function (startTime) {
      const isChronological = moment(startTime).isBefore(this.parent.endTime);
      return isChronological;
    })
    .required("Required"),
  endTime: yup.string().required("Required"),
  region: yup.string().required("Required"),
});

// TODO: make these fields not required and sync schema in the frontend the same way
export const editMeetInputSchema = yup.object().shape({
  meetType: yup.string().required("Required"),
  title: yup.string().min(2, "Too Short!").max(64, "Too Long!").required("Required"),
  description: yup.string().min(3, "Too Short!").max(160, "Max characters: 160").required("Required"),
  instructions: yup.string().min(3, "Too Short!").required("Required"),
  registerLink: yup.string().url("Must be a valid URL (https://...)").required("Required"),
  coverImageUrl: yup.string().url("Must be a valid URL (https://...)").required("Required"),
  startTime: yup
    .string()
    .test("is-chronological", "Start time and end time must be chronological", function (startTime) {
      const isChronological = moment(startTime).isBefore(this.parent.endTime);
      return isChronological;
    })
    .required("Required"),
  endTime: yup.string().required("Required"),
  region: yup.string().required("Required"),
});
