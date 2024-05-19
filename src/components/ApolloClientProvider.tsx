import { ApolloProvider } from "@apollo/client";
import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<typeof ApolloProvider> {}

const ApolloClientProvider = ({ children, ...props }: Props) => (
  <ApolloProvider {...props}>{children}</ApolloProvider>
);

export { ApolloClientProvider };
