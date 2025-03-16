import { URL_API } from "@/components/importPage";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useGetAllCar = () => {
    const [allCar, setAllCar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        GetAllCar();
    }, []);

    const GetAllCar = async () => {
        try {
            const response = await fetch(`${URL_API}/getAllCar`, {
                method: "GET"
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Something went wrong');
            }

            const data = await response.json()
            const transformedCars = data.allCar.map(item => ({
                label: item,
                value: item
            }));

            setAllCar(transformedCars);
            setIsLoading(false);
        } catch (err) {
            toast.error(`Get all car is failed: ${err.message}`);
        }
    };

    return { allCar, isLoading };
};

export default useGetAllCar;