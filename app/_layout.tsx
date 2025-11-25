import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [loaded] = useFonts({
        Baloo: require("../assets/fonts/Baloo2-Bold.ttf"),
        DayOfTheTentacle: require("../assets/fonts/DayOfTheTentacle.ttf"),
    });

    if (!loaded) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
