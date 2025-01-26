import { useState } from "react"
import { Navigate } from "react-router"
import determineStatusMessage from "../utilities/Authorize/determineStatusMessage"
import InputSection from "../components/Authorization/InputSection"
import AuthTypeSwitch from "../components/Authorization/AuthTypeSwitch"
import determineTexts from "../utilities/Authorize/determineTexts"
import FormButton from "../components/Authorization/FormButton"


export default function Authorization({ user }) {

    const [authType, setAuthType] = useState("login")

    const [input, setInput] = useState({ name: "", email: "", password: "" })
    const [firstFocus, setFirstFocus] = useState({ name: false, email: false, password: false })
    const [errorMessages, setErrorMessages] = useState({ name: "", email: "", password: "" })

    const [userStatus, setUserStatus] = useState()

    function handleInput(event) {
        const { name, value } = event.target
        console.log(name)
        setInput((prevInput) => ({ ...prevInput, [name]: value }))
    }

    if (user && userStatus === "active") {
        return <Navigate to="/"></Navigate>
    }

    return (
        <div className="container-fluid">
            <form className="mx-auto d-flex flex-column justify-content-center" autoComplete="off">
                <h1 className="text-center h3">{determineTexts(authType, "h1")}</h1>

                <AuthTypeSwitch
                    authType={authType}
                    setAuthType={setAuthType}
                />

                <InputSection
                    authType={authType}
                    input={input}
                    handleInput={handleInput}
                    firstFocus={firstFocus}
                    setFirstFocus={setFirstFocus}
                    errorMessages={errorMessages}
                />

                <FormButton
                    authType={authType}
                    input={input}
                    setInput={setInput}
                    setErrorMessages={setErrorMessages}
                    setFirstFocus={setFirstFocus}
                    setUserStatus={setUserStatus}
                />

                {userStatus &&
                    <div className={`alert ${userStatus === "deleted" ? "alert-danger" : "alert-warning"} StatusNotification`}>
                        {determineStatusMessage(userStatus)}
                        <button
                            className="StatusNotificationCross"
                            onClick={() => setUserStatus()}
                        >
                            +
                        </button>
                    </div>
                }
            </form>
        </div >
    )
}