import { ProdutoDto } from "@/src/@DTO/ProdutoDto";
import { theme } from "@/src/theme";
import React from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import Box from "../Box";
import Checkbox from "../Checkbox";

type Props = {
  produto: ProdutoDto;
  onEdit?: () => void;
  onRemove?: () => void;
  onPress?: () => void;
};

const THUMB_SIZE = 56;

const ProdutoCard = ({ produto, onEdit, onRemove, onPress }: Props) => {
  const precoFormatado = `R$ ${Number(produto.preco ?? 0).toFixed(2)}`;

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Box
        backgroundColor={theme.colors.white}
        {...theme.shadow.MD}
        borderRadius={10}
        padding={16}
      >
        <Box flexDirection="row" alignItems="center" gap={12}>
          {produto.imagemUri ? (
            <Image
              source={{ uri: produto.imagemUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}
          <Box flex={1} gap={6}>
            <Box flexDirection="row" alignItems="center">
              <Text style={styles.nome} numberOfLines={1}>
                {produto.nome}
              </Text>
              <Box flexDirection="row" gap={3}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onEdit?.();
                  }}
                  style={styles.actionTouch}
                  disabled={!onEdit}
                >
                  <IconSymbol
                    name="pencil"
                    size={24}
                    color={theme.colors.blue[500]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    onRemove?.();
                  }}
                  style={styles.actionTouch}
                  disabled={!onRemove}
                >
                  <IconSymbol
                    name="trash.fill"
                    size={24}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              </Box>
            </Box>
            {!!produto.descricao && (
              <Text style={styles.desc} numberOfLines={2}>
                {produto.descricao}
              </Text>
            )}
            <Text style={styles.preco}>{precoFormatado}</Text>
          </Box>
        </Box>
        <Checkbox
          disabled
          label="Ativo"
          value={!!produto.ativo}
          onChange={() => {}}
          style={{ marginTop: 12 }}
        />
      </Box>
    </Pressable>
  );
};

export default ProdutoCard;

const styles = StyleSheet.create({
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[200],
  },
  thumbnailPlaceholder: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[200],
  },
  nome: {
    flex: 1,
    fontSize: theme.fontSize.MD,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.brown[900],
  },
  desc: {
    fontSize: theme.fontSize.SM,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
  },
  preco: {
    fontSize: theme.fontSize.SM,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.gray[400],
  },
  actionTouch: {
    paddingHorizontal: 5,
  },
});
