import { useState } from "react"
import { conditionalTexts } from "../data/authorizeUItexts"
import { Navigate } from "react-router"
import registerFocus from "../utilities/Authorize/registerFocus"
import determineStatusMessage from "../utilities/Authorize/determineStatusMessage"
import handleSignUp from "../utilities/Authorize/handleSignUp"
import handleSignIn from "../utilities/Authorize/handleSignIn"
import InputField from "../components/Authorization/InputField"


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

    function changeAuthType() {
        setAuthType((prevType) => {
            if (prevType === "login") {
                return "signup"
            } else if (prevType === "signup") {
                return "login"
            }
        })
    }

    function determineTexts(element) {
        if (authType === "login") {
            return conditionalTexts.login[element]
        } else if (authType === "signup") {
            return conditionalTexts.signup[element]
        }
    }

    if (user && userStatus === "active") {
        return <Navigate to="/"></Navigate>
    }

    return (
        <div className="container-fluid">
            <form className="mx-auto d-flex flex-column justify-content-center" autoComplete="off">
                <h1 className="text-center h3">{determineTexts("h1")}</h1>
                <button
                    type="button"
                    className="Auth__SubButton mt-2"
                    onClick={changeAuthType}
                >
                    {determineTexts("sub")}
                </button>

                {
                    authType === "signup" &&
                    <>
                        <InputField
                            fieldName="name"
                            placeholder="Joe"
                            classes="mb-3 mt-5"
                            input={input}
                            handleInput={handleInput}
                            firstFocus={firstFocus}
                            setFirstFocus={setFirstFocus}
                            errorMessages={errorMessages}
                        />
                    </>
                }
                <InputField
                    fieldName="email"
                    placeholder="name@example.com"
                    classes={`mb-3 ${authType === "login" ? "mt-5" : ""} `}
                    input={input}
                    handleInput={handleInput}
                    firstFocus={firstFocus}
                    setFirstFocus={setFirstFocus}
                    errorMessages={errorMessages}
                />
                <InputField
                    fieldName="password"
                    placeholder="****"
                    classes="mb-3"
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
                    {determineTexts("button")}
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