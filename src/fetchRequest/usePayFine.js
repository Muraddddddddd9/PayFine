import { URL_API } from "@/components/importPage"
import { toast } from "react-toastify"
import usePushStatus from "./usePushStatus"

const usePayFine = () => {
    const { PushStatusPay } = usePushStatus()

    const PayFine = async (idFine, from, status, car, price) => {
        const payData = {
            idFine: idFine,
            from: from,
            status: status,
        }

        try {
            const respones = await fetch(`${URL_API}/transfer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payData)
            })

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            const data = await respones.json()
            if (data.result === false) {
                throw new Error(data.message || 'Something went wrong')
            } else {
                toast.success(data.message)
                PushStatusPay(car, price)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { PayFine }
}

export default usePayFine