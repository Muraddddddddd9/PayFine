import { URL_API } from "@/components/importPage"
import { toast } from "react-toastify"

const useRedactDataCar = () => {

    function CreateNormalDate(dateStr) {
        const date = new Date(dateStr);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        return DefTimeToTimeStamp(formattedDate)
    }

    function DefTimeToTimeStamp(defTime) {
        const newDate = defTime.split("-");

        return new Date(newDate[0], newDate[1] - 1, newDate[2]).getTime();
    }

    const RedactDataCarRequest = async (labelData, newData) => {
        if (labelData === "validity_period" || labelData === "service_life") {
            newData = CreateNormalDate(newData)
        }
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/redactCar/${session_key}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ label_data: labelData, new_data: newData })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || "Something went wrong")
            }

            const data = await response.json()
            toast.success(data.message)
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { RedactDataCarRequest }
}

export default useRedactDataCar