import { getDocs } from "firebase/firestore";

export default async function populateTable(usersCollectionRef, setTableData) {
  const snapshot = await getDocs(usersCollectionRef);
  const users = snapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .sort((a, b) => {
      let valueA = a.name;
      let valueB = b.name;
      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB || valueA === valueB) {
        return 1;
      } else {
        return 0;
      }
    });
  setTableData(users);
}
