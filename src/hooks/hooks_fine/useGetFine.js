import { URL_API } from "@/components/allPage"

const useGetFine = () => {
    const GetFine = async (userData) => {
        const car = userData?.number_car
        const status = userData?.status

        if (car === undefined || status === undefined) {
            return null
        }

        try {
            const respones = await fetch(`${URL_API}/getFine/${car}/${status}`, {
                method: "GET",
            })

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData.message || 'Something went wrong')
            }

            const data = await respones.json()
            return { noPay: data.data.userData, yesPay: data.payFines }
        } catch (err) {
            console.log(err.message)
        }
    }

    return { GetFine }
}

export default useGetFine