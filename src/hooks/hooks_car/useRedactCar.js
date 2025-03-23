import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"
import { useGetUTC } from "../allHoks";

function ChechValDate(date, dateUTC) {
    var yearDiff = new Date(date).getFullYear() - dateUTC?.year;
    var monthDiff = new Date(date).getMonth() - (dateUTC?.month - 1);
    var dayDiff = new Date(date).getDate() - dateUTC?.day;

    if (yearDiff < 0 || yearDiff > 10) {
        return false;
    } else if (yearDiff === 0) {
        if (monthDiff < 0) {
            return false;
        } else if (monthDiff === 0) {
            if (dayDiff < 0) {
                return false;
            }
        }
    }

    return true
}

const useRedactCar = () => {
    const { dateUTC } = useGetUTC()

    const RedactCar = async (labelData, newData) => {
        if (labelData === "validity_period" || labelData === "service_life") {
            const validityDate = new Date(newData).getTime();
            var checkRes = ChechValDate(validityDate, dateUTC)
            if (!checkRes) {
                toast.warn("Invalid input date");
                return false
            }

            newData = validityDate
            console.log(labelData, newData, checkRes)
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
            return true
        } catch (err) {
            toast.error(err.message)
            return false
        }
    }

    return { RedactCar }
}

export default useRedactCar