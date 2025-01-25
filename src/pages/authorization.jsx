import { useState } from "react"
import { conditionalTexts } from "../data/authorizeUItexts"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, deleteUser } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { Navigate } from "react-router"


export default function Authorization({ user }) {



    const [input, setInput] = useState({ name: "", email: "", password: "" })
    const [authType, setAuthType] = useState("login")

    function handleInput(event) {
        const { name, value } = event.target
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

    // since the task is to make a 1-character long password a possible option and Firebase won't let me do that
    function generateRightLengthPassword() {
        let rightLengthPassword = input.password
        if (input.password.length < 6) {
            for (let i = 0; i < 6 - input.password.length; i++) {
                rightLengthPassword = rightLengthPassword + "0"
            }
            console.log(rightLengthPassword)
        }
        return rightLengthPassword
    }

    // it creates an entry in both Auth Users & Firestore's collection "/users"
    async function handleSignUp() {
        if (!input.email || !input.password || !input.name) {
            setUserStatus("missing data")
            return
        }
        try {
            let rightLengthPassword = generateRightLengthPassword()
            const userCredential = await createUserWithEmailAndPassword(auth, input.email, rightLengthPassword)
            const user = userCredential.user
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: input.name,
                    email: input.email,
                    lastSeen: new Date(),
                    status: "active",
                })
                setUserStatus("active")
            } catch (error) {
                console.error(`Creating a DB record – Error code: ${error.code}`)
                console.error(`Creating a DB record – Error message: ${error.message}`)
            }
        }
        catch (error) {
            console.error(`Signing up – Error code: ${error.code}`)
            console.error(`Signing up – Error message: ${error.message}`)
            setUserStatus("duplicate email")
        }
    }

    // It first checks whether the user's been deleted from the DB
    // If it has, it deletes it from the Auth table too
    // If it's been blocked, it lets you know that you're blocked
    async function handleSignIn() {
        if (!input.email || !input.password) {
            setUserStatus("missing data")
            return
        }
        try {
            let rightLengthPassword = generateRightLengthPassword()
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

    const [inputFocus, setInputFocus] = useState()

    function determineStatusMessage() {
        if (userStatus === "blocked") {
            return "Your account has been blocked. Ask another user to unblock you."
        } else if (userStatus === "deleted") {
            return "Your account has been deleted. Create a new one."
        } else if (userStatus === "not found") {
            return "No such account found. Either check your login data & try again or create a new account."
        } else if (userStatus === "duplicate email") {
            return "An account linked to this email already exists. Either log in to your account or use another email to create a new one."
        } else if (userStatus === "missing data") {
            return "You haven't provided all the required data. Please fill out all the forms before trying to submit the form again."
        }
    }

    function determineErrorMessage() {
        if (inputFocus === "email") {
            let emailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input.email)
            if (!emailValid) {
                return "Email must look like this: name@example.com"
            }
        } else if (inputFocus === "name") {
            if (input.name.length < 1) {
                return "Name must be at least 1 char long"
            } else if (!/(^[A-Za-z0-9]+$)/i.test(input.name)) {
                return "Name must contain only Latin script (both cases) and numbers"
            }
        } else if (inputFocus === "password") {
            if (input.password.length < 1) {
                return "Password must be at least 1 char long"
            } else if (!/(^[A-Za-z0-9!#$%&? "]+$)/i.test(input.password)) {
                return "Password must contain only Latin script (both cases) and numbers"
            }
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
                                onFocus={() => setInputFocus("name")}
                                onBlur={() => setInputFocus()}
                            />
                        </div>
                        {
                            inputFocus === "name" &&
                            <div className="Authroize__InputErrorMessage">
                                {determineErrorMessage()}
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
                        onFocus={() => setInputFocus("email")}
                        onBlur={() => setInputFocus()}
                    />
                    {
                        inputFocus === "email" &&
                        <div className="Authroize__InputErrorMessage">
                            {determineErrorMessage()}
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
                        onFocus={() => setInputFocus("password")}
                        onBlur={() => setInputFocus()}
                    />
                    {
                        inputFocus === "password" &&
                        <div className="Authroize__InputErrorMessage">
                            {determineErrorMessage()}
                        </div>
                    }
                </div>
                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={authType === "login" ? handleSignIn : handleSignUp}
                >
                    {determineTexts("button")}
                </button>
                {userStatus &&
                    <div className={`alert ${userStatus === "deleted" ? "alert-danger" : "alert-warning"} StatusNotification`}>
                        {determineStatusMessage()}
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