import React, { useLayoutEffect, useState }from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
// we want to uset Text from 'react-native-elements' not from the 'react-native'
// and then we can use  'h3'
import { Button, Input, Text } from 'react-native-elements';
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

// initialize variable all we need from the form
// When user finishes typing the last field and press "enter" then it will register. Or just press "Register button"
// from the above: onSubmitEditing={register}
const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login",
        });
    }, [navigation]);

    // .then means if we get this successful, we do something with the "authUser"
    // .catch() means if there is any error, we are going to catch this..
    // 'name' from the fullName
    // || means if there is no picture passed in, we are going to use a default picture.
    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            })
        })
        .catch(error => alert(error.message));
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light"/>
            <Text h3 style={styles.text} >
                Create an account
            </Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    autoFocus
                    type='text'
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input
                    placeholder="Email"
                    type='email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    type='password'
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    placeholder="Profile Picture URL (optional)"
                    type='text'
                    value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)}
                    onSubmitEditing={register}
                />
            </View>
            <Button
                buttonStyle={{backgroundColor:'#778899'}} 
                containerStyle={styles.button}
                raised
                title='Register'
                onPress={register}
            />
            <View style={{height: 50 }}/>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    inputContainer:{
        width: 300,

    },
    button: {
        width: 200,
        marginTop: 10,
    },
    text: {
        marginBottom: 50,
    }
})
