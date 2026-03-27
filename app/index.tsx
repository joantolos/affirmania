import { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Easing,
    PanResponder,
    Modal,
    Linking,
} from "react-native";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TierName, validationTiers } from "@/src/data/validationTiers";
import { tagLines } from "@/src/data/tagLines";

type ConfettiHandle = { start: () => void };

const TIERS: TierName[] = ["Mildly Noticed", "Hyper Esteem", "Delusional Greatness"];

const TIER_ACCENT: Record<TierName, string> = {
    "Mildly Noticed": "#F4D060",
    "Hyper Esteem": "#F07040",
    "Delusional Greatness": "#E0306A",
};

const TIER_ICONS: Record<TierName, keyof typeof Ionicons.glyphMap> = {
    "Mildly Noticed": "sunny-outline",
    "Hyper Esteem": "star-outline",
    "Delusional Greatness": "rocket-outline",
};


function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const [affirmation, setAffirmation] = useState("");
    const [selectedTier, setSelectedTier] = useState<TierName>("Mildly Noticed");
    const [tagline, setTagline] = useState("");
    const [activeDragTier, setActiveDragTier] = useState<TierName | null>(null);
    const [aboutVisible, setAboutVisible] = useState(false);

    const popSoundRef = useRef<Audio.Sound | null>(null);
    const confettiRef = useRef<ConfettiHandle | null>(null);
    const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activeDragTierRef = useRef<TierName | null>(null);
    const selectedTierRef = useRef<TierName>("Mildly Noticed");
    const generateRef = useRef<((tier: TierName) => void) | null>(null);

    const textOpacityAnim = useRef(new Animated.Value(0)).current;
    const textTranslateYAnim = useRef(new Animated.Value(0)).current;
    const arrowBounce = useRef(new Animated.Value(0)).current;
    const pendingAffirmation = useRef<{ text: string; tier: TierName } | null>(null);

    useEffect(() => {
        setTagline(pickRandom(tagLines));

        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(arrowBounce, { toValue: -10, duration: 520, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(arrowBounce, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        );
        loop.start();

        let isMounted = true;
        (async () => {
            try {
                const sound = new Audio.Sound();
                await sound.loadAsync(require("../assets/sounds/pop.mp3"));
                if (!isMounted) { await sound.unloadAsync(); return; }
                popSoundRef.current = sound;
            } catch (e) {
                console.warn("Could not load pop sound", e);
            }
        })();

        return () => {
            isMounted = false;
            loop.stop();
            if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
            void popSoundRef.current?.unloadAsync();
        };
    }, [arrowBounce]);

    const animateIn = useCallback(() => {
        textTranslateYAnim.setValue(50);
        textOpacityAnim.setValue(0);
        Animated.parallel([
            Animated.timing(textOpacityAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
            Animated.spring(textTranslateYAnim, { toValue: 0, friction: 7, tension: 100, useNativeDriver: true }),
        ]).start();
    }, [textOpacityAnim, textTranslateYAnim]);

    const generateAffirmation = useCallback((tier: TierName) => {
        void popSoundRef.current?.replayAsync();
        setSelectedTier(tier);
        setTagline(pickRandom(tagLines));

        const next = pickRandom(validationTiers[tier]);
        pendingAffirmation.current = { text: next, tier };

        Animated.parallel([
            Animated.timing(textOpacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.timing(textTranslateYAnim, { toValue: -40, duration: 150, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]).start(() => {
            const pending = pendingAffirmation.current;
            if (!pending) return;
            pendingAffirmation.current = null;
            setAffirmation(pending.text);
            animateIn();
            if (pending.tier === "Delusional Greatness") {
                if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
                confettiTimeoutRef.current = setTimeout(() => {
                    confettiRef.current?.start();
                }, 100);
            }
        });
    }, [textOpacityAnim, textTranslateYAnim, animateIn]);

    useEffect(() => {
        generateRef.current = generateAffirmation;
    }, [generateAffirmation]);

    useEffect(() => {
        selectedTierRef.current = selectedTier;
    }, [selectedTier]);

    useEffect(() => {
        generateAffirmation("Mildly Noticed");
    }, [generateAffirmation]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gs) => gs.dy < -20,
            onPanResponderGrant: () => {
                const tier = selectedTierRef.current;
                activeDragTierRef.current = tier;
                setActiveDragTier(tier);
            },
            onPanResponderRelease: () => {
                const tier = activeDragTierRef.current;
                activeDragTierRef.current = null;
                setActiveDragTier(null);
                if (tier) generateRef.current?.(tier);
            },
            onPanResponderTerminate: () => {
                activeDragTierRef.current = null;
                setActiveDragTier(null);
            },
        })
    ).current;

    const showArrows = !activeDragTier;

    return (
        <View style={styles.screen} {...panResponder.panHandlers}>

            <View style={[styles.content, { paddingTop: Math.max(insets.top, 50) }]}>

                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>affirmania</Text>
                    <Pressable
                        style={styles.infoButton}
                        onPress={() => setAboutVisible(true)}
                        accessibilityLabel="About"
                        accessibilityRole="button"
                    >
                        <Ionicons name="information-circle-outline" size={26} color="rgba(255,255,255,0.7)" />
                    </Pressable>
                </View>

                {/* Tagline — only shown when no affirmation is on screen */}
                {!affirmation && (
                    <Text style={styles.tagline}>{tagline}</Text>
                )}

                {/* Center — affirmation text or idle prompt */}
                <View style={styles.centerArea}>
                    {affirmation ? (
                        <Animated.Text
                            style={[
                                styles.affirmationText,
                                {
                                    opacity: textOpacityAnim,
                                    transform: [
                                        { translateY: textTranslateYAnim },
                                    ],
                                },
                            ]}
                        >
                            {affirmation}
                        </Animated.Text>
                    ) : (
                        activeDragTier ? (
                            <Text style={[styles.activeDragLabel, { color: TIER_ACCENT[activeDragTier] }]}>
                                {activeDragTier}
                            </Text>
                        ) : null
                    )}
                </View>

                {/* Pull hint — only bounces when idle with no affirmation */}
                <Animated.View
                    style={[
                        styles.pullHintContainer,
                        !affirmation && showArrows && { transform: [{ translateY: arrowBounce }] },
                    ]}
                >
                    <Text style={styles.pullHintText}>
                        {activeDragTier
                            ? "↑  release to validate  ↑"
                            : affirmation
                                ? tagline
                                : "↑  pull up to get validated  ↑"}
                    </Text>
                </Animated.View>

            </View>

            {/* Bottom nav bar */}
            <View style={[styles.navBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
                {TIERS.map((tier) => {
                    const isSelected = tier === selectedTier;
                    const accentColor = TIER_ACCENT[tier];
                    return (
                        <Pressable
                            key={tier}
                            style={({ pressed }) => [styles.navTab, pressed && { opacity: 0.6 }]}
                            onPress={() => generateRef.current?.(tier)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: tier === selectedTier }}
                            accessibilityLabel={tier}
                        >
                            <Ionicons
                                name={isSelected ? TIER_ICONS[tier].replace("-outline", "") as keyof typeof Ionicons.glyphMap : TIER_ICONS[tier]}
                                size={26}
                                color={isSelected ? accentColor : "rgba(255,255,255,0.38)"}
                            />
                            <Text style={[styles.navTabLabel, isSelected && { color: accentColor }]}>
                                {tier}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Modal
                visible={aboutVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAboutVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setAboutVisible(false)}>
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                        <Text style={styles.modalTitle}>About</Text>
                        <Text style={styles.modalBody}>2025 Affirmania ™️</Text>
                        <Text style={styles.modalBody}>The single greatest misuse of software engineering talent since blockchain smoothies.</Text>
                        <Text style={styles.modalBody}>No emotions were harmed in the making of this app.</Text>
                        <Pressable onPress={() => Linking.openURL("https://www.joantolos.com")}>
                            <Text style={styles.modalLink}>Want to know more?</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <ConfettiCannon
                ref={confettiRef}
                count={80}
                origin={{ x: -10, y: 0 }}
                fadeOut={true}
                autoStart={false}
                explosionSpeed={350}
                fallSpeed={3000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#D49B42",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    infoButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        padding: 8,
    },
    logoText: {
        fontFamily: "DayOfTheTentacle",
        fontSize: 86,
        color: "white",
        textTransform: "lowercase",
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 6,
        color: "white",
        opacity: 0.7,
    },
    centerArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    affirmationText: {
        fontFamily: "Baloo",
        fontSize: 44,
        color: "white",
        textAlign: "center",
        lineHeight: 58,
        textShadowColor: "rgba(0,0,0,0.25)",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    activeDragLabel: {
        fontFamily: "Baloo",
        fontSize: 34,
        fontWeight: "700",
        textAlign: "center",
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    pullHintContainer: {
        alignItems: "center",
        paddingBottom: 16,
    },
    pullHintText: {
        fontFamily: "Baloo",
        fontSize: 16,
        color: "white",
        opacity: 0.9,
        textAlign: "center",
    },

    // Bottom nav bar
    navBar: {
        flexDirection: "row",
        backgroundColor: "rgba(28, 12, 2, 0.88)",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(255,255,255,0.15)",
        paddingTop: 10,
    },
    navTab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 4,
    },
    navTabLabel: {
        fontFamily: "Baloo",
        fontSize: 11,
        color: "rgba(255,255,255,0.38)",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    modalCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 28,
        width: "100%",
        alignItems: "center",
        gap: 16,
    },
    modalTitle: {
        fontFamily: "Baloo",
        fontSize: 28,
        color: "#333",
    },
    modalBody: {
        fontFamily: "Baloo",
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        lineHeight: 24,
    },
    modalLink: {
        fontFamily: "Baloo",
        fontSize: 16,
        color: "#D49B42",
        textDecorationLine: "underline",
        textAlign: "center",
    },
});
