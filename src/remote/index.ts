export interface ProjectQuery {
  project: string;
}

export interface LabelQuery extends ProjectQuery {
  name: string;
}

export interface IssueQuery extends ProjectQuery {
  issue: string;
}

export interface CommentUpdate extends IssueQuery {
  comment: string;
}

export interface IssueUpdate extends IssueQuery {
  labels: Array<string>;
  name: string;
}

export interface LabelUpdate extends LabelQuery {
  color: string;
  desc: string;
}

export interface RemoteOptions {
  data: Record<string, string>;
  type: string;
}

/**
 * Basic functions which every remote API must provide.
 */
export interface Remote {
  /**
   * Add a comment to an issue (for attribution and auditing).
   */
  createComment(options: CommentUpdate): Promise<unknown>;

  /**
   * Create a new label.
   */
  createLabel(options: LabelQuery): Promise<LabelUpdate>;

  /**
   * Delete an existing label.
   */
  deleteLabel(options: LabelQuery): Promise<LabelUpdate>;

  /**
   * Get details of a single issue.
   */
  getIssue(options: IssueQuery): Promise<Array<IssueUpdate>>;

  /**
   * Get details of a single label.
   */
  getLabel(options: LabelQuery): Promise<Array<LabelUpdate>>;

  /**
   * List all issues.
   */
  listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>>;

  /**
   * List all labels.
   */
  listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>>;

  /**
   * Update an issue.
   *
   * Only labels will be modified.
   */
  updateIssue(options: IssueUpdate): Promise<IssueUpdate>;

  /**
   * Update a label.
   */
  updateLabel(options: LabelUpdate): Promise<LabelUpdate>;
}
