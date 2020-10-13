import { AbstractEmailSequence, Hook } from "../AbstractEmailSequence";

export default class UponRegistration extends AbstractEmailSequence {
  template(context: any): string {
    return `
    `;
  }

  forHooks(): Hook[] {
    return ["afterRegistration", "afterFirstSignIn"];
  }
}
