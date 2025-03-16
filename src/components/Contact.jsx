import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { QrCode } from "@/components/ui/qr-code"
import { Navbar } from "./importPage"
import { Box, Center, Text, For, Button, Link, Grid } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { SiGmail } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom"

const Phantom = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16.886 8.876a.47.47 0 0 1-.313.124H5.584c-.39 0-.587-.446-.317-.707l1.805-1.74a.46.46 0 0 1 .312-.129h11.032c.394 0 .587.45.313.712zm0 8.576a.47.47 0 0 1-.313.12H5.584c-.39 0-.587-.442-.317-.703l1.805-1.745A.45.45 0 0 1 7.384 15h11.032c.394 0 .587.446.313.707zm0-6.618a.47.47 0 0 0-.313-.12H5.584c-.39 0-.587.442-.317.703l1.805 1.745a.47.47 0 0 0 .312.124h11.032c.394 0 .587-.446.313-.707z" />
        </svg>
    )
}

const MetaMask = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 25">
            <path fill="currentColor" d="M12 4.02v6.335l5.357 2.396zm0 0l-5.357 8.73L12 10.356zm0 12.836v4.307l5.357-7.414zm0 4.307v-4.307L6.643 13.75z" />
            <path fill="currentColor" d="m12 15.858l5.357-3.107L12 10.355zm-5.357-3.107L12 15.858v-5.503z" />
            <path fill="currentColor" fillRule="evenodd" d="m12 15.858l-5.357-3.107L12 4.021l5.357 8.73zm-5-3.36l4.916-8.01v5.824zm-.073.218l4.989-2.216v5.11zm5.16-2.216v5.11l4.984-2.894zm0-.188l4.916 2.186l-4.916-8.01z" clipRule="evenodd" />
            <path fill="currentColor" fillRule="evenodd" d="m12 16.788l-5.357-3.043L12 21.162l5.357-7.418zM7.243 14.28l4.672 2.658v3.814zm4.843 2.658v3.814l4.671-6.472z" clipRule="evenodd" />
        </svg>
    )
}

const Tron = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 25">
            <path fill="currentColor" fillRule="evenodd" d="M6.6 6.8a.43.43 0 0 1 .42-.13l9.043 2.214a.4.4 0 0 1 .15.07l1.84 1.342a.43.43 0 0 1 .102.587l-6.33 9.262a.427.427 0 0 1-.758-.099L6.514 7.23A.43.43 0 0 1 6.6 6.8m1.492 2.312l3.16 8.897l.52-4.61zm4.526 4.435l-.528 4.691l4.47-6.54zm4.345-2.986l-2.88 1.352l1.93-2.044zm-1.82-1.02l-7.03-1.72l4.122 4.8z" clipRule="evenodd" />
        </svg>
    )
}

const Contact = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const session_key = localStorage.getItem("session_key")
        if (!session_key) {
            navigate("/")
        }
    }, [])

    const [selectedItem, setSelectedItem] = useState(null)

    const items = [
        { id: 1, name: "Solana", wallet: "7eDGqMmdo6ZcLcp9SAD2GVorttkQZzzY1LFszu672Bnq", svg: <Phantom /> },
        { id: 2, name: "Ethereum", wallet: "0xF9De8229F6635970c22fBDC8F61AC2faa3248765", svg: <MetaMask /> },
        { id: 3, name: "Tron", wallet: "TRfiDoNKUb9bVb88ap7WeftavxanXMuyZ3", svg: <Tron /> },
    ]

    return (
        <>
            <Navbar />
            <DialogRoot>
                <Center marginBottom={"20px"}>
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={4}
                    >
                        <Link href="https://github.com/Muraddddddddd9">
                            <FaGithub cursor={"pointer"} size={"50px"} />
                        </Link>

                        <Link href="https://mail.google.com/mail/u/0/#inbox?compose=jrjtXJTzsjtcvCDHSDSvNFPKDDFwZcJCnstQwGfkGSNPgrKCqLrVrrmwwspJBDVcrQXZrpst">
                            <SiGmail cursor={"pointer"} size={"50px"} />
                        </Link>
                    </Grid>
                </Center>
                <Center>
                    <For each={items}>
                        {item => (
                            <Box key={item.id}>

                                <Box textAlign={"center"} marginLeft={"20px"} marginRight={"20px"}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                            {item.svg}
                                            <Text>{item.name}</Text>
                                        </Button>
                                    </DialogTrigger>
                                </Box>
                            </Box>
                        )}
                    </For>
                </Center>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send a donation ({selectedItem?.name})</DialogTitle>
                    </DialogHeader>
                    <DialogBody justifyContent={"center"} display={"flex"} >
                        {selectedItem && <QrCode value={selectedItem.wallet} />}
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </>
    )
}

export default Contact