import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill } from "react-icons/bs"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"

export default function Home() {

    const [tableData, setTableData] = useState()
    const [selectedRows, setSelectedRows] = useState([])

    function handleCheck(id) {
        if (selectedRows.includes(id)) {
            setSelectedRows(prevRows => prevRows.filter(item => item !== id))
        } else {
            setSelectedRows(prevRows => [...prevRows, id])
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
                <button className="btn btn-outline-primary"><BsFillLockFill /> Block</button>
                <button className="btn btn-outline-primary"><BsFillUnlockFill /></button>
                <button className="btn btn-outline-danger"><BsFillTrashFill /></button>
            </div>

            <table className="table table-responsive table-hover mx-auto">
                <thead>
                    <tr>
                        <th scope="col"><input type="checkbox" /></th>
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