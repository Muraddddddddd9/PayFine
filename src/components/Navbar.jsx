import { useNavigate } from "react-router-dom"
import {
    Box, Text, Center, Link, Button, For, Flex, MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { RiMenu3Fill } from "react-icons/ri";

const Navbar = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 556);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box
            position="sticky"
            top="0"
            zIndex={"100"}
            height={"100px"}
        >
            <MenuRoot>
                <Box
                    display={"flex"}
                    width={"100vw"}
                    margin={"auto"}
                    marginTop={"10px"}
                    justifyContent={"center"}
                    padding="4"
                >

                    <Center
                        background={"var(--color-backgroundSecond)"}
                        paddingLeft={"20px"} paddingRight={"20px"}
                        paddingTop={"10px"} paddingBottom={"10px"}
                        borderRadius={"5px"} border={"1px solid rgb(30, 30, 30)"}
                        width={isSmallScreen ? "1000px" : "auto"}
                        justifyContent={"space-between"}

                    >

                        <Flex alignItems={"center"}>
                            <svg
                                width="30" height="30" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
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
                        {!isSmallScreen &&
                            <For each={[
                                { id: 1, label: "Profile", link: "/profile" },
                                { id: 2, label: "Fine", link: "/fine" },
                                { id: 3, label: "Contact", link: "/contact" },
                            ]}>
                                {(item) =>
                                    <Link
                                        key={item.id}
                                        color={"var(--color-textMain)"}
                                        _hover={{ color: "var(--color-textLink)" }}
                                        marginLeft={"20px"} marginRight={"20px"}
                                        onClick={() => navigate(`${item.link}`)}
                                    >
                                        {item.label}
                                    </Link>
                                }
                            </For>
                        }
                        <Flex alignItems={"center"}>
                            <Button
                                background={"var(--button-background)"} color={"var(--color-textMain)"}
                                marginLeft={"15px"}
                                onClick={() => {
                                    navigate("/");
                                    localStorage.clear("session_key")
                                    localStorage.clear("walletUser")
                                }}
                            >Log out
                            </Button>
                            {isSmallScreen &&
                                <MenuTrigger asChild>
                                    <Button variant="ghost" size="sm" marginLeft={"15px"}>
                                        <RiMenu3Fill size={"20px"} />
                                    </Button>
                                </MenuTrigger>
                            }
                        </Flex>
                    </Center >
                </Box>
                <Center>
                    <MenuContent width={"50%"}>
                        <For each={[
                            { id: 1, label: "Profile", link: "/profile" },
                            { id: 2, label: "Fine", link: "/fine" },
                            { id: 3, label: "Contact", link: "/contact" },
                        ]}>
                            {(item) =>
                                <MenuItem
                                    key={item.id}
                                    color={"var(--color-textMain)"}
                                    _hover={{ color: "var(--color-textLink)" }}
                                    alignItems={"center"} textAlign={"center"} justifyContent={"center"}
                                    onClick={() => navigate(`${item.link}`)}
                                >
                                    {item.label}
                                </MenuItem>
                            }
                        </For>
                    </MenuContent>
                </Center>
            </MenuRoot>
        </Box >
    )
}

export default Navbar