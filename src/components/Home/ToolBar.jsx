import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsDoorOpenFill } from "react-icons/bs"
import ToolBarButton from "./ToolBarButton"


export default function ToolBar({ blockSelection, unblockSelection, deleteSelection, handleSignOut }) {
    return (
        <div className="Home__Toolbar">
            <div className="Home__ToolbarButtonGroup">
                <ToolBarButton
                    classNameValue="btn btn-outline-primary"
                    titleValue="Block"
                    onClickAction={blockSelection}
                >
                    <BsFillLockFill /> Block
                </ToolBarButton>
                <ToolBarButton
                    classNameValue="btn btn-outline-primary"
                    titleValue="Unblock"
                    onClickAction={unblockSelection}
                >
                    <BsFillUnlockFill />
                </ToolBarButton>
                <ToolBarButton
                    classNameValue="btn btn-outline-danger"
                    titleValue="Delete"
                    onClickAction={deleteSelection}
                >
                    <BsFillTrashFill />
                </ToolBarButton>
            </div>
            <ToolBarButton
                classNameValue="btn btn-outline-secondary"
                titleValue="Log out"
                onClickAction={handleSignOut}
            >
                <BsDoorOpenFill /> Log out
            </ToolBarButton>

        </div>
    )
}