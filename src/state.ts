import { deepMerge } from "./deep-merge";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export class State<T = {}> {
  state: T;

  onUpdateComplete?: (state: T) => void;

  constructor(state: T, onUpdateComplete?: (state: T) => void) {
    this.state = state;
    this.onUpdateComplete = onUpdateComplete;
  }

  setState(state: RecursivePartial<T>) {
    deepMerge(this.state, state);

    if (this.onUpdateComplete) {
      this.onUpdateComplete(this.state);
    }
  }

  getState() {
    return this.state;
  }
}
