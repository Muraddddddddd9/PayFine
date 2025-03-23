import { URL_API } from "@/components/allPage"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogin = () => {
    const navigate = useNavigate()

    const LoginRequest = async (dataLogin) => {
        if (dataLogin.email === "" || dataLogin.password === "" || dataLogin.password_confirm === "") {
            toast.warn("Enter all the input fields")
            return
        }

        if (dataLogin.password !== dataLogin.password_confirm) {
            toast.warn("Password is not confirm")
            return
        }

        dataLogin.email = dataLogin.email.toLowerCase()

        try {
            const response = await fetch(`${URL_API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataLogin)
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            const data = await response.json()
            toast.success(`${data.message}`)
            localStorage.setItem("session_key", data.token)
            navigate("/profile")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { LoginRequest }
}

export default useLogin