import validateInput from "./validateInput";
import generateRightLengthPassword from "./generateRightLengthPassword";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default async function handleSignUp(
  input,
  setErrorMessages,
  setFirstFocus,
  setUserStatus
) {
  const fields = ["email", "password", "name"];
  for (let field of fields) {
    validateInput(field, input, setErrorMessages);
  }
  if (
    !validateInput("email", input, setErrorMessages) ||
    !validateInput("password", input, setErrorMessages) ||
    !validateInput("name", input, setErrorMessages)
  ) {
    setFirstFocus({ name: true, email: true, password: true });
    setUserStatus("not validated");
    return;
  }
  try {
    let rightLengthPassword = generateRightLengthPassword(input);

    try {
      await updateDoc(doc(db, "emails", input.email), {
        name: input.name,
      });
      console.log(`An email duplication attempt!`);
      setUserStatus("duplicate email");
      return;
    } catch {
      console.log(`Good, so the email isn't duplicate`);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      input.email,
      rightLengthPassword
    );
    const user = userCredential.user;
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: input.name,
        email: input.email,
        lastSeen: new Date(),
        status: "active",
      });
    } catch (error) {
      console.error(`Creating the users DB record – Error code: ${error.code}`);
      console.error(
        `Creating the users DB record – Error message: ${error.message}`
      );
    }

    try {
      await setDoc(doc(db, "emails", input.email), {
        id: user.uid,
      });
    } catch (error) {
      console.error(
        `Adding an ID to the emails DB record – Error code: ${error.code}`
      );
      console.error(
        `Adding an ID to the emails DB record – Error message: ${error.message}`
      );
    }

    setUserStatus("active");
  } catch (error) {
    console.error(`Signing up – Error code: ${error.code}`);
    console.error(`Signing up – Error message: ${error.message}`);
    setUserStatus("duplicate email");
  }
}
