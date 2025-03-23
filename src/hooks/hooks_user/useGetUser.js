import { URL_API } from "@/components/allPage"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetCar } from "../allHoks"

const useGetUser = () => {
    const { GetUserCar } = useGetCar()

    const [userData, setUserData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        GetUser()
    }, [])

    const GetUser = async () => {
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
            if (data?.dataUser?.number_car && data?.dataUser?.number_car !== "none") {
                await GetUserCar()
            }
        } catch (err) {
            toast.error(err.message)
            navigate('/')
            localStorage.removeItem("session_key")
        }
    }

    return { userData, GetUser }
}

export default useGetUser