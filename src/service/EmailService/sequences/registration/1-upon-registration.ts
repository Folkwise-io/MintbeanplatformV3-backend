import { AbstractSequence, Hook } from "../AbstractSequence";

class UponRegistration extends AbstractSequence {
  template(context: any): string {
    return `
    `;
  }
  forHooks(): Hook[] {
    return ["afterRegistration", "afterFirstSignIn", "afterFifthSignIn"];
  }
}
