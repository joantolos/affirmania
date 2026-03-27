import { View, Text, Pressable, StyleSheet } from "react-native";
import { TierName, validationTiers } from "../data/validationTiers";

interface Props {
    selected: TierName | null;
    onSelect: (tier: TierName) => void;
}

const tiers = Object.keys(validationTiers) as TierName[];

export default function TierSelector({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            {tiers.map((tier) => (
                <Pressable
                    key={tier}
                    onPress={() => onSelect(tier)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selected === tier }}
                    accessibilityLabel={`Select ${tier} tier`}
                    style={({ pressed }) => [
                        styles.tierButton,
                        selected === tier && styles.tierButtonSelected,
                        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
                    ]}
                >
                    <Text
                        style={[
                            styles.tierText,
                            selected === tier && styles.tierTextSelected,
                        ]}
                    >
                        {tier}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 20,
    },
    tierButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "white",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },

    tierButtonSelected: {
        backgroundColor: "#ffe8b0",
    },

    tierText: {
        fontFamily: "Baloo",
        fontSize: 20,
        color: "#333",
        textAlign: "center",
    },

    tierTextSelected: {
        color: "#000",
    },
});
