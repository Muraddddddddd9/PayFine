import { Box, Center, Flex, Editable, Button, IconButton } from "@chakra-ui/react";
import {
    DrawerActionTrigger, DrawerBackdrop, DrawerBody, DrawerCloseTrigger,
    DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger
} from "@/components/ui/drawer";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";

import { useCreateCar, useDeleteCar, useRedactCar } from "@/hooks/allHoks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuCheck, LuPencilLine } from "react-icons/lu";

const BodyHasCar = ({ carData, handelRedactCar }) => {
    const [labelData, setLabelData] = useState("")
    const [newData, setNewData] = useState("")

    function formatTimestampToDate(timestamp) {
        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            return "";
        }
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    }

    const dataCarUser = [
        { id: 1, label: "Number", labelJSON: "number", type: "text", disabled: true, value: carData?.number?.toString() },
        { id: 2, label: "Validity period (UTC)", labelJSON: "validity_period", type: "date", disabled: false, value: formatTimestampToDate(carData?.validity_period)?.toString() },
        { id: 3, label: "Category", labelJSON: "category", type: "text", disabled: false, value: carData?.category?.toString() },
        { id: 4, label: "Price", labelJSON: "price", type: "number", disabled: false, value: carData?.price?.toString() },
        { id: 5, label: "Service life (UTC)", labelJSON: "service_life", type: "date", disabled: false, value: formatTimestampToDate(carData?.service_life)?.toString() }
    ]

    return (
        dataCarUser?.map((item) => (
            <DataListItem label={item.label} key={item.id}
                info={item.labelJSON === "validity_period" || item.labelJSON === "service_life" ? "This period should not exceed 10 years." : null}
            >
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
                                    handelRedactCar(labelData, newData);
                                    setLabelData("");
                                    setNewData("");
                                }} />
                            </IconButton>
                        </Editable.SubmitTrigger>
                    </Editable.Control>
                </Editable.Root>
            </DataListItem>
        ))
    )
}

const BodyNoneCar = ({ setNewCar }) => {
    function handlingInput(e, obj) {
        setNewCar((dataValue) => ({
            ...dataValue,
            [obj]: e.target.value
        }));
    }

    const noneCar = [
        { id: 1, label: "Number", type: "text", labelJSON: "number" },
        { id: 2, label: "Validity period (UTC)", type: "date", labelJSON: "validity_period" },
        { id: 3, label: "Category", type: "text", labelJSON: "category" },
        { id: 4, label: "Price", type: "number", labelJSON: "price" },
        { id: 5, label: "Service life (UTC)", type: "date", labelJSON: "service_life" }
    ];

    return (
        noneCar.map((item) => (
            <DataListItem label={item.label} key={item.id}
                info={item.labelJSON === "validity_period" || item.labelJSON === "service_life" ? "This period should not exceed 10 years." : null}
            >
                <Editable.Root
                    border={"1px solid var(--color-border-content)"}
                    borderRadius={"5px"} textAlign="start"
                >
                    <Editable.Preview width={"100%"} />
                    <Editable.Input
                        type={item.type}
                        onChange={(e) => handlingInput(e, item.labelJSON)}
                    />
                </Editable.Root>
            </DataListItem>
        ))
    )
}

const Car = ({ carData, setRerenderData }) => {
    const { CreateCar } = useCreateCar()
    const { DeleteCar } = useDeleteCar()
    const { RedactCar } = useRedactCar()

    const [isCar, setIsCar] = useState(carData || {});
    const [newCar, setNewCar] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const session_key = localStorage.getItem("session_key");
        if (!session_key) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        setIsCar(carData || {});
    }, [carData]);

    const handleDeleteCar = async () => {
        const success = await DeleteCar(isCar?.number);
        if (success) {
            setIsCar({});
            setRerenderData(prev => !prev);
        }
    }

    const handelCreateCar = async () => {
        const succes = await CreateCar(newCar)
        if (succes) {
            setIsCar({});
            setRerenderData(prev => !prev);
        }
    }

    const handelRedactCar = async (labelData, newData) => {
        const succes = RedactCar(labelData, newData);
        if (succes) {
            setIsCar({});
            setRerenderData(prev => !prev);
        }
    }

    const hasCar = isCar?.number?.length > 0

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
                        <DataListRoot orientation="vertical">
                            <DataListItem label={"Number Car"} info="Click on the number">
                                <DrawerRoot>
                                    <DrawerBackdrop />
                                    <DrawerTrigger asChild>
                                        <Editable.Root>
                                            <Button background={"#00808000"} color={"var(--color-textMain)"} padding={0}>{hasCar ? isCar?.number : "Add Car"}</Button>
                                        </Editable.Root>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Car Info</DrawerTitle>
                                        </DrawerHeader>
                                        <DrawerBody>
                                            <DataListRoot orientation="horizontal">
                                                {hasCar ?
                                                    <BodyHasCar carData={isCar} handelRedactCar={handelRedactCar} />
                                                    :
                                                    <BodyNoneCar setNewCar={setNewCar} />
                                                }
                                            </DataListRoot>
                                        </DrawerBody>
                                        <DrawerFooter>
                                            {hasCar &&
                                                <Button
                                                    background={"#ff000061"} color={""}
                                                    onClick={handleDeleteCar}
                                                >Delete Car</Button>
                                            }
                                            <DrawerActionTrigger asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DrawerActionTrigger>
                                            {!hasCar &&
                                                <Button onClick={handelCreateCar}>Save</Button>
                                            }
                                        </DrawerFooter>
                                        <DrawerCloseTrigger />
                                    </DrawerContent>
                                </DrawerRoot>
                            </DataListItem>
                        </DataListRoot>
                    </Flex>
                </Box>
            </Center>
        </>
    );
};

export default Car;