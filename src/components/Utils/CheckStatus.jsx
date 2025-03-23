import { useGetUser } from "@/hooks/allHoks"
import { useParams } from "react-router-dom"
import { DPS, Loading, PageNotFound } from "../allPage"

const CheckStatus = () => {
    const { userData } = useGetUser()

    const { page_only_status } = useParams()

    if (!userData || userData?.status === undefined) {
        return <Loading />
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