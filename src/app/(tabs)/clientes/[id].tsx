import { IconSymbol } from "@/components/ui/icon-symbol";
import Box from "@/src/components/Box";
import Button from "@/src/components/Button";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { listClienteProdutosThunk } from "@/src/store/clienteProdutos/thunks";
import { deleteClientThunk, getClientThunk } from "@/src/store/clientes/thunks";
import { listProdutoThunk } from "@/src/store/produtos/thunks";
import { theme } from "@/src/theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LinkedItem = {
  produtoId: number;
  quantidade: number;
};

export default function ClienteByIdScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNum = Number(id);

  const { list: produtos, loading: loadingProdutos } = useAppSelector(
    (s) => s.produtos
  );
  const { byClienteId, loading: loadingVinculos } = useAppSelector(
    (s) => s.clienteProdutos
  );

  const [loadingCliente, setLoadingCliente] = useState(false);
  const [clienteNome, setClienteNome] = useState<string>("");
  const [clienteEmail, setClienteEmail] = useState<string>("");
  const [clienteAtivo, setClienteAtivo] = useState<boolean>(false);
  const [clienteDataCadastro, setClienteDataCadastro] = useState<string>("");

  const vinculos = (byClienteId[idNum] ?? []) as unknown as LinkedItem[];

  const produtoById = useMemo(() => {
    const map = new Map<number, (typeof produtos)[number]>();
    for (const p of produtos) map.set(p.id, p);
    return map;
  }, [produtos]);

  const vinculosView = useMemo(() => {
    return vinculos
      .map((v) => {
        const produto = produtoById.get(v.produtoId);
        const preco = Number(produto?.preco ?? 0);
        const quantidade = Math.max(1, Number(v.quantidade) || 1);
        return {
          produtoId: v.produtoId,
          nome: produto?.nome ?? `Produto #${v.produtoId}`,
          preco,
          quantidade,
          subtotal: preco * quantidade,
          imagemUri: produto?.imagemUri ?? null,
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [produtoById, vinculos]);

  const total = useMemo(
    () => vinculosView.reduce((acc, v) => acc + (v.subtotal || 0), 0),
    [vinculosView]
  );

  useFocusEffect(
    useCallback(() => {
      if (!Number.isFinite(idNum)) {
        Alert.alert("Erro", "Cliente inválido");
        router.back();
        return;
      }

      dispatch(listProdutoThunk());
      dispatch(listClienteProdutosThunk(idNum));

      setLoadingCliente(true);
      dispatch(getClientThunk(idNum))
        .unwrap()
        .then((c) => {
          if (!c) {
            Alert.alert("Erro", "Cliente não encontrado!");
            router.back();
            return;
          }
          setClienteNome(`${c.nome} ${c.sobrenome}`.trim());
          setClienteEmail(c.email);
          setClienteAtivo(!!c.ativo);
          setClienteDataCadastro(c.dataCadastro);
        })
        .finally(() => setLoadingCliente(false));
    }, [dispatch, idNum])
  );

  const handleEdit = () => {
    router.push(`/clientes/form?id=${idNum}`);
  };

  const handleLinkProdutos = () => {
    router.push(`/clientes/produtos?clienteId=${idNum}`);
  };

  const handleRemove = () => {
    Alert.alert(
      "Excluir",
      "Deseja realmente excluir esse cliente?",
      [
        {
          text: "Sim",
          onPress: () => {
            dispatch(deleteClientThunk(idNum))
              .unwrap()
              .then(() => router.back());
          },
        },
        { text: "Não", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const loadingAny = loadingCliente || loadingProdutos || loadingVinculos;

  if (loadingAny) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.background]}>
        <Box flex={1} padding={16} justifyContent="center" alignItems="center" gap={12}>
          <ActivityIndicator size="large" color={theme.colors.blue[500]} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, styles.background]}>
      <Box flex={1} padding={16} gap={12}>
        {/* Card do cliente */}
        <Box
          backgroundColor={theme.colors.white}
          borderRadius={10}
          padding={16}
          gap={10}
          {...theme.shadow.MD}
        >
          <Text style={styles.title}>{clienteNome || `Cliente #${idNum}`}</Text>
          {!!clienteEmail && (
            <Text style={styles.sub}>{clienteEmail}</Text>
          )}
          <Box flexDirection="row" alignItems="center" gap={8} flexWrap="wrap">
            <Box
              alignSelf="flex-start"
              paddingHorizontal={10}
              paddingVertical={4}
              borderRadius={20}
              backgroundColor={clienteAtivo ? theme.colors.success : theme.colors.gray[200]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: clienteAtivo ? theme.colors.white : theme.colors.gray[400] },
                ]}
              >
                {clienteAtivo ? "Ativo" : "Inativo"}
              </Text>
            </Box>
            {!!clienteDataCadastro && (
              <Text style={styles.dataCadastro}>
                Cadastro: {clienteDataCadastro
                  ? new Date(clienteDataCadastro.split("T")[0]).toLocaleDateString("pt-BR")
                  : ""}
              </Text>
            )}
          </Box>
        </Box>

        <Box flexDirection="row" gap={10}>
          <Box flex={1}>
            <Button label="Editar" onPress={handleEdit} />
          </Box>
          <Box flex={1}>
            <Button label="Vincular Produtos" onPress={handleLinkProdutos} />
          </Box>
        </Box>

        <TouchableOpacity
          onPress={handleRemove}
          style={styles.excluirButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            name="trash.fill"
            size={20}
            color={theme.colors.error}
          />
          <Text style={styles.excluirLabel}>Excluir</Text>
        </TouchableOpacity>

        <Box gap={8}>
          <Text style={styles.sectionTitle}>Produtos vinculados</Text>
          <Box
            backgroundColor={theme.colors.gray[130]}
            borderRadius={8}
            padding={12}
            alignSelf="flex-start"
          >
            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
          </Box>
        </Box>

        <FlatList
          data={vinculosView}
          keyExtractor={(item) => String(item.produtoId)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum produto vinculado.</Text>
          }
          renderItem={({ item }) => (
            <Box
              backgroundColor={theme.colors.white}
              padding={16}
              borderRadius={10}
              gap={12}
              flexDirection="row"
              alignItems="flex-start"
              {...theme.shadow.SM}
            >
              {item.imagemUri ? (
                <Image
                  source={{ uri: item.imagemUri }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.thumbnailPlaceholder} />
              )}
              <Box flex={1} gap={4}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemLine}>
                  {item.quantidade} x R$ {item.preco.toFixed(2)}
                </Text>
                <Text style={styles.itemSubtotal}>
                  Subtotal: R$ {item.subtotal.toFixed(2)}
                </Text>
              </Box>
            </Box>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { backgroundColor: theme.colors.background },
  loadingText: {
    color: theme.colors.gray[400],
    fontSize: theme.fontSize.MD,
  },
  title: {
    fontSize: theme.fontSize.XG,
    fontWeight: "bold",
    color: theme.colors.brown[900],
  },
  sub: {
    color: theme.colors.gray[400],
    fontSize: theme.fontSize.MD,
  },
  badgeText: {
    fontSize: theme.fontSize.SM,
    fontWeight: "600",
  },
  dataCadastro: {
    color: theme.colors.gray[400],
    fontSize: theme.fontSize.SM,
  },
  excluirButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  excluirLabel: {
    color: theme.colors.error,
    fontSize: theme.fontSize.MD,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: theme.fontSize.LG,
    fontWeight: "600",
    color: theme.colors.brown[900],
  },
  total: {
    color: theme.colors.brown[900],
    fontWeight: "700",
    fontSize: theme.fontSize.MD,
  },
  listContent: { gap: 12, paddingBottom: 12 },
  empty: {
    textAlign: "center",
    color: theme.colors.gray[400],
    marginTop: 16,
    fontSize: theme.fontSize.MD,
  },
  itemTitle: {
    fontWeight: "600",
    color: theme.colors.brown[900],
    fontSize: theme.fontSize.MD,
  },
  itemLine: {
    color: theme.colors.gray[400],
    fontSize: theme.fontSize.SM,
  },
  itemSubtotal: {
    color: theme.colors.gray[400],
    fontWeight: "600",
    fontSize: theme.fontSize.SM,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[130],
  },
  thumbnailPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[130],
  },
});
