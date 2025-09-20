## 1) `package.json`
```json
{
  "name": "business-app-starter",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.3",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.10.0",
    "react-native-safe-area-context": "^4.10.5",
    "react-native-screens": "~3.31.1",
    "@supabase/supabase-js": "^2.45.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2"
  }
}
```

---

## 2) `app.json`
```json
{
  "expo": {
    "name": "Business App Starter",
    "slug": "business-app-starter",
    "scheme": "businessapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A2540"
    },
    "updates": { "enabled": true },
    "assetBundlePatterns": ["**/*"],
    "ios": { "supportsTablet": true },
    "android": { "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#FFFFFF" } },
    "web": { "bundler": "metro", "output": "static" }
  }
}
```

---

## 3) `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

---

## 4) `index.js`
```js
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
```

---

## 5) `src/theme/colors.js`
```js
export const colors = {
  primary: '#0A2540', // navy brand
  accent: '#27AE60',  // green CTA
  bg: '#F6F8FB',
  text: '#1F2A37',
  muted: '#6B7280'
};
```

---

## 6) `src/lib/supabase.js` (optional backend; fill keys to enable)
```js
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR-ANON-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## 7) `src/components/PrimaryButton.js`
```js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../theme/colors';

export default function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[{
        backgroundColor: disabled ? '#9CA3AF' : colors.accent,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        alignItems: 'center'
      }, style]}
    >
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}
```

---

## 8) `src/components/ServiceCard.js`
```js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function ServiceCard({ item, onAdd }) {
  return (
    <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{item.name}</Text>
      <Text style={{ color: colors.muted }}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700' }}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => onAdd(item)} style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.primary, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 9) `src/context/Store.js`
```js
import React, { createContext, useContext, useMemo, useState } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // replace with real auth later

  const addToCart = (item) => setCart((c) => [...c, item]);
  const removeFromCart = (id) => setCart((c) => c.filter((i, idx) => idx !== id));
  const clearCart = () => setCart([]);

  const value = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart, user, setUser }), [cart, user]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
```

---

## 10) `src/App.js`
```js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import LoginScreen from './screens/LoginScreen';
import { StoreProvider } from './context/Store';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0A2540' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}
```

---

## 11) `src/screens/HomeScreen.js`
```js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.primary, marginBottom: 8 }}>Your Business</Text>
      <Text style={{ color: colors.muted, marginBottom: 24 }}>Book services, get deals, and manage your profile.</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Services')} style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 14, marginBottom: 12 }}>
        <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>Browse Services</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ backgroundColor: 'white', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB' }}>
        <Text style={{ color: colors.text, fontWeight: '700', textAlign: 'center' }}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 12) `src/screens/ServicesScreen.js`
```js
import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import { useStore } from '../context/Store';

export default function ServicesScreen({ navigation }) {
  const { addToCart } = useStore();

  const services = useMemo(() => ([
    { id: '1', name: 'Haircut', description: 'Styled cut, 45 min', price: 30 },
    { id: '2', name: 'Manicure', description: 'Classic manicure, 30 min', price: 20 },
    { id: '3', name: 'Massage', description: 'Full body, 60 min', price: 50 }
  ]), []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: '#F6F8FB' }}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ServiceCard item={item} onAdd={(i) => addToCart(i)} />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListFooterComponent={<View style={{ height: 12 }} />}
      />
    </View>
  );
}
```

---

## 13) `src/screens/CartScreen.js`
```js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useStore } from '../context/Store';
import { colors } from '../theme/colors';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, clearCart } = useStore();

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <FlatList
        data={cart}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Text>${item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(index)}>
                <Text style={{ color: '#EF4444', fontWeight: '700' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>Your cart is empty.</Text>}
      />

      <View style={{ borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Checkout')} style={{ marginTop: 12, backgroundColor: colors.accent, padding: 14, borderRadius: 12 }}>
          <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>Proceed to Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearCart} style={{ marginTop: 8, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10 }}>
          <Text style={{ textAlign: 'center', color: colors.text, fontWeight: '600' }}>Clear cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 14) `src/screens/CheckoutScreen.js`
```js
import React from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../context/Store';
import PrimaryButton from '../components/PrimaryButton';

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart } = useStore();
  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePlaceOrder = () => {
    // TODO: integrate Stripe or your payment provider here
    clearCart();
    navigation.popToTop();
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Checkout</Text>
      <Text>Items: {cart.length}</Text>
      <Text style={{ fontWeight: '800' }}>Total: ${total.toFixed(2)}</Text>
      <PrimaryButton title="Place Order" onPress={handlePlaceOrder} />
      <Text style={{ color: '#6B7280' }}>Payment integration placeholder — add Stripe later.</Text>
    </View>
  );
}
```

---

## 15) `src/screens/LoginScreen.js`
```js
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useStore } from '../context/Store';

export default function LoginScreen({ navigation }) {
  const { setUser } = useStore();
  const [email, setEmail] = useState('');

  const signIn = async () => {
    // TODO: swap with real Supabase or Firebase auth
    setUser({ id: 'demo', email });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Sign In</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@business.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: 'white', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' }}
      />
      <PrimaryButton title="Continue" onPress={signIn} />
    </View>
  );
}
```

---

## 16) Quick Start — How to Run
```bash
# 1) Install Expo CLI if needed
npm i -g expo-cli  # or use: npx expo --version

# 2) Create the project folder and add files
mkdir business-app-starter && cd $_
# paste the files above into the correct folders

# 3) Install deps
npm install

# 4) Start the dev server
npm run start

# 5) Open on your phone
# - Install the Expo Go app (iOS/Android)
# - Scan the QR from the terminal or browser
```

---

## 17) (Optional) Next Steps
- **Branding**: update colors, icons, splash in `app.json` and `src/theme/colors.js`.
- **Auth**: connect Supabase/Firebase in `LoginScreen` and `src/lib/supabase.js`.
- **Payments**: add Stripe via `tipsi-stripe` alternatives or `@stripe/stripe-react-native`.
- **Bookings**: create a `bookings` table in your backend; POST from `CheckoutScreen`.
- **Push notifications**: `expo-notifications` for promos/reminders.
- **Publish**: `expo prebuild` then `expo run:android` / `expo run:ios` or use EAS.
