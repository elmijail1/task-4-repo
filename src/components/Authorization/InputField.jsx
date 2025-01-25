import registerFocus from "../../utilities/Authorize/registerFocus"

export default function InputField({ fieldName, placeholder, classes, input, handleInput, firstFocus, setFirstFocus, errorMessages }) {
    return (
        <div className={classes}>
            <label htmlFor={fieldName} className="form-label">{fieldName[0].toUpperCase()}{fieldName.slice(1)}</label>
            <input
                name={fieldName}
                type={fieldName}
                id={fieldName}
                className="form-control"
                placeholder={placeholder}
                value={input[fieldName]}
                onChange={handleInput}
                onFocus={() => registerFocus(event, firstFocus, setFirstFocus)}
            />
            {
                errorMessages[fieldName] &&
                <div className="Authroize__InputErrorMessage">
                    {errorMessages[fieldName]}
                </div>
            }
        </div>
    )
}