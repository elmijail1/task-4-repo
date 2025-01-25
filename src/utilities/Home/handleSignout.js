import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function handleSignOut(navigate) {
  signOut(auth).then(navigate("/authorize"));
}
