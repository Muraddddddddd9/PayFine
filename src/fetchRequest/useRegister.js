import { URL_API } from "@/components/importPage"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

const useRegister = () => {
    const navigate = useNavigate()

    const CreateEmailConfirmationRequest = async (emailUser, dataRegister) => {
        if (dataRegister.password !== dataRegister.password_confirm) {
            toast.warn("Password is not confirm")
            return
        }

        try {
            const response = await fetch(`${URL_API}/createEmailConfirmation`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailUser)
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            delete dataRegister['password_confirm']
            navigate(`/confirmation_email/${emailUser.email}`, { state: { dataRegister } })
        } catch (err) {
            toast.error(err.message)
        }
    }

    const EmailConfirmationRequest = async (dataRegisterWithPin) => {
        dataRegisterWithPin.pin = Number(dataRegisterWithPin.pin)

        try {
            const response = await fetch(`${URL_API}/createUser`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataRegisterWithPin)
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            const data = await response.json()
            toast.success(data.message)
            navigate("/")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { CreateEmailConfirmationRequest, EmailConfirmationRequest }
}

export default useRegister