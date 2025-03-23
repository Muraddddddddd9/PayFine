import { Provider } from "@/components/ui/provider.jsx"
import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Loading } from "./components/allPage"
const App = lazy(() => (import('./App.jsx')))

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Provider>
  </StrictMode>,
)