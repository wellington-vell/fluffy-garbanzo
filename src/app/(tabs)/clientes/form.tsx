import { IconSymbol } from "@/components/ui/icon-symbol";
import Button from "@/src/components/Button";
import Checkbox from "@/src/components/Checkbox";
import Input from "@/src/components/Input";
import { useAppDispatch } from "@/src/store";
import {
  createClientThunk,
  getClientThunk,
  updateClientThunk,
} from "@/src/store/clientes/thunks";
import { theme } from "@/src/theme";
import { ClienteSchema, clienteSchema } from "@/src/validations/cliente.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  }, [dispatch, id, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <IconSymbol
            name="person.fill"
            size={28}
            color={theme.colors.brown[800]}
          />
          <Text style={styles.title}>Dados do Cliente</Text>
        </View>
        {!!id && (
          <Text style={styles.subtitle}>Editar informações</Text>
        )}

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Nome"
                placeholder="Nome"
                leftIcon={
                  <IconSymbol
                    name="person.fill"
                    size={20}
                    color={theme.colors.gray[400]}
                  />
                }
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
                label="Sobrenome"
                placeholder="Sobrenome"
                leftIcon={
                  <IconSymbol
                    name="person.fill"
                    size={20}
                    color={theme.colors.gray[400]}
                  />
                }
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
                label="E-mail"
                placeholder="E-mail"
                leftIcon={
                  <IconSymbol
                    name="envelope.fill"
                    size={20}
                    color={theme.colors.gray[400]}
                  />
                }
                value={value}
                onChangeText={onChange}
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="ativo"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxRow}>
                <Checkbox value={value} onChange={onChange} label="Ativo" />
              </View>
            )}
          />
        </View>

        <Button
          onPress={handleSubmit(handleFormSubmit)}
          style={styles.button}
          label={id ? "Salvar" : "Cadastrar"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  title: {
    fontSize: theme.fontSize.XXG,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.brown[900],
  },
  subtitle: {
    fontSize: theme.fontSize.MD,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    gap: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    marginTop: 24,
    alignSelf: "stretch",
  },
});
