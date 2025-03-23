import { URL_API } from "@/components/allPage"
import { useEffect, useState } from "react"

const useGetCar = () => {
    const [carData, setCarData] = useState([])

    useEffect(() => {
        GetUserCar()
    }, [])

    const GetUserCar = async () => {
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/getCar/${session_key}`, {
                method: "GET",
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            var data = await response.json()
            setCarData(data.dataCar)
        } catch (err) {
            console.log("Get car: ", err)
        }
    }

    return { carData, GetUserCar }
}

export default useGetCar