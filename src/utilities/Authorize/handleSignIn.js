import validateInput from "./validateInput";
import generateRightLengthPassword from "./generateRightLengthPassword";
import { signInWithEmailAndPassword, deleteUser, getAuth } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default async function handleSignIn(
  input,
  setErrorMessages,
  setFirstFocus,
  setUserStatus,
  setInput
) {
  const fields = ["email", "password"];
  for (let field of fields) {
    validateInput(field, input, setErrorMessages);
  }
  if (
    !validateInput("email", input, setErrorMessages) ||
    !validateInput("password", input, setErrorMessages)
  ) {
    setFirstFocus({ name: false, email: true, password: true });
    setUserStatus("not validated");
    return;
  }
  try {
    let rightLengthPassword = generateRightLengthPassword(input);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      input.email,
      rightLengthPassword
    );
    const user = userCredential.user;
    const usersCollectionRef = collection(db, "users");
    try {
      const snapshot = await getDocs(usersCollectionRef);
      const activeUsersIDs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Firebase Auth uid is used for consisten storing
      if (!activeUsersIDs.map((entry) => entry.id).includes(user.uid)) {
        try {
          await deleteUser(getAuth().currentUser);
        } catch (error) {
          console.error(`Error with deletion: ${error} `);
        }
        setUserStatus("deleted");
        setInput({ name: "", email: "", password: "" });
        console.log("Your account has been deleted, lol");
      } else if (
        activeUsersIDs.filter((entry) => entry.id === user.uid)[0].status ===
        "blocked"
      ) {
        setUserStatus("blocked");
        console.log("Your account has been blocked, lol");
      } else {
        await updateDoc(doc(db, "users", user.uid), { lastSeen: new Date() });
        setUserStatus("active");
      }
    } catch (error) {
      console.error(`Error with DB: ${error} `);
    }
  } catch (error) {
    console.log(`Error code: ${error.code}`);
    console.log(`Error message: ${error.message}`);
    setUserStatus("not found");
  }
}
