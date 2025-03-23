import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"
import { useGetFine, useGetUser } from "../allHoks"

const useDeleteCar = () => {
    const { userData } = useGetUser()
    const { GetFine } = useGetFine()

    const DeleteCar = async (number) => {
        const session_key = localStorage.getItem("session_key")
        const noPay = await GetFine(userData)

        if (JSON.parse(noPay.noPay).length !== 0) {
            toast.warn("Pay all fines")
            return
        }

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
            return true
        } catch (err) {
            toast.error(err.message)
            return false
        }
    }

    return { DeleteCar }
}

export default useDeleteCar