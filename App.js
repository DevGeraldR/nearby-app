/**
 * Nearby App Version 1
 *
 * The main class
 */

import React from "react";
import { ContextProvider } from "./main-container/context/Context";

import AppNav from "./main-container/Navigation/AppNav";

export default function App() {
  return (
    <ContextProvider>
      <AppNav />
    </ContextProvider>
  );
}
