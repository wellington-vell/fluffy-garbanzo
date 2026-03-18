import Box from "@/src/components/Box";
import Button from "@/src/components/Button";
import Checkbox from "@/src/components/Checkbox";
import Input from "@/src/components/Input";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { listClienteProdutosThunk, saveClienteProdutosThunk } from "@/src/store/clienteProdutos/thunks";
import { getClientThunk } from "@/src/store/clientes/thunks";
import { listProdutoThunk } from "@/src/store/produtos/thunks";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SelectionState = Record<number, { selected: boolean; quantidade: number }>;

const VincularProdutos = () => {
  const dispatch = useAppDispatch();
  const { clienteId } = useLocalSearchParams<{ clienteId: string }>();
  const idNum = Number(clienteId);

  const { list: produtos, loading: loadingProdutos } = useAppSelector(
    (s) => s.produtos
  );

  const [clienteNome, setClienteNome] = useState<string>("");
  const [selection, setSelection] = useState<SelectionState>({});
  const [saving, setSaving] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(selection).filter((v) => v.selected).length,
    [selection]
  );

  useFocusEffect(
    useCallback(() => {
      if (!Number.isFinite(idNum)) return;

      dispatch(listProdutoThunk());

      dispatch(getClientThunk(idNum))
        .unwrap()
        .then((c) => {
          if (c) setClienteNome(`${c.nome} ${c.sobrenome}`.trim());
        });

      dispatch(listClienteProdutosThunk(idNum))
        .unwrap()
        .then((rows) => {
          const next: SelectionState = {};
          for (const r of rows) {
            next[r.produtoId] = {
              selected: true,
              quantidade: r.quantidade ?? 1,
            };
          }
          setSelection(next);
        });
    }, [dispatch, idNum])
  );

  const toggle = (produtoId: number, value: boolean) => {
    setSelection((prev) => {
      const existing = prev[produtoId];
      return {
        ...prev,
        [produtoId]: {
          selected: value,
          quantidade: existing?.quantidade ?? 1,
        },
      };
    });
  };

  const setQuantidade = (produtoId: number, quantidade: number) => {
    setSelection((prev) => ({
      ...prev,
      [produtoId]: {
        selected: prev[produtoId]?.selected ?? true,
        quantidade,
      },
    }));
  };

  const handleSave = async () => {
    if (!Number.isFinite(idNum)) {
      Alert.alert("Erro", "Cliente inválido");
      return;
    }

    setSaving(true);
    try {
      const items = Object.entries(selection)
        .filter(([, v]) => v.selected)
        .map(([produtoId, v]) => ({
          produtoId: Number(produtoId),
          quantidade: Math.max(1, Number(v.quantidade) || 1),
        }));

      await dispatch(saveClienteProdutosThunk({ clienteId: idNum, items })).unwrap();
      Alert.alert("Sucesso", "Produtos vinculados com sucesso");
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding={16} gap={12}>
        <Box>
          <Text style={styles.title}>Vincular Produtos</Text>
          {!!clienteNome && (
            <Text style={styles.subtitle}>Cliente: {clienteNome}</Text>
          )}
          <Text style={styles.subtitle}>
            Selecionados: {selectedCount}
          </Text>
        </Box>

        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          refreshing={loadingProdutos}
          onRefresh={() => dispatch(listProdutoThunk())}
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          renderItem={({ item }) => {
            const state = selection[item.id] ?? {
              selected: false,
              quantidade: 1,
            };

            return (
              <Box
                backgroundColor="#fff"
                padding={16}
                borderRadius={10}
                gap={12}
                flexDirection="row"
                alignItems="flex-start"
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
                <Box flex={1} gap={10}>
                  <Checkbox
                    value={state.selected}
                    onChange={(v) => toggle(item.id, v)}
                    label={item.nome}
                  />
                  <Box flexDirection="row" gap={12} alignItems="center">
                    <Box flex={1}>
                      <Input
                        placeholder="Quantidade"
                        keyboardType="number-pad"
                        editable={state.selected}
                        value={String(state.quantidade ?? 1)}
                        onChangeText={(t) =>
                          setQuantidade(item.id, Number(t.replace(/\D/g, "")) || 1)
                        }
                      />
                    </Box>
                    <Text style={styles.price}>
                      R$ {Number(item.preco ?? 0).toFixed(2)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>Crie produtos primeiro na aba Produtos.</Text>
          }
        />

        <Button
          label={saving ? "Salvando..." : "Salvar vínculos"}
          onPress={handleSave}
          disabled={saving}
        />
      </Box>
    </SafeAreaView>
  );
};

export default VincularProdutos;

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#666", marginTop: 4 },
  empty: { textAlign: "center", color: "#999", marginTop: 24 },
  price: { color: "#666", fontWeight: "600" },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  thumbnailPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});

