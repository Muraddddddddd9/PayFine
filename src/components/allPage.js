import { lazy } from "react";

const Login = lazy(() => import("./Auth/Login"));
const Register = lazy(() => import("./Auth/Register"));
const InputPin = lazy(() => import("./Auth/InputPin"));

const Profile = lazy(() => import("./Profile/Profile"));
const Fine = lazy(() => import("./Profile/Fine"));

const DPS = lazy(() => import("./Admin/DPS"));

const Navbar = lazy(() => import("./Utils/Navbar"));
const ThemeToggle = lazy(() => import("./Utils/ThemeToggle"))
const Loading = lazy(() => import("./Utils/Loading"))
const CheckStatus = lazy(() => import("./Utils/CheckStatus"))
const PageNotFound = lazy(() => import("./Utils/PageNotFound"))

const URL_API = "http://localhost:8080"

export {
    Login,
    Register,
    InputPin,

    Profile,
    Fine,
    
    DPS,

    Navbar,
    ThemeToggle,
    Loading,
    CheckStatus,
    PageNotFound,

    URL_API
}