import { nanoid } from "nanoid"
import typeDate from "../../utilities/Home/typeDate"
import { auth } from "../../firebase"
import { handleCheck, handleCheckAll } from "../../utilities/Home/handleChecks"

export default function Table({ tableData, selectedRows, setSelectedRows }) {
    return (
        <div className="Home__TableWrapper">
            <table className="table table-responsive table-hover mx-auto overflow-scroll">
                <thead>
                    <tr>
                        <th scope="col">
                            <input
                                type="checkbox"
                                checked={selectedRows?.length === tableData.length}
                                onChange={() => handleCheckAll(tableData, selectedRows, setSelectedRows)}
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
                                        onChange={() => handleCheck(entry.id, selectedRows, setSelectedRows)}
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
            </table >
        </div>
    )
}