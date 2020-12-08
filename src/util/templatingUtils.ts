import ejs, { Options } from "ejs";

// eslint-disable-nextline
type AnyObject = { [key: string]: any };

// TODO: how to return just string (not promise)
// export const render = (string: string, data: AnyObject, options: Options = {}): string => {
//   return ejs.render(string, data, options);
// };

export const renderFile = (filename: string, data: AnyObject, options: Options = {}): string => {
  return ejs.renderFile(filename, data, options, function (err, str) {
    if (err) {
      console.error("Templating error from file: ", filename);
      console.error("Message: ", err);
    }
    return str;
  });
};
