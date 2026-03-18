import { IconSymbol } from "@/components/ui/icon-symbol";
import Box from "@/src/components/Box";
import ProdutoCard from "@/src/components/ProdutoCard";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  deleteProdutoThunk,
  listProdutoThunk,
} from "@/src/store/produtos/thunks";
import { theme } from "@/src/theme";
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

const Produtos = () => {
  const dispatch = useAppDispatch();
  const { loading, list } = useAppSelector((state) => state.produtos);

  useFocusEffect(
    useCallback(() => {
      dispatch(listProdutoThunk());
    }, [dispatch])
  );

  const handleEdit = (produtoId: number) => {
    router.push(`/produtos/form?id=${produtoId}`);
  };

  const handleRemove = (produtoId: number) => {
    Alert.alert(
      "Excluir",
      "Deseja realmente excluir esse produto?",
      [
        { text: "Sim", onPress: () => dispatch(deleteProdutoThunk(produtoId)) },
        { text: "Não", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex={1} padding={16} justifyContent="center" alignItems="center" gap={12}>
          <ActivityIndicator size="large" color={theme.colors.blue[500]} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const listHeader = (
    <Box marginBottom={8}>
      <Text style={styles.countText}>
        {list.length} {list.length === 1 ? "produto" : "produtos"}
      </Text>
    </Box>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Box flex={1} padding={16} gap={24}>
        {list.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center" gap={16} paddingVertical={32}>
            <IconSymbol
              name="bag.fill"
              size={48}
              color={theme.colors.gray[400]}
            />
            <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptyDescription}>
              Toque no + no canto superior para começar
            </Text>
          </Box>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => String(item.id)}
            ListHeaderComponent={listHeader}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ProdutoCard
                produto={item}
                onEdit={() => handleEdit(item.id)}
                onRemove={() => handleRemove(item.id)}
              />
            )}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};

export default Produtos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.fontSize.MD,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
  },
  countText: {
    fontSize: theme.fontSize.SM,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
  },
  listContent: {
    gap: 16,
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  emptyTitle: {
    fontSize: theme.fontSize.LG,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.brown[800],
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.fontSize.MD,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
    textAlign: "center",
  },
});
