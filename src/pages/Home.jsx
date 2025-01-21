import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill } from "react-icons/bs"

export default function Home() {

    return (
        <div
            className="container-md"
        // style={{ backgroundColor: "black" }}
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
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>Joe</td>
                        <td>joe@momma.com</td>
                        <td>5 min ago</td>
                        <td>Active</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>Pop</td>
                        <td>pop@poppa.com</td>
                        <td>1 min ago</td>
                        <td>Active</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>Kirk</td>
                        <td>kirk@rocka.com</td>
                        <td>1 hour ago</td>
                        <td>Active</td>
                    </tr>
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