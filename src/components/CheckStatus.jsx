import { useDataUser } from "@/fetchRequest/allFetch"
import { useParams } from "react-router-dom"
import { DPS, PageNotFound } from "./importPage"

const CheckStatus = () => {
    const { userData } = useDataUser()

    const { page_only_status } = useParams()

    if (!userData) {
        return null
    }

    return (
        <>
            {page_only_status === "dps_panel" && userData?.status === "dps" ? (
                <DPS />
            ) : (
                <PageNotFound />
            )}
        </>
    )
}

export default CheckStatus