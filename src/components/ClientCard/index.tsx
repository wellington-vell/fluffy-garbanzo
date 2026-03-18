import { ClienteDto } from "@/src/@DTO/ClienteDto";
import { theme } from "@/src/theme";
import React from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import Box from "../Box";
import Checkbox from "../Checkbox";

type Props = {
  client: ClienteDto;
  onRemove?: () => void;
  onEdit?: () => void;
  onLinkProdutos?: () => void;
  onPress?: () => void;
};

const ClientCard = ({
  client,
  onRemove,
  onEdit,
  onLinkProdutos,
  onPress,
}: Props) => {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Box
        backgroundColor={theme.colors.white}
        {...theme.shadow.MD}
        borderRadius={10}
        padding={16}
      >
        <Box flexDirection="row" flex={1}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>
            {client.nome} {client.sobrenome}
          </Text>
          <Box flexDirection="row" gap={3}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onLinkProdutos?.();
              }}
              style={{ paddingHorizontal: 5 }}
              disabled={!onLinkProdutos}
            >
              <IconSymbol
                name="cart.fill"
                size={24}
                color={theme.colors.gray[400]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onEdit?.();
              }}
              style={{ paddingHorizontal: 5 }}
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
              style={{ paddingHorizontal: 5 }}
              disabled={!onRemove}
            >
              <IconSymbol name="trash.fill" size={24} color="red" />
            </TouchableOpacity>
          </Box>
        </Box>
        <Text style={{ color: theme.colors.gray[400] }}>{client.email}</Text>
        <Checkbox
          disabled
          label="Ativo"
          value={!!client.ativo}
          onChange={() => {}}
          style={{ marginTop: 16 }}
        />
      </Box>
    </Pressable>
  );
};

export default ClientCard;
