/**
 * A reference to another label.
 */
export interface LabelRef {
  name: string;
}

/**
 * A set of labels to add and/or remove.
 */
export interface LabelSet {
  adds: Array<LabelRef>;
  removes: Array<LabelRef>;
}

/**
 * Common fields for all labels.
 */
export interface BaseLabel {
  /**
   * Label name.
   */
  name: string;

  /**
   * Display color.
   */
  color?: string;

  /**
   * 
   */
  desc?: string;
  priority: number;
  requires: Array<unknown>;
}

/**
 * Individual labels: the equivalent of a checkbox.
 */
export interface FlagLabel extends BaseLabel, LabelSet {
  /* empty */
}

/**
 * The transition between two state values.
 */
export interface StateChange extends LabelSet {
  /**
   * Required labels for this state change to occur.
   */
  matches: Array<LabelRef>;
}

/**
 * One of many values for a particular state.
 */
export interface StateValue extends BaseLabel {
  /**
   * State changes that could occur to this value.
   */
  becomes: Array<StateChange>;
}

/**
 * Grouped labels: the equivalent of a radio group.
 */
export interface StateLabel extends BaseLabel, LabelSet {
  /**
   * Values for this state.
   */
  values: Array<StateValue>;
}