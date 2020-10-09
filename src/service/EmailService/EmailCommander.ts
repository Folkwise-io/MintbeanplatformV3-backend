import sequences from "./sequences";

type EmailHook = "afterRegistration" | "afterSubmission";

class EmailObserver {
  publishEvent(hook: EmailHook) {
    sequences
      .find(hook)
      .order(accordingToStepOrder)
      .forEach((sequenceStep) => {
        eventsDatabase.insert({});
      });
  }
}
