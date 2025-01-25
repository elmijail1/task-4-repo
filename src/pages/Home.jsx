import { useState, useEffect } from "react"
import { Navigate } from "react-router"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection } from "firebase/firestore"
// components
import ToolBar from "../components/Home/ToolBar"
import Table from "../components/Home/Table"
import LastActionNotification from "../components/Home/LastActionNotification"
// utilities
import populateTable from "../utilities/Home/populateTable"
import checkIfAccountActive from "../utilities/Home/checkIfAccountActive"
import determineLatestActionMessage from "../utilities/Home/determineLatestActionMessage"

export default function Home() {
    const [tableData, setTableData] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    const [latestAction, setLatestAction] = useState({ action: "", targets: [] })

    const usersCollectionRef = collection(db, "users")

    useEffect(() => {
        populateTable(usersCollectionRef, setTableData)
    }, [])

    useEffect(() => {
        async function checkIfAccountActiveOnPopulate() {
            const accountActive = await checkIfAccountActive(usersCollectionRef, auth)
            if (!accountActive) {
                await signOut(auth)
            }
        }
        checkIfAccountActiveOnPopulate()
    }, [tableData])

    if (!tableData) {
        return (
            <p>Loading...</p>
        )
    }

    if (!auth.currentUser) {
        return (
            <Navigate to="/authorize"></Navigate>
        )
    }

    return (
        <div
            className="container-md p-1 d-flex flex-column"
        >
            <ToolBar
                usersCollectionRef={usersCollectionRef}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                tableData={tableData}
                setLatestAction={setLatestAction}
                setTableData={setTableData}
            />

            <Table
                tableData={tableData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />

            {
                latestAction.targets.length > 0 &&
                <>
                    <LastActionNotification
                        latestAction={latestAction}
                        setLatestAction={setLatestAction}
                        determineLatestActionMessage={determineLatestActionMessage}
                    />
                </>

            }
        </div >
    )
}