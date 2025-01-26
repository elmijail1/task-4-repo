import { useState } from "react"
import { Navigate } from "react-router"
import determineStatusMessage from "../utilities/Authorize/determineStatusMessage"
import handleSignUp from "../utilities/Authorize/handleSignUp"
import handleSignIn from "../utilities/Authorize/handleSignIn"
import InputSection from "../components/Authorization/InputSection"
import AuthTypeSwitch from "../components/Authorization/AuthTypeSwitch"
import determineTexts from "../utilities/Authorize/determineTexts"


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

                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={authType === "login"
                        ? () => handleSignIn(
                            input,
                            setErrorMessages,
                            setFirstFocus,
                            setUserStatus,
                            setInput
                        )
                        : () => handleSignUp(
                            input,
                            setErrorMessages,
                            setFirstFocus,
                            setUserStatus
                        )
                    }
                >
                    {determineTexts(authType, "button")}
                </button>
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