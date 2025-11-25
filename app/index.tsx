import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import TierSelector from "../src/components/TierSelector";
import { TierName, validationTiers } from "../src/data/validationTiers";

export default function HomeScreen() {
    const [selectedTier, setSelectedTier] = useState<TierName | null>(null);
    const [affirmation, setAffirmation] = useState("");

    const generateAffirmation = () => {
        if (!selectedTier) return;
        const options = validationTiers[selectedTier];
        const random = options[Math.floor(Math.random() * options.length)];
        setAffirmation(random);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>affirmania</Text>
            </View>

            <Text style={styles.tagline}>
                The single greatest misuse of software engineering talent since
                blockchain smoothies.
            </Text>

            <TierSelector selected={selectedTier} onSelect={setSelectedTier} />

            <Pressable
                style={[
                    styles.button,
                    !selectedTier && { opacity: 0.4 },
                ]}
                disabled={!selectedTier}
                onPress={generateAffirmation}
            >
                <Text style={styles.buttonText}>Validate Me!</Text>
            </Pressable>

            {affirmation !== "" && (
                <Text style={styles.affirmation}>{affirmation}</Text>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    2025 Affirmania ™️
                </Text>
                <Text style={styles.footerText}>
                    No emotions were harmed in the making of this app.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 80,
        backgroundColor: "#D49B42",
    },
    title: {
        fontSize: 40,
        fontWeight: "700",
        textAlign: "center",
    },
    tagline: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
        opacity: 0.7,
    },
    button: {
        backgroundColor: "#1E90FF",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 20,
        alignSelf: "center",
        width: "70%",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
    },
    affirmation: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 30,
        paddingHorizontal: 20,
        lineHeight: 28,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    footerText: {
        textAlign: "center",
        fontSize: 12,
        opacity: 0.6,
    },
    logoContainer: {
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {
        fontFamily: "Baloo",
        fontSize: 48,
        color: "white",
        textTransform: "lowercase",

        // fake outline using textShadow
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,

        letterSpacing: 1,
    },

});
