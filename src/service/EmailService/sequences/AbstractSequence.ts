export type Hook = "afterRegistration" | "afterSubmission";

export abstract class AbstractSequence {
  dispatch(hook: Hook) {
    if (this.forHooks().includes(hook)) {
      this.setEmailSequenceInDatabase();
    }
  }

  setEmailSequenceInDatabase() {
    this.emailDao.insert({});
  }

  abstract forHooks(): string[];
  abstract template(context: any): string;
}
