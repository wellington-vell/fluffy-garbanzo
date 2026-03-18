import Button from "@/src/components/Button";
import Checkbox from "@/src/components/Checkbox";
import Input from "@/src/components/Input";
import { useAppDispatch } from "@/src/store";
import {
  createClientThunk,
  getClientThunk,
  updateClientThunk,
} from "@/src/store/clientes/thunks";
import { ClienteSchema, clienteSchema } from "@/src/validations/cliente.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Form = () => {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(clienteSchema),
  });

  const handleFormSubmit = (data: ClienteSchema) => {
    if (id) {
      dispatch(updateClientThunk(data))
        .unwrap()
        .then(() => {
          router.back();
          Alert.alert("Sucesso", "Cliente atualizado com sucesso");
        });
    } else {
      dispatch(createClientThunk(data))
        .unwrap()
        .then(() => {
          router.back();
          Alert.alert("Sucesso", "Cliente criado com sucesso");
        });
    }
  };

  useEffect(() => {
    const getClient = () => {
      if (id) {
        dispatch(getClientThunk(Number(id)))
          .unwrap()
          .then((cliente) => {
            if (cliente) {
              reset({
                id: cliente?.id,
                name: cliente.nome,
                sobrenome: cliente.sobrenome,
                email: cliente.email,
                ativo: cliente.ativo || false,
              });
            } else {
              router.back();
              Alert.alert("Erro", "Cliente não encontrado!");
            }
          });
      }
    };

    getClient();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dados do Cliente</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              placeholder="Nome"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="sobrenome"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              placeholder="Sobrenome"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="ativo"
          render={({ field: { onChange, value } }) => (
            <Checkbox value={value} onChange={onChange} label="Ativo" />
          )}
        />

        <Button
          onPress={handleSubmit(handleFormSubmit)}
          style={{ marginTop: 16 }}
          label={id ? "Salvar" : "Cadastrar"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "medium",
  },
  content: {
    gap: 10,
  },
});
