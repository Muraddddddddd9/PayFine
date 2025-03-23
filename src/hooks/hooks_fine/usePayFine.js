import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"
import {usePushStatus} from "@/hooks/allHoks"

const usePayFine = () => {
    const { PushStatusPay } = usePushStatus()

    const PayFine = async (from, status, idFine, car, price, reason, date, date_pay) => {
        toast.info("One second...")

        const payData = {
            from: from,
            status: status,
            id_fine: idFine,
            car: car,
            price: price,
            reason: reason,
            date: new Date(date).getTime(),
            date_pay: date_pay,
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