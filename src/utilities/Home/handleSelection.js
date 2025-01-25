import checkIfAccountActive from "./checkIfAccountActive";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import populateTable from "./populateTable";
import { signOut } from "firebase/auth";

export async function deleteSelection(
  usersCollectionRef,
  selectedRows,
  setSelectedRows,
  tableData,
  setLatestAction,
  setTableData,
  navigate
) {
  const accountActive = await checkIfAccountActive(usersCollectionRef, auth);
  if (accountActive) {
    if (selectedRows && selectedRows.length > 0) {
      const targets = [];
      for (let i = 0; i < selectedRows.length; i++) {
        try {
          await deleteDoc(doc(db, "users", selectedRows[i]));
          targets.push(
            tableData.filter((user) => user.id === selectedRows[i])[0].name
          );
          console.log(`Doc deleted`);
        } catch (error) {
          console.error(`Error with deletion: ${error}`);
        }
      }
      setSelectedRows([]);
      setLatestAction({ action: "delete", targets: [...targets] });
      populateTable(usersCollectionRef, setTableData);
    } else {
      console.log("Nothing has been selected");
      setLatestAction({ action: "nothing", targets: ["none"] });
    }
  } else if (!accountActive) {
    await signOut(auth);
    navigate("/authorize");
  }
}

export async function blockSelection(
  usersCollectionRef,
  selectedRows,
  tableData,
  setLatestAction,
  setTableData,
  navigate
) {
  const accountActive = await checkIfAccountActive(usersCollectionRef, auth);
  if (accountActive) {
    if (selectedRows && selectedRows.length > 0) {
      const targets = [];
      for (let i = 0; i < selectedRows.length; i++) {
        try {
          await updateDoc(doc(db, "users", selectedRows[i]), {
            status: "blocked",
          });
          targets.push(
            tableData.filter((user) => user.id === selectedRows[i])[0].name
          );
          console.log(`Doc blocked`);
        } catch (error) {
          console.error(`Error with deletion: ${error}`);
        }
      }
      setLatestAction({ action: "block", targets: [...targets] });
      populateTable(usersCollectionRef, setTableData);
    } else {
      console.log("Nothing has been selected");
      setLatestAction({ action: "nothing", targets: ["none"] });
    }
  } else if (!accountActive) {
    await signOut(auth);
    navigate("/authorize");
  }
}

export async function unblockSelection(
  usersCollectionRef,
  selectedRows,
  tableData,
  setLatestAction,
  setTableData,
  navigate
) {
  const accountActive = await checkIfAccountActive(usersCollectionRef, auth);
  if (accountActive) {
    if (selectedRows && selectedRows.length > 0) {
      const targets = [];
      for (let i = 0; i < selectedRows.length; i++) {
        try {
          await updateDoc(doc(db, "users", selectedRows[i]), {
            status: "active",
          });
          targets.push(
            tableData.filter((user) => user.id === selectedRows[i])[0].name
          );
          console.log(`Doc unblocked`);
        } catch (error) {
          console.error(`Error with deletion: ${error}`);
        }
      }
      setLatestAction({ action: "unblock", targets: [...targets] });
      populateTable(usersCollectionRef, setTableData);
    } else {
      console.log("Nothing has been selected");
      setLatestAction({ action: "nothing", targets: ["none"] });
    }
  } else if (!accountActive) {
    await signOut(auth);
    navigate("/authorize");
  }
}
