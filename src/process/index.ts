import { WorkflowContext, WorkflowStep } from './workflow-types';

export class Processor {
  private steps: WorkflowStep[];

  constructor(steps: WorkflowStep[]) {
    this.steps = steps;
  }

  public async process(initialContext: WorkflowContext): Promise<void> {
    const context = initialContext; // Use the provided initial context

    for (const step of this.steps) {
      await step.execute(context);
    }
  }
}
