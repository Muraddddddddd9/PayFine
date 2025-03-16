import { Center, Box, Heading, Input, Button, createListCollection } from "@chakra-ui/react";
import {
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from "@/components/ui/select";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Navbar } from "./importPage";
import { useState } from "react";
import { useDataUser, useGetAllCar, useSendFine } from "@/fetchRequest/allFetch";

const DPS = () => {
	const { userData } = useDataUser()
	const { SendFine } = useSendFine()
	const { allCar, isLoading } = useGetAllCar();

	const [dataFine, setDataFine] = useState({});

	if (isLoading) {
		return (
			<Center>
			</Center>
		);
	}

	if (!allCar || allCar.length === 0) {
		return <Center>No cars available</Center>;
	}

	const frameworks = createListCollection({
		items: allCar,
	});

	const inputLable = [
		{ id: 1, lable: "Price", type: "number", jsonLalbe: "price" },
		{ id: 2, lable: "Reason", type: "text", jsonLalbe: "reason" },
		{ id: 3, lable: "Date", type: "date", jsonLalbe: "date" },
	];

	const handlingFineData = (e, obj) => {
		setDataFine((data) => ({
			...data,
			[obj]: e.target.value,
		}));
	};

	return (
		<>
			<Navbar />
			<Center>
				<Box
					display={"flex"} flexDirection={"column"}
					width={"auto"} minWidth={"300px"}
					borderWidth={"1px"} borderRadius={"10px"}
					height={"auto"} textAlign={"center"}
					paddingTop={"10px"} paddingBottom={"30px"}
					paddingLeft={"30px"} paddingRight={"30px"}
				>
					<Heading size={"2xl"} marginBottom={"20px"}>
						Send a fine
					</Heading>
					<DataListRoot orientation="horizontal">
						<DataListItem label={"Select number car"}>
							<SelectRoot
								collection={frameworks}
								onChange={(e) => handlingFineData(e, "car")}
								width={"200px"}
								size="sm"
							>
								<SelectTrigger>
									<SelectValueText placeholder="Select car" />
								</SelectTrigger>
								<SelectContent>
									{frameworks.items.map((car) => (
										<SelectItem item={car} key={car.value}>
											{car.label}
										</SelectItem>
									))}
								</SelectContent>
							</SelectRoot>
						</DataListItem>
						{inputLable.map((item) => (
							<DataListItem key={item.id} label={item.lable}>
								<Input
									type={item.type}
									width={"200px"}
									onChange={(e) => handlingFineData(e, item.jsonLalbe)}
								/>
							</DataListItem>
						))}
					</DataListRoot>
					<Button
						width={"100%"}
						marginTop={"20px"}
						bottom={"0"}
						onClick={() => SendFine(dataFine, userData?.status)}
					>
						Send
					</Button>
				</Box>
			</Center>
		</>
	);
};

export default DPS;