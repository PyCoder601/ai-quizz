import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./page/Home.tsx";

const router = createBrowserRouter([
    {
        element: <Home />,
        path: '/'
    }
])
function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;