export default function typeTargetUsers(targets) {
  const targetUsers = targets.map((target, index) => {
    if (targets.length > 1 && index === targets.length - 1) {
      return `and ${target}`;
    } else {
      return target;
    }
  });
  return targetUsers.join(", ");
}
