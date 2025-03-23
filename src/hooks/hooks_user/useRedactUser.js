import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"

const useRedactUser = () => {
    const RedactUser = async (labelData, newData) => {
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/redactUser/${session_key}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ label_data: labelData, new_data: newData })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            const data = await response.json()
            toast.success(data.message)
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { RedactUser }
}

export default useRedactUser