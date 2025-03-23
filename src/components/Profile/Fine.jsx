import { useNavigate } from "react-router-dom"
import { Navbar } from "../allPage"
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select";
import { Table, Center, Button, Box, createListCollection } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useBalanceOf, useGetUser, useGetFine, usePayFine } from "@/hooks/allHoks"

const Fine = () => {
    const { userData } = useGetUser()
    const { BalanceOf } = useBalanceOf()
    const { GetFine } = useGetFine()
    const { PayFine } = usePayFine()

    const [selectPay, setSelecetNoPat] = useState("noPay")
    const [allNoPayFine, setAllNoPayFine] = useState()
    const [allPayFine, setAllPayFine] = useState()
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
            setAllNoPayFine(JSON.parse(result.noPay))
            setAllPayFine(result.yesPay)
        }

        fetchFines()
    }, [userData, navigate])

    async function RerenderData() {
        var result = await GetFine(userData)
        var balance = await BalanceOf(userData)
        setBalance(balance)
        setAllNoPayFine(JSON.parse(result.noPay))
        setAllPayFine(result.yesPay)
    }

    function ShortID(id) {
        return `${id.slice(0, 5)}...${id.slice(id.length - 5, id.length)}`
    }

    const frameworks = createListCollection({
        items: [
            { value: "noPay", label: "No pay" },
            { value: "yesPay", label: "Pay" }
        ],
    });

    return (
        <>
            <Navbar />
            <Center>
                <Box>
                    Balance: {!balance ? <>Loading...</> : <>{balance}$</>}
                </Box>
                &nbsp;
                <SelectRoot
                    collection={frameworks}
                    onChange={(e) => setSelecetNoPat(e.target.value)}
                    width={"200px"}
                    size="sm"
                    defaultValue={["noPay"]}
                >
                    <SelectTrigger>
                        <SelectValueText placeholder="Select status fine" />
                    </SelectTrigger>
                    <SelectContent>
                        {frameworks.items.map((car) => (
                            <SelectItem item={car} key={car.value}>
                                {car.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </Center>
            <Center>
                <Table.ScrollArea width={"90vw"} borderWidth={"1px"} marginTop={"20px"} borderRadius={"10px"}>
                    <Table.Root variant="outline" interactive>
                        <Table.Header >
                            <Table.Row>
                                <Table.ColumnHeader textAlign={"center"}>Ind</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>ID</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Car</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Price</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Reason</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Date</Table.ColumnHeader>
                                {selectPay === "noPay" ?
                                    <Table.ColumnHeader textAlign={"center"}>Pay</Table.ColumnHeader>
                                    :
                                    <Table.ColumnHeader textAlign={"center"}>Date pay</Table.ColumnHeader>
                                }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {selectPay === "noPay" ?
                                allNoPayFine?.map((item, i) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell textAlign={"center"}>{i + 1}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{ShortID(item?.id.toString())}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.car}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.price}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.reason}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.date}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>
                                            <Button
                                                onClick={async () => {
                                                    await PayFine(userData?.id.toString(), userData?.status, item?.id, item?.car, item?.price, item?.reason, item?.date, Date.now());
                                                    RerenderData()
                                                }
                                                }>Pay</Button></Table.Cell>
                                    </Table.Row>
                                ))
                                :
                                allPayFine?.map((item, i) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell textAlign={"center"}>{i + 1}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{ShortID(item?.id_fine.toString())}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.car}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.price}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{item?.reason}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{new Date(item?.date).getDate() + '/' + (new Date(item?.date).getMonth() + 1) + '/' + new Date(item?.date).getFullYear()}</Table.Cell>
                                        <Table.Cell textAlign={"center"}>{new Date(item?.date_pay).getDate() + '/' + (new Date(item?.date_pay).getMonth() + 1) + '/' + new Date(item?.date_pay).getFullYear()}</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Center >
        </>
    )
}

export default Fine