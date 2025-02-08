import { Slot } from "expo-router";

import Header from "./header";

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
    </>
  );
}
