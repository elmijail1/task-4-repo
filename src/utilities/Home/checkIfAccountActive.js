import { getDocs } from "firebase/firestore";

export default async function checkIfAccountActive(usersCollectionRef, auth) {
  try {
    const snapshot = await getDocs(usersCollectionRef);
    const users = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    if (!auth.currentUser) {
      return false;
    } else if (!users.filter((user) => user.id === auth.currentUser.uid)[0]) {
      return false;
    } else if (
      users.filter((user) => user.id === auth.currentUser.uid)[0].status ===
      "blocked"
    ) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(
      `Error with getting a snapshot in checkAccountStatus: ${error} `
    );
  }
}
