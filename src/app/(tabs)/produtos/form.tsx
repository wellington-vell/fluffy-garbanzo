import { IconSymbol } from "@/components/ui/icon-symbol";
import Button from "@/src/components/Button";
import Checkbox from "@/src/components/Checkbox";
import Input from "@/src/components/Input";
import { useAppDispatch } from "@/src/store";
import {
  createProdutoThunk,
  getProdutoThunk,
  updateProdutoThunk,
} from "@/src/store/produtos/thunks";
import { theme } from "@/src/theme";
import {
  ProdutoSchema,
  produtoSchema,
} from "@/src/validations/produto.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Directory, File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Form() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { control, handleSubmit, reset, setValue } = useForm<ProdutoSchema>({
    resolver: yupResolver(produtoSchema) as any,
    defaultValues: {
      id: undefined,
      ativo: true,
      preco: 0,
      descricao: null,
      nome: "",
      imagemUri: null,
    },
  });

  const handleFormSubmit = (data: ProdutoSchema) => {
    if (id) {
      dispatch(updateProdutoThunk(data))
        .unwrap()
        .then(() => {
          router.back();
          Alert.alert("Sucesso", "Produto atualizado com sucesso");
        });
    } else {
      dispatch(createProdutoThunk(data))
        .unwrap()
        .then(() => {
          router.back();
          Alert.alert("Sucesso", "Produto criado com sucesso");
        });
    }
  };

  useEffect(() => {
    if (!id) return;

    dispatch(getProdutoThunk(Number(id)))
      .unwrap()
      .then((produto) => {
        if (!produto) {
          router.back();
          Alert.alert("Erro", "Produto não encontrado!");
          return;
        }

        reset({
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao ?? null,
          preco: produto.preco ?? 0,
          ativo: produto.ativo ?? true,
          imagemUri: produto.imagemUri ?? null,
        });
      });
  }, [dispatch, id, reset]);

  const pickFromGallery = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Info", "Use o campo URL da imagem no navegador.");
      return;
    }
    try {
      const ImagePicker = await import("expo-image-picker");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão", "É necessário permitir acesso à galeria.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      const uri = result.assets[0].uri;
      const dir = new Directory(Paths.document, "produtos");
      dir.create({ intermediates: true, idempotent: true });
      const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
      const destFile = new File(dir, `${Date.now()}.${ext}`);
      const sourceFile = new File(uri);
      sourceFile.copy(destFile);
      setValue("imagemUri", destFile.uri);
    } catch {
      Alert.alert(
        "Indisponível",
        "Escolher da galeria requer um build de desenvolvimento (expo run:ios ou expo run:android). Use o campo URL da imagem."
      );
    }
  };

  const removeImage = () => setValue("imagemUri", null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dados do Produto</Text>
        </View>
        {!!id && (
          <Text style={styles.subtitle}>Editar informações</Text>
        )}

        <View style={styles.card}>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Nome"
                placeholder="Nome"
                leftIcon={
                  <IconSymbol
                    name="bag.fill"
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
            name="descricao"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Descrição"
                placeholder="Descrição"
                leftIcon={
                  <IconSymbol
                    name="doc.text.fill"
                    size={20}
                    color={theme.colors.gray[400]}
                  />
                }
                value={value ?? ""}
                onChangeText={(t) => onChange(t.length ? t : null)}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="preco"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Preço"
                placeholder="0,00"
                leftIcon={
                  <IconSymbol
                    name="dollarsign.circle.fill"
                    size={20}
                    color={theme.colors.gray[400]}
                  />
                }
                keyboardType="decimal-pad"
                value={String(value ?? "")}
                onChangeText={(t) => onChange(t)}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ativo"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxRow}>
                <Checkbox value={!!value} onChange={onChange} label="Ativo" />
              </View>
            )}
          />

          <Controller
            control={control}
            name="imagemUri"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={styles.imageInputRow}>
                  <View style={styles.imageInputWrapper}>
                    <Input
                      label="Imagem do produto"
                      placeholder="URL da imagem (opcional)"
                      leftIcon={
                        <IconSymbol
                          name="photo.fill"
                          size={20}
                          color={theme.colors.gray[400]}
                        />
                      }
                      value={value ?? ""}
                      onChangeText={(t) => onChange(t?.trim() || null)}
                      error={error?.message}
                    />
                  </View>
                  {/* TODO: Add gallery picker */}
                  {/* {Platform.OS !== "web" && (
                    <TouchableOpacity
                      onPress={pickFromGallery}
                      style={styles.galleryIconButton}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="photo.on.rectangle.angled"
                        size={24}
                        color={theme.colors.blue[500]}
                      />
                    </TouchableOpacity>
                  )} */}
                </View>
                {(value ?? "").length > 0 && (
                  <View style={styles.previewRow}>
                    <Image
                      source={{ uri: value ?? undefined }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>Remover imagem</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
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
}

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
  imageInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  imageInputWrapper: {
    flex: 1,
  },
  galleryIconButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.gray[200],
    borderRadius: 10,
    minWidth: 48,
    minHeight: 48,
  },
  previewRow: {
    marginTop: 12,
    gap: 8,
    alignItems: "flex-start",
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[200],
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  removeButtonText: {
    color: theme.colors.error,
    fontFamily: theme.fontFamily.bold,
  },
  button: {
    marginTop: 24,
    alignSelf: "stretch",
  },
});
