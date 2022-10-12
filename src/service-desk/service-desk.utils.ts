import { ServiceDeskPriority, WorkManagementIssueType } from "./constants";

interface GetIssueParam {
  summary: string;
  isSubTask: boolean;
  issueTypeId: WorkManagementIssueType;
  parentKey?: string;
  projectKey: string;
  description: string;
  assigneeId: string;
  reportedId: string;
  labels: Array<string>;
  priorityId: ServiceDeskPriority;
}

export class JiraUtils {
  static getPickupRequestTicket() {}
  static getPickupItemSubTicket() {}

  private static getIssue(params: GetIssueParam) {
    const {
      assigneeId,
      description,
      isSubTask,
      issueTypeId,
      labels,
      parentKey,
      priorityId,
      projectKey,
      reportedId,
      summary,
    } = params;

    return {
      update: {},
      fields: {
        summary,
        ...(isSubTask
          ? {
              parent: {
                key: parentKey,
              },
            }
          : {}),
        issuetype: {
          id: issueTypeId,
        },
        project: {
          key: projectKey,
        },
        description,
        reporter: {
          id: reportedId,
        },
        assignee: {
          id: assigneeId,
        },
        priority: {
          id: priorityId,
        },
        ...(labels ? {} : { labels }),
      },
    };
  }
}
