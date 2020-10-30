import * as yup from "yup";

const createBadgeInputSchema = yup.object().shape({
  // id: string;
  // alias: string;
  // badgeShape: BadgeShapes;
  // backgroundHex?: string;
  // iconHex?: string;
  // title: string;
  // description?: string;
  // weight?: number;
  id: yup.string().uuid("Badge ID must be a valid UUID"),
  alias: yup.string().max(25, "Alias must be shorter than 25 characters").required("alias required!"),
  badgeShape: yup
    .string()
    .matches(/(star|square|circle)/, "Invalid shape, please try again")
    .required(),
  backgroundHex: yup.string().length(6, "Background hex value must be a valid 6 character hex code"),
  iconHex: yup.string().length(6, "Icon hex value must be a valid 6 character hex code"),
  title: yup.string().max(64, "Whoa! we're gonna need a shorter title. (max 64 characters)").required(),
  description: yup.string().max(150, "Description must be shorter than 150 characters"),
  weight: yup.number().max(9999, "That number's a bit too high... try one lower than 9999"),
});

export default createBadgeInputSchema;
