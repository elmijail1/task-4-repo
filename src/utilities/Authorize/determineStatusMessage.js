export default function determineStatusMessage(userStatus) {
  if (userStatus === "blocked") {
    return "Your account has been blocked. Ask another user to unblock you.";
  } else if (userStatus === "deleted") {
    return "Your account has been deleted. Create a new one.";
  } else if (userStatus === "not found") {
    return "No such account found. Either check your login data & try again or create a new account.";
  } else if (userStatus === "duplicate email") {
    return "An account linked to this email already exists. Either log in to your account or use another email to create a new one.";
  } else if (userStatus === "not validated") {
    return "Some of the data you've provided hasn't been validated. Check your input before trying to submit the form again.";
  }
}
