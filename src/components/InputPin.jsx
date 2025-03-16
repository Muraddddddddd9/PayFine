import { Box, Flex, Input, Button, Link, Text, For, Kbd } from "@chakra-ui/react"
import { PinInput } from "@/components/ui/pin-input"
import { useParams } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRegister } from "@/fetchRequest/allFetch";
import { useNavigate } from "react-router-dom"

const InputPin = () => {
    const { EmailConfirmationRequest } = useRegister()
    const { email } = useParams()
    const location = useLocation();
    const dataRegister = location.state?.dataRegister;

    const navigate = useNavigate()

    const [dataRegisterWithPin, setDataRegisterWithPin] = useState(dataRegister)

    useEffect(() => {
        const session_key = localStorage.getItem("session_key")
        if (session_key) {
            navigate("/profile")
        }
    })
    const handlingInput = (e) => {
        setDataRegisterWithPin((prevState) => ({
            ...prevState,
            pin: typeof e === 'string' ? e : e?.join(''),
        }));
    };

    return (
        <Box
            display={"flex"}
            margin={"auto"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
            width={"100vw"}
            height={"100vh"}
        >
            <Box
                width={"25vw"}
            >
                <Flex
                    justifyContent={"center"}
                    marginBottom={"35px"}
                >
                    <svg width="30" height="30" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 20.0001H19M2 17.0001H18M4 17.0001V12.0001M8 17.0001V12.0001M12 17.0001V12.0001M16 17.0001V12.0001M10 6.00695L10.0074 6.00022M19 9.0001L12.126 2.88986C11.3737 2.2212 10.9976 1.88688 10.5732 1.75991C10.1992 1.64806 9.8008 1.64806 9.4268 1.75991C9.0024 1.88688 8.6263 2.2212 7.87404 2.88986L1 9.0001H19Z" stroke="teal" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Text
                        color={"var(--color-textMain)"}
                        marginRight={"15px"} marginLeft={"5px"}
                        fontWeight={"bold"}
                        userSelect={"none"}
                    >
                        PayFine
                    </Text>
                </Flex>

                <Text fontSize={"30px"} fontWeight={"bold"}>
                    Email Confirmation
                </Text>
                <Text marginBottom={"35px"} color={"var(--color-textDescription)"}>
                    Go to <Kbd>{email}</Kbd> email address and enter the activation code.
                </Text>

                <PinInput marginBottom={"35px"}
                    onValueChange={(e) => handlingInput(e.value)} />

                <Button
                    background={"var(--button-background)"} color={"var(--color-textMain)"}
                    width={"100%"} marginBottom={"20px"}
                    onClick={() => EmailConfirmationRequest(dataRegisterWithPin)}
                >Confirmation</Button>
            </Box>
        </Box>
    )
}

export default InputPin