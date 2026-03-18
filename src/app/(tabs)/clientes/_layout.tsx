import { Stack } from "expo-router";
import React from "react";

const ClientLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Clientes" }} />
      <Stack.Screen
        name="form"
        options={({ route }) => {
          const { id } = route.params as { id?: string };
          return {
            title: id ? "Editar Cliente" : "Novo Cliente",
          };
        }}
      />
    </Stack>
  );
};

export default ClientLayout;
