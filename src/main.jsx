import { Provider } from "@/components/ui/provider.jsx"
import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Box, Center } from "@chakra-ui/react"

const App = lazy(() => (import('./App.jsx')))

const Loading = () => {
  return (
    <Box
      position={"fixed"}
      top={0}
      left={"0"}
      width={"100vw"}
      height={"100vh"}
      background={"var(--color-backgroundFirst)"}
      display={"flex"}
      justifycontent={"center"}
      alignItems={"center"}
      zIndex={"999"}
    >
      <Center
        margin={"auto"}
        width={"100vw"}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 30 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 20.0001H19M2 17.0001H18M4 17.0001V12.0001M8 17.0001V12.0001M12 17.0001V12.0001M16 17.0001V12.0001M10 6.00695L10.0074 6.00022M19 9.0001L12.126 2.88986C11.3737 2.2212 10.9976 1.88688 10.5732 1.75991C10.1992 1.64806 9.8008 1.64806 9.4268 1.75991C9.0024 1.88688 8.6263 2.2212 7.87404 2.88986L1 9.0001H19Z"
            stroke="teal"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.1; 1"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </Center>
    </Box >
  )
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Provider>
  </StrictMode>,
)