import { authStyles as styles } from "../assets/dummystyle";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helpas";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Input } from "./Input";

const Signup = ({ setCurarentPage }) => {  // ✅ fix props
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!fullName) {
            setError("Please Enter Full Name");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            return;
        }
        if (!password) {
            setError("Please Enter Password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,   // ✅ use fullName not fullname
                email,
                password,
            });

            const { token } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                updateUser(response.data);
                navigate("/dashboard");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something Went Wrong Please Try Again"
            );
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.signupTitle}>Create Account</h3>
                <p className={styles.signupSubtitle}>
                    Join Thousands Of Professionals Today
                </p>
            </div>

            <form onSubmit={handleSignUp} className={styles.signupForm}>
                <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    label="Full Name"
                    placeholder="John Doe"
                    type="text"
                />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    placeholder="email@example.com"
                    type="email"
                />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="Min 8 Characters"
                    type="password"
                />

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type="submit" className={styles.signupSubmit}>
                    Create Account
                </button>

                <p className={styles.switchText}>
                    Already Have An Account?{" "}
                    <button
                        type="button"
                        className={styles.signupSwitchButton}
                        onClick={() => setCurrentPage("login")}
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;
