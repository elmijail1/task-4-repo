import { useState } from "react"
import { conditionalTexts } from "../data/authorizeUItexts"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, deleteUser } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, setDoc, collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router"
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

    const navigate = useNavigate()

    const [userStatus, setUserStatus] = useState()

    // it creates an entry in both Auth Users & Firestore's collection "/users"
    function handleSignUp() {
        if (!input.email || !input.password) return
        createUserWithEmailAndPassword(auth, input.email, input.password)
            .then(async (userCredential) => {
                const userid = userCredential.user.uid
                setTimeout(() => {
                    navigate("/")
                }, 3000)
                try {
                    // the 3rd argument below uses the ID assigned to an Auth User to a related entry to the Firestore, it's very important
                    await setDoc(doc(db, "users", userid), {
                        name: input.name,
                        email: input.email,
                        lastSeen: "Just now",
                        status: "active",
                    })
                } catch (e) {
                    console.error("Error adding document: ", e)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        setUserStatus("active")
    }

    // It first checks whether the user's been deleted from the DB
    // If it has, it deletes it from the Auth table too
    async function handleSignIn() {
        if (!input.email || !input.password) return
        try {
            const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password)
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
                    setUserStatus("active")
                }
            } catch (error) {
                console.error(`Error with DB: ${error} `)
            }
        }
        catch (error) {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        }
    }

    const [inputFocus, setInputFocus] = useState()

    function determineStatusMessage() {
        if (userStatus === "blocked") {
            return "Your account has been blocked. Ask another user to unblock you."
        } else if (userStatus === "deleted") {
            return "Your account has been deleted. Create a new one."
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
            // console.log(input.password)
            // console.log(/(^[A-Za-z0-9]+$)/i.test(input.password))
            if (input.password.length < 1) {
                return "Password must be at least 1 char long"
            } else if (!/(^[A-Za-z0-9!#$%&? "]+$)/i.test(input.password)) {
                return "Password must contain only Latin script (both cases) and numbers"
            }
        }

        //(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])
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
                    <div className={`alert ${userStatus === "blocked" ? "alert-warning" : "alert-danger"} Authorize__StatusNotification`}>
                        {determineStatusMessage()}
                        <button
                            className="Authroize__StatusNotificationCross"
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