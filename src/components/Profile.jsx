import { Box, Center, Flex, Grid, Editable, IconButton, Button } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
    DrawerActionTrigger, DrawerBackdrop, DrawerBody, DrawerCloseTrigger,
    DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger
} from "@/components/ui/drawer";
import { StatLabel, StatRoot, StatValueText, StatValueUnit } from "@/components/ui/stat";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

import { Navbar } from "./importPage";
import { useCreateCar, useDataUser, useDeleteCar, useRedactDataCar, useRedactDataUser } from "@/fetchRequest/allFetch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { userData, carData, GetDataUser } = useDataUser()
    const { RedactDataUserRequest } = useRedactDataUser()
    const { CreateCar } = useCreateCar()
    const { DeleteCarRequest } = useDeleteCar()
    const { RedactDataCarRequest } = useRedactDataCar()

    const [labelData, setLabelData] = useState("")
    const [newData, setNewData] = useState("")
    const [newCarData, setNewCarData] = useState({})
    const [fetchData, setFetchData] = useState(false)

    const [licenseValidity, setLicenseValidity] = useState({ year: 0, month: 0, day: 0 })

    const navigate = useNavigate()

    useEffect(() => {
        GetDataUser()
    }, [fetchData])

    useEffect(() => {
        const session_key = localStorage.getItem("session_key");
        if (!session_key) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (carData?.validity_period) {
            startTimer(carData.validity_period);
        } else {
            setLicenseValidity({
                year: 0,
                month: 0,
                day: 0
            });
        }
    }, [carData?.validity_period]);

    const handleAddCar = async () => {
        await CreateCar(newCarData);
        setFetchData((prev) => !prev);
    };

    function ShortEmail(text) {
        text = text.split("@")
        return `${text[0].slice(0, 5)}...${text[0].slice(text[0].length - 3, text[0].length)}`
    }

    function handlingInput(e, obj) {
        setNewCarData((dataValue) => ({
            ...dataValue,
            [obj]: e.target.value
        }));
    }

    if (!userData) {
        return null
    }

    const hasCar = userData?.number_car && userData.number_car !== "none";

    const dataUser = [
        { id: 1, label: "Name", disabled: false, value: userData?.name },
        { id: 2, label: "Surname", disabled: false, value: userData?.surname },
        { id: 3, label: "Patronymic", disabled: false, value: userData?.patronymic },
        { id: 4, label: "Email", disabled: true, value: ShortEmail(userData?.email) }
    ];

    function formatTimestampToDate(timestamp) {
        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            return "";
        }
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    }

    function startTimer(timestamp) {
        const now = new Date();
        const targetDate = new Date(timestamp);

        if (targetDate <= now) {
            setLicenseValidity({
                year: 0,
                month: 0,
                day: 0
            });
            return;
        }
        let years = targetDate.getFullYear() - now.getFullYear();
        let months = targetDate.getMonth() - now.getMonth();
        let days = targetDate.getDate() - now.getDate();
        if (days < 0) {
            months -= 1;
            const previousMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        setLicenseValidity({
            year: years,
            month: months,
            day: days
        });
    }

    const dataCarUser = hasCar ? [
        { id: 1, label: "Number", labelJSON: "number", type: "text", disabled: true, value: carData?.number?.toString() },
        { id: 2, label: "Validity period", labelJSON: "validity_period", type: "date", disabled: false, value: formatTimestampToDate(carData?.validity_period)?.toString() },
        { id: 3, label: "Category", labelJSON: "category", type: "text", disabled: false, value: carData?.category?.toString() },
        { id: 4, label: "Price", labelJSON: "price", type: "number", disabled: false, value: carData?.price?.toString() },
        { id: 5, label: "Service life", labelJSON: "service_life", type: "date", disabled: false, value: formatTimestampToDate(carData?.service_life)?.toString() }
    ] : [];

    const noneCar = [
        { id: 1, label: "Number", type: "text", labelJSON: "number" },
        { id: 2, label: "Validity period", type: "date", labelJSON: "validity_period" },
        { id: 3, label: "Category", type: "text", labelJSON: "category" },
        { id: 4, label: "Price", type: "number", labelJSON: "price" },
        { id: 5, label: "Service life", type: "date", labelJSON: "service_life" }
    ];

    return (
        <>
            <Navbar />
            <Center>
                <Box>
                    <Flex
                        wrap="wrap"
                        direction={{ base: "column", md: "row" }}
                        alignItems="center"
                        gap={4}
                    >
                        <Avatar name={`${userData?.name[0]} ${userData?.surname[0]}`} width={{ base: "20vw", md: "7vw" }} height={{ base: "20vw", md: "7vw" }} />

                        <DataListRoot orientation="vertical">
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                                gap={4}
                            >
                                {dataUser.map((item) => (
                                    <DataListItem label={item.label} key={item.id}>
                                        <Editable.Root
                                            disabled={item.disabled}
                                            defaultValue={item.value}
                                        >
                                            <Editable.Preview
                                                opacity={item.disabled ? 0.5 : 1}
                                                cursor={item.disabled ? "not-allowed" : "pointer"}
                                            />
                                            <Editable.Input onChange={(e) => {
                                                setLabelData(item.label);
                                                setNewData(e.target.value);
                                            }} />
                                            <Editable.Control>
                                                <Editable.EditTrigger asChild>
                                                    <IconButton variant="ghost" size="xs">
                                                        <LuPencilLine />
                                                    </IconButton>
                                                </Editable.EditTrigger>
                                                <Editable.CancelTrigger asChild>
                                                    <IconButton variant="outline" size="xs">
                                                        <LuX />
                                                    </IconButton>
                                                </Editable.CancelTrigger>
                                                <Editable.SubmitTrigger asChild>
                                                    <IconButton variant="outline" size="xs">
                                                        <LuCheck onClick={() => {
                                                            RedactDataUserRequest(labelData, newData);
                                                            setLabelData("");
                                                            setNewData("");
                                                        }} />
                                                    </IconButton>
                                                </Editable.SubmitTrigger>
                                            </Editable.Control>
                                        </Editable.Root>
                                    </DataListItem>
                                ))}

                                {hasCar ? (
                                    <DataListItem label={"Number Car"} info="Click on the number">
                                        <DrawerRoot>
                                            <DrawerBackdrop />
                                            <DrawerTrigger asChild>
                                                <Editable.Root>
                                                    <Button background={"#00808000"} color={"var(--color-textMain)"} padding={0}>{userData?.number_car}</Button>
                                                </Editable.Root>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>Car Info</DrawerTitle>
                                                </DrawerHeader>
                                                <DrawerBody>
                                                    <DataListRoot orientation="horizontal">
                                                        {dataCarUser.map((item) => (
                                                            <DataListItem label={item.label} key={item.id}>
                                                                <Editable.Root disabled={item.disabled} defaultValue={item.value} borderRadius={"5px"} textAlign="start">
                                                                    <Editable.Preview width={"100px"} />
                                                                    <Editable.Input
                                                                        width={"100px"} type={item.type}
                                                                        onChange={(e) => {
                                                                            setLabelData(item.labelJSON);
                                                                            setNewData(e.target.value);
                                                                        }}
                                                                    />
                                                                    <Editable.Control>
                                                                        <Editable.EditTrigger asChild>
                                                                            <IconButton variant="ghost" size="xs">
                                                                                <LuPencilLine />
                                                                            </IconButton>
                                                                        </Editable.EditTrigger>
                                                                        <Editable.SubmitTrigger asChild>
                                                                            <IconButton variant="outline" size="xs">
                                                                                <LuCheck onClick={() => {
                                                                                    RedactDataCarRequest(labelData, newData);
                                                                                    setLabelData("");
                                                                                    setNewData("");
                                                                                }} />
                                                                            </IconButton>
                                                                        </Editable.SubmitTrigger>
                                                                    </Editable.Control>
                                                                </Editable.Root>
                                                            </DataListItem>
                                                        ))}
                                                    </DataListRoot>
                                                </DrawerBody>
                                                <DrawerFooter>
                                                    <Button
                                                        background={"#ff000061"} color={"white"}
                                                        onClick={async () => {
                                                            await DeleteCarRequest(userData?.number_car);
                                                            setLicenseValidity({
                                                                year: 0,
                                                                month: 0,
                                                                day: 0
                                                            });
                                                            setFetchData((prev) => !prev);
                                                        }}
                                                    >Delete Car</Button>
                                                    <DrawerActionTrigger asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DrawerActionTrigger>
                                                </DrawerFooter>
                                                <DrawerCloseTrigger />
                                            </DrawerContent>
                                        </DrawerRoot>
                                    </DataListItem>
                                ) : (
                                    <DataListItem label={"Number Car"} info="Click on the number">
                                        <DrawerRoot>
                                            <DrawerBackdrop />
                                            <DrawerTrigger asChild>
                                                <Editable.Root>
                                                    <Button background={"#00808000"} color={"var(--color-textMain)"} padding={0}>Add Car</Button>
                                                </Editable.Root>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>Car Info</DrawerTitle>
                                                </DrawerHeader>
                                                <DrawerBody>
                                                    <DataListRoot orientation="horizontal" width={"200px"} >
                                                        {noneCar.map((item) => (
                                                            <DataListItem label={item.label} key={item.id}>
                                                                <Editable.Root border={"1px solid var(--color-textDescription)"} borderRadius={"5px"} textAlign="start">
                                                                    <Editable.Preview width={"100px"} />
                                                                    <Editable.Input
                                                                        width={"100px"} type={item.type}
                                                                        onChange={(e) => handlingInput(e, item.labelJSON)}
                                                                    />
                                                                </Editable.Root>
                                                            </DataListItem>
                                                        ))}
                                                    </DataListRoot>
                                                </DrawerBody>
                                                <DrawerFooter>
                                                    <DrawerActionTrigger asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DrawerActionTrigger>
                                                    <Button onClick={handleAddCar}>Save</Button>
                                                </DrawerFooter>
                                                <DrawerCloseTrigger />
                                            </DrawerContent>
                                        </DrawerRoot>
                                    </DataListItem>
                                )}
                            </Grid>
                        </DataListRoot>
                    </Flex>

                    <Grid
                        marginTop={"40px"}
                        marginBottom={"20px"}
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                        gap={4}
                    >
                        <StatRoot alignItems={"center"}>
                            <StatLabel>Number of fines all time</StatLabel>
                            <StatValueText>{userData?.number_fines}</StatValueText>
                        </StatRoot>
                        <StatRoot alignItems={"center"}>
                            <StatLabel>Driver's license validity</StatLabel>
                            <StatValueText alignItems="baseline">
                                {licenseValidity.year} <StatValueUnit>year</StatValueUnit>
                                {licenseValidity.month} <StatValueUnit>month</StatValueUnit>
                                {licenseValidity.day} <StatValueUnit>day</StatValueUnit>
                            </StatValueText>
                        </StatRoot>
                        <StatRoot alignItems={"center"}>
                            <StatLabel>Spent on fines</StatLabel>
                            <StatValueText
                                value={userData?.spent_fines}
                                formatOptions={{ style: "currency", currency: "USD" }}
                            />
                        </StatRoot>
                    </Grid>
                    {userData?.status === "dps" ?
                        <Button width={"100%"} onClick={() => navigate("/dps_panel")}>Go to DPS panel</Button>
                        :
                        <></>
                    }
                </Box>
            </Center>
        </>
    );
};

export default Profile;