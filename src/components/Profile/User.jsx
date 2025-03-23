import { Box, Center, Flex, Grid, Editable, IconButton, Button } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { StatLabel, StatRoot, StatValueText, StatValueUnit } from "@/components/ui/stat";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

import { useRedactUser } from "@/hooks/allHoks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../allPage";
import Car from "./Car"

const User = ({ userData, carData, setRerenderData }) => {
    const { RedactUser } = useRedactUser();

    const [isUser, setIsUser] = useState(userData || {});
    const [isCar, setIsCar] = useState(carData || {});
    const [labelData, setLabelData] = useState("");
    const [newData, setNewData] = useState("");
    const [licenseValidity, setLicenseValidity] = useState({ year: 0, month: 0, day: 0 });

    const navigate = useNavigate();

    useEffect(() => {
        const session_key = localStorage.getItem("session_key");
        if (!session_key) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        setIsUser(userData || {});
        setIsCar(carData || {});
    }, [userData, carData]);

    useEffect(() => {
        if (isCar?.validity_period) {
            startTimer(isCar.validity_period);
        } else {
            setLicenseValidity({
                year: 0,
                month: 0,
                day: 0
            });
        }
    }, [isCar?.validity_period]);

    const dataUser = [
        { id: 1, label: "Name", disabled: false, value: userData?.name },
        { id: 2, label: "Surname", disabled: false, value: userData?.surname },
        { id: 3, label: "Patronymic", disabled: false, value: userData?.patronymic },
        { id: 4, label: "Email", disabled: true, value: ShortEmail(userData?.email) }
    ];

    if (!userData || dataUser.some(item => item.value === undefined)) {
        return <Loading />;
    }

    function ShortEmail(text) {
        if (!text) return "";
        text = text.split("@");
        return `${text[0].slice(0, 5)}...${text[0].slice(text[0].length - 3, text[0].length)}`;
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

    return (
        <>
            <Center>
                <Box>
                    <Flex
                        wrap="wrap"
                        direction={{ base: "column", md: "row" }}
                        alignItems="center"
                        gap={4}
                    >
                        <Avatar
                            name={`${isUser?.name?.[0] || ""} ${isUser?.surname?.[0] || ""}`}
                            width={{ base: "20vw", md: "7vw" }}
                            height={{ base: "20vw", md: "7vw" }}
                        />

                        <DataListRoot orientation="vertical">
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                                gap={4}
                            >
                                {dataUser?.map((item) => (
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
                                                            RedactUser(labelData, newData);
                                                            setLabelData("");
                                                            setNewData("");
                                                        }} />
                                                    </IconButton>
                                                </Editable.SubmitTrigger>
                                            </Editable.Control>
                                        </Editable.Root>
                                    </DataListItem>
                                ))}
                                <Car carData={carData} setRerenderData={setRerenderData} />
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
                            <StatValueText>{isUser?.number_fines}</StatValueText>
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
                                value={isUser?.spent_fines}
                                formatOptions={{ style: "currency", currency: "USD" }}
                            />
                        </StatRoot>
                    </Grid>
                    {isUser?.status === "dps" ?
                        <Button width={"100%"} onClick={() => navigate("/dps_panel")}>Go to DPS panel</Button>
                        :
                        <></>
                    }
                </Box>
            </Center>
        </>
    );
};

export default User;