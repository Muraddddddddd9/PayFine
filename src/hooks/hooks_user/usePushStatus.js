import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"

const usePushStatus = () => {
    const PushStatusNumberOfFines = async (car) => {
        try {
            const response = await fetch(`${URL_API}/pushStatusNumberOfFines/${car}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || "Something went wrong ")
            }

        } catch (err) {
            toast.error(`Add fine to number of fines in databese is failed: ${err.message}`)
        }
    }

    const PushStatusPay = async (car, amount) => {
        try {
            const response = await fetch(`${URL_API}/pushStatusPay`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ car: car, amount: amount })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || "Something went wrong ")
            }
        } catch (err) {
            toast.error(`Add amount USD to spent of fines in databese is failed: ${err.message}`)
        }
    }

    return { PushStatusNumberOfFines, PushStatusPay }
}

export default usePushStatus