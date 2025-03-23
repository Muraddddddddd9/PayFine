import { Box, Flex, Input, Button, Link, Text, For } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { Field } from "@/components/ui/field"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useLogin } from "@/hooks/allHoks"
import { ThemeToggle } from "@/components/allPage"

const Login = () => {
    const { LoginRequest } = useLogin()

    const [dataLogin, setDataLogin] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const session_key = localStorage.getItem("session_key")
        if (session_key) {
            navigate("/profile")
        }
    }, [])

    const handlingInput = (e, obj) => {
        setDataLogin(prevState => ({
            ...prevState,
            [obj]: e.target.value,
        }));
    }

    return (
        <Box
            display={"flex"} margin={"auto"}
            justifyContent={"center"} alignItems={"center"}
            textAlign={"center"} width={"100vw"}
            height={"100vh"}
        >
            <Box
                width={"25vw"} minWidth={"200px"}
            >
                <ThemeToggle />
                <Flex
                    justifyContent={"center"} marginBottom={"35px"}
                >
                    <svg width="30" height="30" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 20.0001H19M2 17.0001H18M4 17.0001V12.0001M8 17.0001V12.0001M12 17.0001V12.0001M16 17.0001V12.0001M10 6.00695L10.0074 6.00022M19 9.0001L12.126 2.88986C11.3737 2.2212 10.9976 1.88688 10.5732 1.75991C10.1992 1.64806 9.8008 1.64806 9.4268 1.75991C9.0024 1.88688 8.6263 2.2212 7.87404 2.88986L1 9.0001H19Z" stroke="teal" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Text
                        color={"var(--color-textMain)"}
                        marginRight={"15px"} marginLeft={"5px"}
                        fontWeight={"bold"} userSelect={"none"}
                    >
                        PayFine
                    </Text>
                </Flex>

                <Text fontSize={"30px"} fontWeight={"bold"}>
                    Welcome back
                </Text>
                <Text marginBottom={"35px"} color={"var(--color-textDescription)"}>
                    Start using PayFine to pay for fines
                </Text>

                <For each={[
                    { id: 1, label: "Email", input: Input, labelJSON: "email" },
                    { id: 2, label: "Password", input: PasswordInput, labelJSON: "password" },
                    { id: 3, label: "Password Confirm", input: PasswordInput, labelJSON: "password_confirm" }
                ]} >
                    {(item) =>
                        <Field key={item.id} label={item.label} required marginBottom={"20px"}>
                            <item.input
                                _focus={{ border: "2px solid var(--input-focus-border)", outline: "none" }}
                                onChange={(e) => handlingInput(e, item.labelJSON)}
                            />
                        </Field>
                    }
                </For>

                <Button
                    background={"var(--button-background)"} color={"var(--color-text-button)"}
                    width={"100%"} marginBottom={"20px"}
                    onClick={() => LoginRequest(dataLogin)}
                >
                    Login
                </Button>

                <Text fontSize={"13px"} color={"var(--color-textDescription)"}>
                    Don't have an account? &nbsp;
                    <Link
                        color={"var(--color-textLink)"} variant={"underline"}
                        onClick={() => navigate("/register")}
                    >Sign Up</Link>
                </Text>
            </Box>
        </Box>
    )
}

export default Login