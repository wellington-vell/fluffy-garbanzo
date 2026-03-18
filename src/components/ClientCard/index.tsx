import { ClienteDto } from "@/src/@DTO/ClienteDto";
import { theme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Box from "../Box";
import Checkbox from "../Checkbox";

type Props = {
  client: ClienteDto;
  onRemove?: () => void;
  onEdit?: () => void;
};

const ClientCard = ({ client, onRemove, onEdit }: Props) => {
  return (
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
          <TouchableOpacity onPress={onEdit} style={{ paddingHorizontal: 5 }}>
            <MaterialIcons
              name="edit"
              size={24}
              color={theme.colors.blue[500]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} style={{ paddingHorizontal: 5 }}>
            <MaterialIcons name="delete" size={24} color="red" />
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
  );
};

export default ClientCard;
