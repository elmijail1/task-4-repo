import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsDoorOpenFill } from "react-icons/bs"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { useNavigate } from "react-router"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

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

    useEffect(() => {
        setTableData([
            {
                id: 1,
                name: "Joe",
                email: "joe@momma.com",
                lastSeen: "5 min ago",
                status: "active",
            },
            {
                id: 2,
                name: "Pop",
                email: "pop@poppa.com",
                lastSeen: "1 min ago",
                status: "active",
            },
            {
                id: 3,
                name: "Kirk",
                email: "kirk@rocka.com",
                lastSeen: "1 hour ago",
                status: "active",
            },
        ])
    }, [])

    function handleSignOut() {
        signOut(auth).then(navigate("/authorize"))
    }

    if (!tableData) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div
            className="container-md p-1"
        >
            <div className="Home__Toolbar">
                <div className="Home__ToolbarButtonGroup">
                    <button className="btn btn-outline-primary" title="Block"><BsFillLockFill /> Block</button>
                    <button className="btn btn-outline-primary" title="Unblock"><BsFillUnlockFill /></button>
                    <button className="btn btn-outline-danger" title="Delete"><BsFillTrashFill /></button>
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
                                checked={selectedRows.length === tableData.length}
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
                                <td>{entry.name}</td>
                                <td>{entry.email}</td>
                                <td>{entry.lastSeen}</td>
                                <td>{entry.status[0].toUpperCase() + entry.status.slice(1)}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}