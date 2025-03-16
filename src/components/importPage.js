import { lazy } from 'react';

const Login = lazy(() => import("./Login.jsx"));
const Register = lazy(() => import("./Register.jsx"));
const InputPin = lazy(() => import("./InputPin.jsx"));

const Navbar = lazy(() => import("./Navbar"))

const Profile = lazy(() => import("./Profile.jsx"));
const Fine = lazy(() => import("./Fine.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));

const CheckStatus = lazy(() => import("./CheckStatus.jsx"))

const DPS = lazy(() => import("./DPS.jsx"))
const PageNotFound = lazy(() => import("./PageNotFound.jsx"))

const URL_API = "http://localhost:8080"

export {
    URL_API,

    Login,
    Register,
    InputPin,

    Navbar,

    Profile,
    Fine,
    Contact,

    CheckStatus,

    DPS,
    PageNotFound
}