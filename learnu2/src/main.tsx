import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import AppWrapper from "./AppWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const client = new ApolloClient({
  uri: "https://gateway-negf.onrender.com/graphql/",
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
