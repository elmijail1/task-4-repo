import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import determineLatestActionMessage from "../utilities/Home/determineLatestActionMessage"
// db management
import { db } from "../firebase"
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import ToolBar from "../components/Home/ToolBar"
import Table from "../components/Home/Table"
import LastActionNotification from "../components/Home/LastActionNotification"

export default function Home() {
    const navigate = useNavigate()

    const [tableData, setTableData] = useState()
    const [selectedRows, setSelectedRows] = useState([])

    function handleCheck(id) {
        if (selectedRows.includes(id)) {
            setSelectedRows(prevRows => prevRows.filter(item => item !== id))
        } else {
            setSelectedRows(prevRows => [...prevRows, id])
        }
    }

    function handleCheckAll() {
        if (selectedRows.length === tableData.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(tableData.map(entry => entry.id))
        }
    }

    function handleSignOut() {
        signOut(auth).then(navigate("/authorize"))
    }

    const usersCollectionRef = collection(db, "users")
    async function populateTable() {
        const snapshot = await getDocs(usersCollectionRef)
        const users = snapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id }))
            .sort((a, b) => {
                let valueA = a.name
                let valueB = b.name
                if (valueA < valueB) {
                    return -1
                } else if (valueA > valueB || valueA === valueB) {
                    return 1
                } else {
                    return 0
                }
            })
        setTableData(users)
    }

    useEffect(() => {
        populateTable()
    }, [])


    async function checkIfAccountActive() {
        try {
            const snapshot = await getDocs(usersCollectionRef)
            const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            if (!auth.currentUser) {
                return false
            } else if (!users.filter(user => user.id === auth.currentUser.uid)[0]) {
                return false
            } else if (users.filter(user => user.id === auth.currentUser.uid)[0].status === "blocked") {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.error(`Error with getting a snapshot in checkAccountStatus: ${error} `)
        }
    }

    useEffect(() => {
        async function checkIfAccountActiveOnPopulate() {
            const accountActive = await checkIfAccountActive()
            if (!accountActive) {
                await signOut(auth)
            }
        }
        checkIfAccountActiveOnPopulate()
    }, [tableData])

    async function deleteSelection() {
        const accountActive = await checkIfAccountActive()
        if (accountActive) {
            if (selectedRows && selectedRows.length > 0) {
                const targets = []
                for (let i = 0; i < selectedRows.length; i++) {
                    try {
                        await deleteDoc(doc(db, "users", selectedRows[i]))
                        targets.push(tableData.filter(user => user.id === selectedRows[i])[0].name)
                        console.log(`Doc deleted`)
                    } catch (error) {
                        console.error(`Error with deletion: ${error}`)
                    }
                }
                setSelectedRows([])
                setLatestAction({ action: "delete", targets: [...targets] })
                populateTable()
            } else {
                console.log("Nothing has been selected")
                setLatestAction({ action: "nothing", targets: ["none"] })
            }
        } else if (!accountActive) {
            await signOut(auth)
            navigate("/authorize")
        }
    }

    async function blockSelection() {
        const accountActive = await checkIfAccountActive()
        if (accountActive) {
            if (selectedRows && selectedRows.length > 0) {
                const targets = []
                for (let i = 0; i < selectedRows.length; i++) {
                    try {
                        await updateDoc(doc(db, "users", selectedRows[i]), { status: "blocked" })
                        targets.push(tableData.filter(user => user.id === selectedRows[i])[0].name)
                        console.log(`Doc blocked`)
                    } catch (error) {
                        console.error(`Error with deletion: ${error}`)
                    }
                }
                setLatestAction({ action: "block", targets: [...targets] })
                populateTable()
            }
            else {
                console.log("Nothing has been selected")
                setLatestAction({ action: "nothing", targets: ["none"] })
            }
        } else if (!accountActive) {
            await signOut(auth)
            navigate("/authorize")
        }
    }

    async function unblockSelection() {
        const accountActive = await checkIfAccountActive()
        if (accountActive) {
            if (selectedRows && selectedRows.length > 0) {
                const targets = []
                for (let i = 0; i < selectedRows.length; i++) {
                    try {
                        await updateDoc(doc(db, "users", selectedRows[i]), { status: "active" })
                        targets.push(tableData.filter(user => user.id === selectedRows[i])[0].name)
                        console.log(`Doc unblocked`)
                    } catch (error) {
                        console.error(`Error with deletion: ${error}`)
                    }
                }
                setLatestAction({ action: "unblock", targets: [...targets] })
                populateTable()
            }
            else {
                console.log("Nothing has been selected")
                setLatestAction({ action: "nothing", targets: ["none"] })
            }
        } else if (!accountActive) {
            await signOut(auth)
            navigate("/authorize")
        }
    }

    const [latestAction, setLatestAction] = useState({ action: "", targets: [] })

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
                blockSelection={blockSelection}
                unblockSelection={unblockSelection}
                deleteSelection={deleteSelection}
                handleSignOut={handleSignOut}
            />

            <Table
                auth={auth}
                tableData={tableData}
                selectedRows={selectedRows}
                handleCheck={handleCheck}
                handleCheckAll={handleCheckAll}
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