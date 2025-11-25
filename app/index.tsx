import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Easing,
    StyleSheet as RNStyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";

import TierSelector from "../src/components/TierSelector";
import { TierName, validationTiers } from "@/src/data/validationTiers";
import { tagLines } from "@/src/data/tagLines"; // ← NEW IMPORT

export default function HomeScreen() {
    const [selectedTier, setSelectedTier] = useState<TierName | null>(null);
    const [affirmation, setAffirmation] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const popSound = useRef<Audio.Sound | null>(null);

    // NEW: tagline state
    const [tagline, setTagline] = useState("");

    const pickRandomTagline = () => {
        const random = tagLines[Math.floor(Math.random() * tagLines.length)];
        setTagline(random);
    };

    // Pick random tagline once
    useEffect(() => {
        pickRandomTagline();

        // load pop sound
        (async () => {
            const sound = new Audio.Sound();
            await sound.loadAsync(require("../assets/sounds/pop.wav"));
            popSound.current = sound;
        })();

        return () => {
            // unload
            if (popSound.current) {
                popSound.current.unloadAsync();
            }
        };
    }, []);

    // Animations
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    // --- Tier-Specific Animations ---
    const animateMildlyNoticed = () => {
        scaleAnim.setValue(0.97);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 180,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateHyperEsteem = () => {
        translateYAnim.setValue(-20);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.spring(translateYAnim, {
                toValue: 0,
                friction: 5,
                tension: 120,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateDelusionalGreatness = () => {
        scaleAnim.setValue(0.3);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.25,
                    duration: 180,
                    easing: Easing.out(Easing.back(3)),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 120,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const generateAffirmation = () => {
        if (!selectedTier) return;

        // play pop sound
        if (popSound.current) {
            popSound.current.replayAsync();
        }

        const options = validationTiers[selectedTier];
        const random = options[Math.floor(Math.random() * options.length)];
        setAffirmation(random);

        // reset animation state
        opacityAnim.setValue(0);
        scaleAnim.setValue(1);
        translateYAnim.setValue(0);

        setIsPopupVisible(true);

        // tier-specific animation
        if (selectedTier === "Mildly Noticed") animateMildlyNoticed();
        else if (selectedTier === "Hyper Esteem") animateHyperEsteem();
        else animateDelusionalGreatness();
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        pickRandomTagline();
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>affirmania</Text>
            </View>

            {/* NEW: dynamic tagline */}
            <Text style={styles.tagline}>{tagline}</Text>

            <TierSelector selected={selectedTier} onSelect={setSelectedTier} />

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    !selectedTier && { opacity: 0.4 },
                    pressed && { transform: [{ scale: 0.96 }] }, // tiny bounce
                ]}
                disabled={!selectedTier}
                onPress={generateAffirmation}
            >
                <Text style={styles.buttonText}>Validate Me!</Text>
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.footerText}>2025 Affirmania ™️</Text>
                <Text style={styles.footerText}>The single greatest misuse of software engineering talent since blockchain smoothies.</Text>
                <Text style={styles.footerText}>
                    No emotions were harmed in the making of this app.
                </Text>
            </View>

            {/* --- POPUP OVERLAY --- */}
            {isPopupVisible && (
                <View style={styles.popupContainer}>
                    {/* Blurred backdrop */}
                    <Pressable style={styles.backdropPress} onPress={closePopup}>
                        <BlurView
                            intensity={40}
                            tint="dark"
                            style={RNStyleSheet.absoluteFillObject}
                        />
                    </Pressable>

                    {/* Popup card */}
                    <Animated.View
                        style={[
                            styles.popupCard,
                            {
                                opacity: opacityAnim,
                                transform: [
                                    { scale: scaleAnim },
                                    { translateY: translateYAnim },
                                ],
                            },
                        ]}
                    >
                        <Pressable style={styles.closeButton} onPress={closePopup}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </Pressable>

                        <Text style={styles.popupTitle}>{selectedTier}</Text>

                        <Text style={styles.popupText}>{affirmation}</Text>
                    </Animated.View>
                </View>
            )}
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
    tagline: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
        opacity: 0.7,
    },
    button: {
        backgroundColor: "#FF6F61",
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,

        // Cartoon shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,

        alignSelf: "center",
        marginTop: 30,
    },
    buttonText: {
        fontFamily: "Baloo",
        color: "white",
        fontSize: 22,
        textAlign: "center",
        fontWeight: "700",
        letterSpacing: 1,
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
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,
        letterSpacing: 1,
    },

    // --- POPUP ---
    popupContainer: {
        ...RNStyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    backdropPress: {
        ...RNStyleSheet.absoluteFillObject,
    },
    popupCard: {
        backgroundColor: "white",
        borderRadius: 24,
        width: "85%",
        maxWidth: 340,
        paddingVertical: 28,
        paddingHorizontal: 22,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: "absolute",
        top: 8,
        right: 14,
        padding: 4,
        zIndex: 2,
    },
    closeButtonText: {
        fontSize: 26,
        lineHeight: 26,
    },
    popupTitle: {
        fontFamily: "Baloo",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,

        textShadowColor: "rgba(0, 0, 0, 0.35)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,

        letterSpacing: 1,
    },
    popupText: {
        fontFamily: "Baloo",
        fontSize: 26,
        textAlign: "center",
        lineHeight: 34,
        paddingHorizontal: 10,
    },
});
