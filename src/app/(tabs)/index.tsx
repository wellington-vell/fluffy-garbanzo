import Box from "@/src/components/Box";
import Button from "@/src/components/Button";
import { useAppDispatch } from "@/src/store";
import { seedDatabaseThunk } from "@/src/store/seed/thunks";
import { theme } from "@/src/theme";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "../../../components/ui/icon-symbol";

const BENEFITS = [
  {
    title: "Cadastro rápido de clientes",
    description: "Registre clientes e dados de contato em poucos toques.",
  },
  {
    title: "Controle de produtos e vínculos",
    description: "Gerencie produtos e associe ao que cada cliente compra.",
  },
  {
    title: "Operação pronta para uso offline",
    description: "Cadastre no campo e sincronize quando tiver conexão.",
  },
] as const;

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const handleGoToClientes = () => {
    router.push("/(tabs)/clientes");
  };

  const handleSeed = () => {
    Alert.alert(
      "Seed (DEV)",
      "Isso irá apagar Cliente/Produto/Vínculos e recriar dados de exemplo. Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: () => {
            dispatch(seedDatabaseThunk())
              .unwrap()
              .then(() => Alert.alert("Sucesso", "Seed aplicado no banco do app"));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Box flex={1} padding={16} gap={24}>
          {/* Header */}
          <Box gap={12} alignItems="center" marginTop={8}>
            <IconSymbol
              name="cart.fill"
              size={56}
              color={theme.colors.blue[500]}
            />
            <Text style={styles.title}>
              Gestão de Clientes e Produtos, em qualquer lugar
            </Text>
            <Text style={styles.subtitle}>
              Cadastre clientes e produtos mesmo offline e sincronize depois.
            </Text>
          </Box>

          {/* Benefícios */}
          <Box gap={16} marginTop={8}>
            {BENEFITS.map((item, index) => (
              <Box key={index} gap={4}>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitDescription}>{item.description}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA principal */}
          <Box marginTop={24} width="100%">
            <Button
              label="Começar pelos Clientes"
              onPress={handleGoToClientes}
              style={styles.ctaButton}
              accessibilityRole="button"
              accessibilityLabel="Começar pelos Clientes"
            />
          </Box>

          {/* Seed (DEV) - ação secundária */}
          <TouchableOpacity
            onPress={handleSeed}
            style={styles.seedButton}
            accessibilityRole="button"
            accessibilityLabel="Seed (DEV)"
          >
            <IconSymbol name="square.stack.3d.up.fill" size={18} color={theme.colors.gray[400]} />
            <Text style={styles.seedLabel}>Seed (DEV)</Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  title: {
    fontSize: theme.fontSize.XXG,
    fontWeight: "bold",
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.brown[900],
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.fontSize.MD,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
    textAlign: "center",
    lineHeight: 22,
  },
  benefitsContainer: {
    gap: 16,
  },
  benefitTitle: {
    fontSize: theme.fontSize.MD,
    fontWeight: "600",
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.brown[800],
  },
  benefitDescription: {
    fontSize: theme.fontSize.XM,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
    lineHeight: 20,
  },
  ctaButton: {
    width: "100%",
    paddingVertical: 14,
  },
  seedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    opacity: 0.85,
  },
  seedLabel: {
    fontSize: theme.fontSize.SM,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.gray[400],
  },
});
