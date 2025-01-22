import { Navigate } from "react-router";

export default function ProtectedRoute({ children, user }) {
    return user ? children : <Navigate to="/authorize"></Navigate>
}