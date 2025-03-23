import { Center, Box } from "@chakra-ui/react"
import { Navbar } from "../allPage"

const PageNotFound = () => {
    return (
        <>
            <Navbar />
            <Center>
                <Box textAlign={"center"} userSelect={"none"}>
                    <svg width="223" height="176" viewBox="0 0 223 176" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.14285 169.5H216.143M15.7222 155H95M63.1428 122.673V155V81.4701V122.673ZM63.1428 122.673H39.4325H15.7222V81.4701M111.643 43.0834L111.729 43.028M206 122.673V155H129M206 122.673V102.071V81.4701M206 122.673L158 122.673V81.4701M129 155V81H95V155M129 155H95M216.143 67.7486L136.328 17.397C127.593 11.8869 123.226 9.13189 118.298 8.08559C113.956 7.16389 109.33 7.16389 104.987 8.08559C100.06 9.13189 95.6927 11.8869 86.9581 17.397L7.14285 67.7486H216.143Z" stroke="#008080" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    404 Page not found
                </Box>
            </Center>
        </>
    )
}

export default PageNotFound