import { IconSymbol } from "@/components/ui/icon-symbol";
import { theme } from "@/src/theme";
import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const ClientLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Clientes",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("form")}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ paddingHorizontal: 8 }}
            >
              <IconSymbol name="plus" size={24} color={theme.colors.blue[500]} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="[id]"
        options={({ route }) => {
          const params = (route.params ?? {}) as { id?: string };
          return {
            title: params.id ? `Cliente #${params.id}` : "Cliente",
          };
        }}
      />
      <Stack.Screen
        name="form"
        options={({ route }) => {
          const params = (route.params ?? {}) as { id?: string };
          return {
            title: params.id ? "Editar Cliente" : "Novo Cliente",
          };
        }}
      />
      <Stack.Screen
        name="produtos"
        options={({ route }) => {
          const params = (route.params ?? {}) as { clienteId?: string };
          return {
            title: params.clienteId ? "Vincular Produtos" : "Produtos",
          };
        }}
      />
    </Stack>
  );
};

export default ClientLayout;
