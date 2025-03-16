import { URL_API } from "@/components/importPage"
import { toast } from "react-toastify"

const useCreateCar = () => {
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

    const CreateCar = async (carData) => {
        if (Object.keys(carData).length <= 0) {
            toast.error(`Not all fields are filled in`);
            return;
        }

        const emptyFields = Object.entries(carData)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            toast.error(`The following fields are not filled in: ${emptyFields.join(', ')}`);
            return;
        }

        const session_key = localStorage.getItem("session_key")
        carData.validity_period = CreateNormalDate(carData.validity_period)
        carData.service_life = CreateNormalDate(carData.service_life)
        carData.price = Number(carData.price)

        try {
            const response = await fetch(`${URL_API}/createCar/${session_key}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(carData)
            })

            if (!response.ok) {
                var errData = await response.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            var data = await response.json()
            toast.success(data.message)
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { CreateCar }
}


export default useCreateCar