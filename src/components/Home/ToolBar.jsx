import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsDoorOpenFill } from "react-icons/bs"
import ToolBarButton from "./ToolBarButton"
import handleSignOut from "../../utilities/Home/handleSignout";
import { useNavigate } from "react-router";


export default function ToolBar({ blockSelection, unblockSelection, deleteSelection }) {
    const navigate = useNavigate();

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
                onClickAction={() => handleSignOut(navigate)}
            >
                <BsDoorOpenFill /> Log out
            </ToolBarButton>

        </div>
    )
}