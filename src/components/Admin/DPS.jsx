import { Center, Box, Heading, Input, Button, createListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Loading, Navbar } from "../allPage";
import { useState } from "react";
import { useGetUser, useGetAllCar, useSendFine } from "@/hooks/allHoks";

const DPS = () => {
	const { userData } = useGetUser()
	const { SendFine } = useSendFine()
	const { allCar, isLoading } = useGetAllCar();

	const [dataFine, setDataFine] = useState({});

	if (isLoading) {
		return (
			<Loading />
		);
	}

	var frameworks
	if (!allCar || allCar.length === 0) {
		frameworks = createListCollection({
			items: [],
		});
	} else {
		const sortedAllCar = allCar.slice().sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true }));
		frameworks = createListCollection({
			items: sortedAllCar,
		});
	}

	const inputLabel = [
		{ id: 1, label: "Price", type: "number", jsonLalbe: "price" },
		{ id: 2, label: "Reason", type: "text", jsonLalbe: "reason" },
		{ id: 3, label: "Date", type: "date", jsonLalbe: "date" },
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
					border={"1px solid var(--color-border-content)"}
				>
					<Heading size={"2xl"} marginBottom={"20px"} color={"var(--textMain)"}>
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
								<SelectContent sx={{ filter: "invert(100%)" }}>
									{frameworks.items.map((car) => (
										<SelectItem item={car} key={car.value}>
											{car.label}
										</SelectItem>
									))}
								</SelectContent>
							</SelectRoot>
						</DataListItem>
						{inputLabel.map((item) => (
							<DataListItem key={item.id} label={item.label} info={item.jsonLalbe === "date" ? "This period should not exceed 30 days." : null}>
								<Input
									type={item.type}
									width={"200px"}
									_focus={{ border: "2px solid var(--input-focus-border)", outline: "none" }}
									onChange={(e) => handlingFineData(e, item.jsonLalbe)}
								/>
							</DataListItem>
						))}
					</DataListRoot>
					<Button
						width={"100%"}
						marginTop={"20px"}
						bottom={"0"}
						backgroundColor={"var(--button-background)"}
						color={"var(--color-text-button)"}
						onClick={() => SendFine(dataFine, userData?.status)}
					>
						Send
					</Button>
				</Box>
			</Center >
		</>
	);
};

export default DPS;