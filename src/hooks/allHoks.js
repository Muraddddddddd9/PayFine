// Hooks User
import useLogin from "./hooks_user/useLogin";
import useRegister from "./hooks_user/useRegister";
import useGetUser from "./hooks_user/useGetUser";
import useRedactUser from "./hooks_user/useRedactUser";
import usePushStatus from "./hooks_user/usePushStatus";

// Hooks Car
import useCreateCar from "./hooks_car/useCreateCar";
import useDeleteCar from "./hooks_car/useDeleteCar";
import useGetAllCar from "./hooks_car/useGetAllCar";
import useGetCar from "./hooks_car/useGetCar";
import useRedactCar from "./hooks_car/useRedactCar";

// Hooks Fine
import useBalanceOf from "./hooks_fine/useBalanceOf";
import useGetFine from "./hooks_fine/useGetFine";
import usePayFine from "./hooks_fine/usePayFine";
import useSendFine from "./hooks_fine/useSendFine";

// Hooks Util
import useGetUTC from "./hooks_util/useGetUTC";

export {
    useLogin,
    useRegister,
    useGetUser,
    useRedactUser,
    usePushStatus,

    useCreateCar,
    useDeleteCar,
    useGetAllCar,
    useGetCar,
    useRedactCar,

    useBalanceOf,
    useGetFine,
    usePayFine,
    useSendFine,

    useGetUTC
}