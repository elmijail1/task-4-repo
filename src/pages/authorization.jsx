import { useState } from "react"

export default function Authorization() {

    const [authType, setAuthType] = useState("login")

    function changeAuthType() {
        setAuthType((prevType) => {
            if (prevType === "login") {
                return "signup"
            } else {
                return "login"
            }
        })
    }

    const conditionalTexts = {
        login: {
            h1: "Login",
            sub: "Don't have an account? Switch to Sign up!",
            button: "Log in",
        },
        signup: {
            h1: "Sign up",
            sub: "Already have an account? Switch to Login!",
            button: "Sign up",
        },
    }

    function determineTexts(element) {
        if (authType === "login") {
            return conditionalTexts.login[element]
        } else {
            return conditionalTexts.signup[element]
        }
    }

    return (
        <div className="container-fluid">
            <form className="mx-auto d-flex flex-column justify-content-center">
                <h1 className="text-center h3">{determineTexts("h1")}</h1>
                <button
                    type="button"
                    className="Auth__SubButton mt-2"
                    onClick={changeAuthType}
                >
                    {determineTexts("sub")}
                </button>

                <div className="mb-3 mt-5">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="name@example.com"
                        aria-describedby="emailHelp"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="****"
                        id="exampleInputPassword1"
                    />
                </div>
                {/* <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div> */}
                <button type="submit" className="btn btn-primary w-100">{determineTexts("button")}</button>
            </form>
        </div >
    )
}