import { useEffect, useState } from "react"

const useGetUTC = () => {
    const [dateUTC, setDateUTC] = useState({})

    useEffect(() => {
        GetDate()
    }, [])

    const GetDate = async () => {
        try {
            const respones = await fetch("https://www.timeapi.io/api/time/current/zone?timeZone=UTC")

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData)
            }

            const date = await respones.json()
            setDateUTC(date)
        } catch (err) {
            console.log(err)
        }
    }

    return { dateUTC }
}

export default useGetUTC