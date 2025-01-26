import handleSignIn from "../../utilities/Authorize/handleSignIn"
import handleSignUp from "../../utilities/Authorize/handleSignUp"
import determineTexts from "../../utilities/Authorize/determineTexts"

export default function FormButton({ authType, input, setInput, setErrorMessages, setFirstFocus, setUserStatus }) {
    return (
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
    )
}