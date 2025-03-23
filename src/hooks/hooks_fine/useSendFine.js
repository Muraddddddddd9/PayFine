import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"
import { useGetUTC, usePushStatus } from "../allHoks"

const useSendFine = () => {
    const { dateUTC } = useGetUTC()
    const { PushStatusNumberOfFines } = usePushStatus()

    const SendFine = async (dataFine, status) => {
        const fineNew = {
            car: dataFine.car,
            price: Number(dataFine.price),
            reason: dataFine.reason,
            date: dataFine.date,
            status: status
        }

        const isInvalid = Object.values(fineNew).some(value => {
            if (value === null || value === undefined || value === "") {
                return true;
            }
            if (typeof value === "number" && isNaN(value)) {
                return true;
            }
            return false;
        });

        if (isInvalid) {
            toast.error("Fill in all the fields");
            return;
        }

        const fineDate = new Date(fineNew.date);
        const fineDay = fineDate.getDate();
        const fineMonth = fineDate.getMonth() + 1;
        const fineYear = fineDate.getFullYear();

        const todayDay = dateUTC.day;
        const todayMonth = dateUTC.month;
        const todayYear = dateUTC.year;

        if (
            (fineYear === todayYear && fineMonth === todayMonth && fineDay <= todayDay) ||
            (fineYear === todayYear && fineMonth === todayMonth - 1 && fineDay >= todayDay)
        ) {
            try {
                toast.info("One second...")

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
        } else {
            toast.warn("Incorrect date entry");
            return
        }
    }

    return { SendFine }
}

export default useSendFine