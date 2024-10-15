import Practice from "./components/Practice";
import PracticeQueryClient from "./components/PracticeQueryClient";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Practice />
        <hr style={{margin: "20px 0px"}} />
        <PracticeQueryClient />
      </QueryClientProvider>
    </>
  );
}
export default App;
