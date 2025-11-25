import { View, Text, Pressable, StyleSheet } from "react-native";
import { TierName } from "../data/validationTiers";

interface Props {
    selected: TierName | null;
    onSelect: (tier: TierName) => void;
}

export default function TierSelector({ selected, onSelect }: Props) {
    const tiers: TierName[] = [
        "Mildly Noticed",
        "Hyper Esteem",
        "Delusional Greatness",
    ];

    return (
        <View style={styles.container}>
            {tiers.map((tier) => (
                <Pressable
                    key={tier}
                    onPress={() => onSelect(tier)}
                    style={[
                        styles.tierButton,
                        selected === tier && styles.tierButtonSelected,
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
