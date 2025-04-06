import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";
import { FaUser } from "react-icons/fa";
import AccountNavigation from "./Navigation";
import Users from "./Users";
export default function Account() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div id="wd-account-screen">
            <h2 className="text-danger">
                <FaUser className="me-4 fs-4 mb-1"/>
                Account
            </h2>
            <hr/>
            <table>
                <tr>
                    <td valign="top">
                        <AccountNavigation />
                    </td>
                    <td>
                        <Routes>
                            <Route path="/" element={<Navigate to={ currentUser ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin" }/>} />
                            <Route path="/Signin" element={<Signin />} />
                            <Route path="/Profile" element={<Profile />} />
                            <Route path="/Signup" element={<Signup />} />
                            <Route path="/Users" element={<Users />} />
                            <Route path="*" element={<Navigate to="Signin" replace />} />
                            <Route path="/Users/:uid" element={<Users />} />

                        </Routes>
                    </td>
                </tr>
            </table>
        </div>
    );
}