import { URL_API } from "@/components/importPage"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const useDataUser = () => {
    const [userData, setUserData] = useState(null)
    const [carData, setCarData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        GetDataUser()
    }, [])

    const GetDataUser = useCallback(async () => {
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/getUser/${session_key}`, {
                method: "GET",
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            var data = await response.json()
            setUserData(data.dataUser)
            if (data.dataUser?.number_car && data.dataUser.number_car !== "none") {
                GetDataUserCar()
            }
        } catch (err) {
            toast.error(err.message)
            navigate('/')
            localStorage.removeItem("session_key")
            localStorage.removeItem("walletUser")
        }
    }, [])

    const GetDataUserCar = useCallback(async () => {
        const session_key = localStorage.getItem("session_key")

        try {
            const response = await fetch(`${URL_API}/getCar/${session_key}`, {
                method: "GET",
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errorData.message || 'Something went wrong');
            }

            var data = await response.json()
            setCarData(data.dataCar)
        } catch (err) {
            toast.error(err.message)
            navigate('/')
        }
    }, [])

    return { userData, carData, GetDataUser, GetDataUserCar }
}

export default useDataUser