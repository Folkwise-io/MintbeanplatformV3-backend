import * as yup from "yup";

export const createBadgeInputSchema = yup.object().shape({
  id: yup.string().uuid("Badge ID must be a valid UUID"),
  alias: yup
    .string()
    .min(3, "Too Short!")
    .max(25, "Alias must be shorter than 25 characters")
    .required("alias required!"),
  badgeShape: yup
    .string()
    .matches(/(star|square|circle)/, "Invalid shape, please try again")
    .required(),
  backgroundHex: yup.string().length(6, "Background hex value must be a valid 6 character hex code"),
  iconHex: yup.string().length(6, "Icon hex value must be a valid 6 character hex code"),
  title: yup
    .string()
    .min(2, "Too Short!")
    .max(64, "Whoa! we're gonna need a shorter title. (max 64 characters)")
    .required(),
  description: yup.string().max(150, "Description must be shorter than 150 characters"),
  weight: yup.number().min(0, "Must be positive!").max(9999, "That number's a bit too high... try one lower than 9999"),
});

export const editBadgeInputSchema = yup.object().shape({
  id: yup.string().uuid("Badge ID must be a valid UUID"),
  alias: yup.string().min(3, "Too Short!").max(25, "Alias must be shorter than 25 characters"),
  badgeShape: yup.string().matches(/(star|square|circle)/, "Invalid shape, please try again"),
  backgroundHex: yup.string().length(6, "Background hex value must be a valid 6 character hex code"),
  iconHex: yup.string().length(6, "Icon hex value must be a valid 6 character hex code"),
  title: yup.string().min(2, "Too Short!").max(64, "Whoa! we're gonna need a shorter title. (max 64 characters)"),
  description: yup.string().max(150, "Description must be shorter than 150 characters"),
  weight: yup.number().min(0, "Must be positive!").max(9999, "That number's a bit too high... try one lower than 9999"),
});
