import changeAuthType from "../../utilities/Authorize/changeAuthType"
import determineTexts from "../../utilities/Authorize/determineTexts"

export default function AuthTypeSwitch({ authType, setAuthType }) {
    return (
        <button
            type="button"
            className="Auth__SubButton mt-2"
            onClick={() => changeAuthType(setAuthType)}
        >
            {determineTexts(authType, "sub")}
        </button>
    )
}