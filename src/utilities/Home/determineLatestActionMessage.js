import typeTargetUsers from "./typeTargetUsers";

export default function determineLatestActionMessage(latestAction) {
  if (latestAction.action === "block") {
    return `You've blocked ${typeTargetUsers(
      latestAction.targets
    )}. Now they can't log in.`;
  } else if (latestAction.action === "unblock") {
    return `You've unblocked ${typeTargetUsers(
      latestAction.targets
    )}. Now they can log in & do various actions.`;
  } else if (latestAction.action === "delete") {
    return `You've deleted ${typeTargetUsers(
      latestAction.targets
    )}. Now they don't`;
  } else if (latestAction.action === "nothing") {
    return `Nothing has been selected. Use checkboxes to select users.`;
  }
}
