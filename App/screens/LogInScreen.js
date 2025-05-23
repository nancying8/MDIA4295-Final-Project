// Import react, useState, useEffect from react
import React, { useEffect, useState } from 'react';
// Importing essential React Native components for StyleSheet, View, ImageBackground, ScrollView 
import { StyleSheet, View, ImageBackground, ScrollView } from 'react-native';
// Import Text, Button from @rneui/themed
import { Button, Text } from '@rneui/themed';
// Import useForm for form handling
import { useForm } from "react-hook-form";
// Yup for schema validation
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Custom input component to connect form fields to react-hook-form
import TextInputControl from '../components/TextInputControl';

// Custom login service (fake or real) that checks username/password
import { authenticate } from '../services/LoginManager';
// Custom hook for managing user state (context or global state)
import { useUserState } from '../services/UserState';
// Import global themePalette from AdoptlyTheme
import { themePalette } from '../theme/AdoptlyTheme';

// Validation schema for form using Yup
const schema = yup.object({
  username: yup.string().trim().required("required"),
  password: yup.string().trim().required("required")
});

// Log in
// use userState could access global user state
// loginError > // Error flag for invalid login
// React Hook Form setup with default values and validation
// Defatul values is a sample default for usernamr and password
// Using the useEffect.clearUser will clear user session on mount
//  authenticate(data) will validate login credentials
export default function LogInScreen({ navigation }) {
  const userState = useUserState();
  const [loginError, setLoginError] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "A00000001",
      password: "password01",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    userState.clearUser();
  }, []);

  const onLogin = (data) => {
    const status = authenticate(data);
    if (status !== false) {
      userState.setUser(status);
      navigation.replace('MainNavigation');
    } else {
      setLoginError(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: 'https://i.imgur.com/HnJJQjD.jpeg' }}
        resizeMode="cover"
      />

      <View style={styles.container}>
        <Text h1 style={styles.title}>Adoptly 🐾</Text>
        <Text h3 style={{ marginBottom: 5 }}>Find Your Best Friend</Text>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text>Username</Text>
          <TextInputControl
            control={control}
            errors={errors}
            inputMode="text"
            placeholder="username"
            fieldname="username"
          />

          <Text>Password</Text>
          <TextInputControl
            control={control}
            errors={errors}
            inputMode="text"
            secureEntry={true}
            placeholder="password"
            fieldname="password"
          />
        <Button
          title="Login"
          raised
          onPress={() => {
            handleSubmit((data) => {
              onLogin(data);
              navigation.navigate('MainNavigation');
            })();
          }}
          containerStyle={{ marginVertical: 10 }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        


          {loginError && (
            <Text style={{ color: themePalette.error, fontWeight: 'bold' }}>
              Login error, try again or continue as guest
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Button
              title="Sign Up"
              raised
              onPress={() => {
                handleSubmit(onLogin)();
                navigation.navigate('MainNavigation');
              }}              
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
            <Button
              title="Continue as Guest"
              raised
              onPress={() => navigation.navigate('MainNavigation')}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </View>
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255,0.7)',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginTop: 150,
    marginBottom: 50,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9c46a',
    padding: 10,
    marginTop: 30,
    gap: 30,
    borderRadius: 5,
  },
  bannerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    marginTop: 50,
    backgroundColor: 'rgba(60, 162, 235, 0.5)',
    padding: 20,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  button: {
    backgroundColor: '#e76f51',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent', 
},

buttonText: {
    fontWeight:'bold',
    color: 'white',
    fontSize: 16,
},
});
