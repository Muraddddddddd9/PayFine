import { URL_API } from "@/components/importPage"
import { toast } from "react-toastify"

const useDeleteCar = () => {

    const DeleteCarRequest = async (number) => {
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/deleteCar/${number}/${session_key}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || "Something went wrong")
            }

            const data = await response.json()
            toast.success(data.message)
        } catch (err) {
            toast.error(err.message)
            localStorage.clear("session_key")
            localStorage.clear("walletUser")
        }
    }

    return { DeleteCarRequest }
}

export default useDeleteCar