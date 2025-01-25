import { useState } from "react"
import { conditionalTexts } from "../data/authorizeUItexts"
import { signInWithEmailAndPassword, getAuth, deleteUser } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, collection, getDocs, updateDoc } from "firebase/firestore"
import { Navigate } from "react-router"
import validateInput from "../utilities/Authorize/validateInput"
import registerFocus from "../utilities/Authorize/registerFocus"
import determineStatusMessage from "../utilities/Authorize/determineStatusMessage"
import generateRightLengthPassword from "../utilities/Authorize/generateRightLengthPassword"
import handleSignUp from "../utilities/Authorize/handleSignUp"


export default function Authorization({ user }) {



    const [input, setInput] = useState({ name: "", email: "", password: "" })
    const [authType, setAuthType] = useState("login")

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

    const [userStatus, setUserStatus] = useState()

    // It first checks whether the user's been deleted from the DB
    // If it has, it deletes it from the Auth table too
    // If it's been blocked, it lets you know that you're blocked
    async function handleSignIn() {
        const fields = ["email", "password"]
        for (let field of fields) {
            validateInput(field, input, setErrorMessages)
            console.log(errorMessages)
        }
        if (!validateInput("email", input, setErrorMessages) || !validateInput("password", input, setErrorMessages)) {
            setFirstFocus({ name: false, email: true, password: true })
            setUserStatus("not validated")
            return
        }
        try {
            let rightLengthPassword = generateRightLengthPassword(input)
            const userCredential = await signInWithEmailAndPassword(auth, input.email, rightLengthPassword)
            const user = userCredential.user
            const usersCollectionRef = collection(db, "users")
            try {
                const snapshot = await getDocs(usersCollectionRef)
                const activeUsersIDs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                if (!activeUsersIDs.map(entry => entry.id).includes(user.uid)) {
                    try {
                        await deleteUser(getAuth().currentUser)
                    } catch (error) {
                        console.error(`Error with deletion: ${error} `)
                    }
                    setUserStatus("deleted")
                    setInput({ name: "", email: "", password: "" })
                    console.log("Your account has been deleted, lol")
                } else if (activeUsersIDs.filter(entry => entry.id === user.uid)[0].status === "blocked") {
                    setUserStatus("blocked")
                    console.log("Your account has been blocked, lol")
                } else {
                    await updateDoc(doc(db, "users", user.uid), { lastSeen: new Date() })
                    setUserStatus("active")
                }
            } catch (error) {
                console.error(`Error with DB: ${error} `)
            }
        }
        catch (error) {
            console.log(`Error code: ${error.code}`)
            console.log(`Error message: ${error.message}`)
            setUserStatus("not found")
        }
    }

    const [firstFocus, setFirstFocus] = useState({ name: false, email: false, password: false })
    const [errorMessages, setErrorMessages] = useState({ name: "", email: "", password: "" })

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
                        <div className="mb-3 mt-5">
                            <label htmlFor="inputName" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputName"
                                placeholder="Joe"
                                name="name"
                                value={input.name}
                                onChange={handleInput}
                                onFocus={() => registerFocus(event, firstFocus, setFirstFocus)}
                            />
                        </div>
                        {
                            errorMessages.name &&
                            <div className="Authroize__InputErrorMessage">
                                {errorMessages.name}
                            </div>
                        }
                    </>
                }
                <div className={`mb-3 ${authType === "login" ? "mt-5" : ""} `}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="name@example.com"
                        name="email"
                        value={input.email}
                        onChange={handleInput}
                        onFocus={() => registerFocus(event, firstFocus, setFirstFocus)}
                    />
                    {
                        errorMessages.email &&
                        <div className="Authroize__InputErrorMessage">
                            {errorMessages.email}
                        </div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="****"
                        id="exampleInputPassword1"
                        name="password"
                        value={input.password}
                        onChange={handleInput}
                        onFocus={() => registerFocus(event, firstFocus, setFirstFocus)}
                    />
                    {
                        errorMessages.password &&
                        <div className="Authroize__InputErrorMessage">
                            {errorMessages.password}
                        </div>
                    }
                </div>
                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={authType === "login"
                        ? handleSignIn
                        : () => handleSignUp(input,
                            setErrorMessages,
                            setFirstFocus,
                            setUserStatus
                        )}
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