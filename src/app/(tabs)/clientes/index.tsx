import Box from "@/src/components/Box";
import Button from "@/src/components/Button";
import ClientCard from "@/src/components/ClientCard";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  deleteClientThunk,
  listClientThunk,
} from "@/src/store/clientes/thunks";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Clientes = () => {
  const dispatch = useAppDispatch();
  const { loading, list } = useAppSelector((state) => state.clients);

  useFocusEffect(
    useCallback(() => {
      dispatch(listClientThunk());
    }, [])
  );

  const handleRemove = (clientId: number) => {
    Alert.alert(
      "Excluir",
      "Deseja realmente excluir esse cliente?",
      [
        {
          text: "Sim",
          onPress: () => dispatch(deleteClientThunk(clientId)),
        },
        {
          text: "Não",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (clientId: number) => {
    router.push(`/clientes/form?id=${clientId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} padding={16}>
          <ActivityIndicator />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding={16}>
        <Button
          onPress={() => router.push("/clientes/form")}
          label="Novo Cliente"
        />
        <Box>
          {list.length === 0 ? (
            <Text style={styles.emptyText}>Não há clientes cadastrados</Text>
          ) : (
            <FlatList
              data={list}
              contentContainerStyle={{
                gap: 16,
                paddingHorizontal: 8,
                paddingVertical: 16,
              }}
              renderItem={({ item }) => (
                <ClientCard
                  client={item}
                  onRemove={() => handleRemove(item.id)}
                  onEdit={() => handleEdit(item.id)}
                />
              )}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Clientes;

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "medium",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "medium",
    marginTop: 26,
    textAlign: "center",
    color: "#999",
  },
});
