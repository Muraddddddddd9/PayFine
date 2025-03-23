import { useEffect, useState } from "react";
import { Loading, Navbar } from "../allPage";
import { useNavigate } from "react-router-dom";
import { useGetCar, useGetUser } from "@/hooks/allHoks";
import User from "./User";

const Profile = () => {
    const { userData, GetUser } = useGetUser()
    const { carData, GetUserCar } = useGetCar()

    const [rerenderData, setRerenderData] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const session_key = localStorage.getItem("session_key")
        if (!session_key) {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        GetUser()
        GetUserCar()
    }, [rerenderData])

    if (!userData) {
        return <Loading />
    }

    return (
        <>
            <Navbar />
            <User userData={userData} carData={carData} setRerenderData={setRerenderData} />
        </>
    );
};

export default Profile;