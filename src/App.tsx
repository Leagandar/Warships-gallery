import { ApolloClientProvider, ShipsList } from "./components";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://vortex.korabli.su/api/graphql/glossary/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloClientProvider client={client}>
      <ShipsList />
    </ApolloClientProvider>
  );
}

export default App;
