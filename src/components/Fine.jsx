import { useNavigate } from "react-router-dom"
import { Navbar } from "./importPage"
import { Table, Center, Button, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useBalanceOf, useDataUser, useGetFine, usePayFine } from "@/fetchRequest/allFetch"

const Fine = () => {
    const { userData } = useDataUser()
    const { BalanceOf } = useBalanceOf()
    const { GetFine } = useGetFine()
    const { PayFine } = usePayFine()
    const [allFine, setAllFine] = useState()
    const [balance, setBalance] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchFines = async () => {
            const session_key = localStorage.getItem("session_key")
            if (!session_key) {
                navigate("/")
                return
            }
            var result = await GetFine(userData)
            var balance = await BalanceOf(userData)

            if (!result || result === undefined || result === "") {
                return
            }

            setBalance(balance)
            setAllFine(JSON.parse(result))
        }

        fetchFines()
    }, [userData, navigate])

    async function RerenderData() {
        var result = await GetFine(userData)
        var balance = await BalanceOf(userData)
        setBalance(balance)
        setAllFine(JSON.parse(result))
    }

    function ShortID(id) {
        return `${id.slice(0, 5)}...${id.slice(id.length - 5, id.length)}`
    }

    return (
        <>
            <Navbar />
            <Center>
                <Box>
                    Balance: {!balance ? <>Loading...</> : <>{balance}$</>}
                </Box>
            </Center>
            <Center>
                <Table.ScrollArea width={"90vw"} borderWidth={"1px"} marginTop={"20px"} borderRadius={"10px"}>
                    <Table.Root variant="outline" interactive>
                        <Table.Header >
                            <Table.Row>
                                <Table.ColumnHeader textAlign={"center"}>ID</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Car</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Price</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Reason</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Date</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Pay</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {allFine?.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell textAlign={"center"}>{ShortID(item?.id.toString())}</Table.Cell>
                                    <Table.Cell textAlign={"center"}>{item?.car}</Table.Cell>
                                    <Table.Cell textAlign={"center"}>{item.price}</Table.Cell>
                                    <Table.Cell textAlign={"center"}>{item?.reason}</Table.Cell>
                                    <Table.Cell textAlign={"center"}>{item?.date}</Table.Cell>
                                    <Table.Cell textAlign={"center"}>
                                        <Button
                                            onClick={async () => {
                                                await PayFine(item?.id, userData?.id.toString(), userData?.status, item?.car, item?.price);
                                                RerenderData()
                                            }
                                            }>Pay</Button></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Center >
        </>
    )
}

export default Fine