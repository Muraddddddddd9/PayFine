import { URL_API } from "@/components/importPage"
import { toast } from "react-toastify"
import usePushStatus from "./usePushStatus"

const useSendFine = () => {
    const { PushStatusNumberOfFines } = usePushStatus()

    const SendFine = async (dataFine, status) => {
        const fineNew = {
            car: dataFine.car,
            price: Number(dataFine.price),
            reason: dataFine.reason,
            date: dataFine.date,
            status: status
        }

        try {
            const respones = await fetch(`${URL_API}/sendFine`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fineNew)
            })

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            const data = await respones.json()
            if (data.send === false) {
                throw new Error(data.message || 'Something went wrong')
            } else {
                toast.success(data.message)
                PushStatusNumberOfFines(dataFine.car)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { SendFine }
}

export default useSendFine