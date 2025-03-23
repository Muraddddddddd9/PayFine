import { URL_API } from "@/components/allPage"

const useBalanceOf = () => {
    const BalanceOf = async (userData) => {
        const id = userData?.id
        const status = userData?.status

        if (id === undefined || status === undefined) {
            return null
        }

        try {
            const respones = await fetch(`${URL_API}/balanceOf/${id}/${status}`, {
                method: "GET",
            })

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData.message || 'Something went wrong')
            }
            const data = await respones.json()
            return data.balance.balance
        } catch (err) {
            console.log(err.message)
        }
    }

    return { BalanceOf }
}

export default useBalanceOf 