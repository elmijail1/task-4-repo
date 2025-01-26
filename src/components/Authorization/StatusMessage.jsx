import determineStatusMessage from "../../utilities/Authorize/determineStatusMessage"

export default function StatusMessage({ userStatus, setUserStatus }) {
    return (
        <div className={`alert ${userStatus === "deleted" ? "alert-danger" : "alert-warning"} StatusNotification`}>
            {determineStatusMessage(userStatus)}
            <button
                className="StatusNotificationCross"
                onClick={() => setUserStatus()}
            >
                +
            </button>
        </div>
    )
}