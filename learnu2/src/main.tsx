import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import { GRAPHQL_URL, getToken } from "./utils/api";
import App from "./App";
import AppWrapper from "./AppWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const client = new ApolloClient({
  // The token is read on every request, so it is picked up right after login
  link: new HttpLink({
    uri: GRAPHQL_URL,
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    },
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
