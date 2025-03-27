import { URL_API } from "@/components/allPage"
import { toast } from "react-toastify"
import { useGetUTC } from "../allHoks"

function ChechValDate(date, dateUTC) {
    var yearDiff = date.getFullYear() - dateUTC?.year;
    var monthDiff = date.getMonth() - (dateUTC?.month - 1);
    var dayDiff = date.getDate() - dateUTC?.day;

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

const useCreateCar = () => {
    const { dateUTC } = useGetUTC()

    const CreateCar = async (carData) => {
        var newCar = {
            number: carData.number,
            validity_period: new Date(carData.validity_period).getTime(),
            category: carData.category,
            price: Number(carData.price),
            service_life: new Date(carData.service_life).getTime()
        }

        if (Object.keys(carData).length !== Object.keys(newCar).length) {
            toast.error(`Not all fields are filled in`);
            return false;
        }

        if ((newCar.number).length !== 6) {
            toast.error("The number length most be six!")
            return
        }

        const checkChar = /^[ABEKMHOPCTYX]+$/
        const checkNum = /^[0-9]+$/
        for (let i = 0; i < (newCar.number).length; i++) {
            if (i === 0 || i === 4 || i === 5) {
                if (!checkChar.test(newCar.number[i])) {
                    toast.error("Invalid input number car")
                    return
                }
            } else {
                if (!checkNum.test(newCar.number[i])) {
                    toast.error("Invalid input number car")
                    return
                }
            }
        }

        const checkCategory = /^(A|B|C|D|BE|CE|DE|TM|TB|M|A1|B1)$/;
        if (!checkCategory.test(newCar.category)) {
            toast.error("Invalud input category")
            return
        }
        
        if (newCar.validity_period < 0 || newCar.service_life < 0) {
            toast.error(`Invalid input date`);
            return false
        }

        const validityDate = new Date(newCar.validity_period);
        var checkRes = ChechValDate(validityDate, dateUTC)
        if (!checkRes) {
            toast.warn("Invalid input date");
            return false
        }

        const serviceLife = new Date(newCar.service_life);
        checkRes = ChechValDate(serviceLife, dateUTC)
        if (!checkRes) {
            toast.warn("Invalid input date");
            return false
        }

        const session_key = localStorage.getItem("session_key")
        try {
            const response = await fetch(`${URL_API}/createCar/${session_key}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCar)
            })

            if (!response.ok) {
                var errData = await response.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            var data = await response.json()
            toast.success(data.message)
            return true
        } catch (err) {
            toast.error(err.message)
            return false
        }
    }

    return { CreateCar }
}


export default useCreateCar
