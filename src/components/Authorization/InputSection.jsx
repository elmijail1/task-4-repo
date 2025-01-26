import InputField from "./InputField"

export default function InputSection({ authType, input, handleInput, firstFocus, setFirstFocus, errorMessages }) {
    return (
        <>
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
        </>
    )
}