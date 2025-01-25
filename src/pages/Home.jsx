import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsDoorOpenFill } from "react-icons/bs"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { useNavigate, Navigate } from "react-router"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import typeDate from "../utilities/Home/typeDate"
import determineLatestActionMessage from "../utilities/Home/determineLatestActionMessage"
// db management
import { db } from "../firebase"
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"

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
        const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
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
            className="container-md p-1"
        >
            <div className="Home__Toolbar">
                <div className="Home__ToolbarButtonGroup">
                    <button
                        className="btn btn-outline-primary"
                        title="Block"
                        onClick={blockSelection}
                    >
                        <BsFillLockFill /> Block
                    </button>
                    <button
                        className="btn btn-outline-primary"
                        title="Unblock"
                        onClick={unblockSelection}
                    >
                        <BsFillUnlockFill />
                    </button>
                    <button className="btn btn-outline-danger"
                        title="Delete"
                        onClick={deleteSelection}
                    >
                        <BsFillTrashFill />
                    </button>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleSignOut}
                    title="Log out"
                >
                    <BsDoorOpenFill /> Log out
                </button>

            </div>

            <table className="table table-responsive table-hover mx-auto">
                <thead>
                    <tr>
                        <th scope="col">
                            <input
                                type="checkbox"
                                checked={selectedRows?.length === tableData.length}
                                onChange={handleCheckAll}
                                className="Home__Checkbox"
                            />
                        </th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Last login time</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((entry) => (
                            <tr
                                key={nanoid()}
                                className={selectedRows.includes(entry.id) ? "Home__SelectedRow" : ""}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(entry.id)}
                                        onChange={() => handleCheck(entry.id)}
                                        className="Home__Checkbox"
                                    />
                                </td>
                                <td>{entry.name} {entry.id === auth.currentUser.uid ? "(you)" : ""}</td>
                                <td>{entry.email}</td>
                                <td>{typeDate(entry.lastSeen)}</td >
                                <td>{entry.status[0].toUpperCase() + entry.status.slice(1)}</td>
                            </tr >
                        ))
                    }
                </tbody >
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table >
            {
                latestAction.targets.length > 0 &&
                <div className={`alert w-75 mx-auto text-align-center ${latestAction.action === "delete" ? "alert-danger" : "alert-warning"} StatusNotification`}>
                    {determineLatestActionMessage(latestAction)}
                    <button
                        className="StatusNotificationCross"
                        onClick={() => setLatestAction({ action: "", targets: [] })}
                    >
                        +
                    </button>
                </div>
            }
        </div >
    )
}