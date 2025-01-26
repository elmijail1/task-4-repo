import { conditionalTexts } from "../../data/authorizeUItexts";

export default function determineTexts(authType, element) {
  if (authType === "login") {
    return conditionalTexts.login[element];
  } else if (authType === "signup") {
    return conditionalTexts.signup[element];
  }
}
