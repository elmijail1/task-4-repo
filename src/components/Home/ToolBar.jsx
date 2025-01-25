import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsDoorOpenFill } from "react-icons/bs"
import ToolBarButton from "./ToolBarButton"
import handleSignOut from "../../utilities/Home/handleSignout";
import { useNavigate } from "react-router";
import { blockSelection, unblockSelection, deleteSelection } from "../../utilities/Home/handleSelection"


export default function ToolBar({
    usersCollectionRef,
    selectedRows,
    setSelectedRows,
    tableData,
    setLatestAction,
    setTableData
}) {
    const navigate = useNavigate();

    return (
        <div className="Home__Toolbar">
            <div className="Home__ToolbarButtonGroup">
                <ToolBarButton
                    classNameValue="btn btn-outline-primary"
                    titleValue="Block"
                    onClickAction={() => blockSelection(
                        usersCollectionRef,
                        selectedRows,
                        tableData,
                        setLatestAction,
                        setTableData,
                        navigate
                    )}
                >
                    <BsFillLockFill /> Block
                </ToolBarButton>
                <ToolBarButton
                    classNameValue="btn btn-outline-primary"
                    titleValue="Unblock"
                    onClickAction={() => unblockSelection(
                        usersCollectionRef,
                        selectedRows,
                        tableData,
                        setLatestAction,
                        setTableData,
                        navigate
                    )}
                >
                    <BsFillUnlockFill />
                </ToolBarButton>
                <ToolBarButton
                    classNameValue="btn btn-outline-danger"
                    titleValue="Delete"
                    onClickAction={() => deleteSelection(
                        usersCollectionRef,
                        selectedRows,
                        setSelectedRows,
                        tableData,
                        setLatestAction,
                        setTableData,
                        navigate
                    )}
                >
                    <BsFillTrashFill />
                </ToolBarButton>
            </div>
            <ToolBarButton
                classNameValue="btn btn-outline-secondary"
                titleValue="Log out"
                onClickAction={() => handleSignOut(navigate)}
            >
                <BsDoorOpenFill /> Log out
            </ToolBarButton>

        </div>
    )
}