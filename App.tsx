import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { ScotProvider } from "./context/provider";
import HomeScreen from "./pages/Home";
import StatsScreen from "./pages/Stats";
import { store } from "./redux/store";
import { ThemeProvider } from "./theme/ThemeProvider";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GestureHandlerRootView
          style={{ flex: 1 }}
          accessibilityLabel="app-root"
        >
          <ScotProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Stats" component={StatsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ScotProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}
