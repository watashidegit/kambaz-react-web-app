import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";
import { Form, Button, Container } from "react-bootstrap";
import { UserType } from "./types";

export default function Signup() {
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signup = () => {
        if (!newUser.username || !newUser.password) {
            alert("Please enter both username and password.");
            return;
        }

        const existingUser = db.users.find((u: UserType) => u.username === newUser.username);
        if (existingUser) {
            alert("Username already exists. Please choose another one.");
            return;
        }

        const user: UserType = {
            _id: Date.now().toString(),
            username: newUser.username,
            password: newUser.password,
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            role: "STUDENT",
            loginId: Date.now().toString(), // Or any default value
            section: "",
            lastActivity: new Date().toISOString(),
            totalActivity: "0"
        };

        db.users.push(user);
        dispatch(setCurrentUser(user));
        navigate("/Kambaz/Dashboard");
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <div className="w-25">
                <h2 className="text-center">Signup</h2>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) =>
                                setNewUser((prev) => ({ ...prev, username: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) =>
                                setNewUser((prev) => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Button variant="primary" className="w-100" onClick={signup}>
                        Sign up
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <Link to="/Kambaz/Account/Signin">Already have an account? Sign in</Link>
                </div>
            </div>
        </Container>
    );
}