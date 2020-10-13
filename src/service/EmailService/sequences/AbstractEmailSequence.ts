import { EmailDao } from "../../../dao/EmailDao";

export type Hook = "afterRegistration" | "afterSubmission" | "afterFirstSignIn";

export abstract class AbstractEmailSequence {
  constructor(private emailDao: EmailDao, private context: any) {}

  dispatch(hook: Hook) {
    if (this.forHooks().includes(hook)) {
      this.setEmailSequenceInDatabase();
    }
  }

  setEmailSequenceInDatabase() {
    this.emailDao.insert({ body: this.template(this.context) });
  }

  abstract forHooks(): Hook[];
  abstract template(context: any): string;
}
