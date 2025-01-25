export default function LastActionNotification({ latestAction, setLatestAction, determineLatestActionMessage }) {
    return (
        <div className={`alert w-75 mx-auto text-align-center ${latestAction.action === "delete" ? "alert-danger" : "alert-warning"} StatusNotification`}>
            {determineLatestActionMessage(latestAction)}
            <button
                className="StatusNotificationCross"
                onClick={() => setLatestAction({ action: "", targets: [] })}
            >
                +
            </button>
        </div>
    )
}