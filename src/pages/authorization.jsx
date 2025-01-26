import { useState } from "react"
import { Navigate } from "react-router"
// functions
import determineTexts from "../utilities/Authorize/determineTexts"
//components
import AuthTypeSwitch from "../components/Authorization/AuthTypeSwitch"
import InputSection from "../components/Authorization/InputSection"
import FormButton from "../components/Authorization/FormButton"
import StatusMessage from "../components/Authorization/StatusMessage"


export default function Authorization({ user }) {

    const [authType, setAuthType] = useState("login")

    const [input, setInput] = useState({ name: "", email: "", password: "" })
    const [firstFocus, setFirstFocus] = useState({ name: false, email: false, password: false })
    const [errorMessages, setErrorMessages] = useState({ name: "", email: "", password: "" })

    const [userStatus, setUserStatus] = useState()

    function handleInput(event) {
        const { name, value } = event.target
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
                    <StatusMessage
                        userStatus={userStatus}
                        setUserStatus={setUserStatus}
                    />
                }
            </form>
        </div >
    )
}