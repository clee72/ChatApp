import React, {useState, useEffect} from 'react';// useState for initialization
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';//change top time, wifi icon to white
import { FontAwesome5 } from '@expo/vector-icons'; 
import { auth } from '../firebase';


// Button: by default, flex is applied as a column, therefore, it takes all the columns
// In react native: need to use containerStyles for style, compared to React which can use color="red"
// by using these two feature, it doesn't block the form
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // navigate() means we push onto the stack, if we push it to stack, we have ability to go back using "slide thing"
    // if we login, we really don't want to go back to login page. therefore, we use "replace()"
    // return unsubscribe; means we just need to invoke the function..
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser){
                //console.log("test: ", authUser)
                navigation.replace("Home");
            }
        });

        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => {alert(error)});
    }
    // when we type email, password, the keyboard pops up, not comfortable..
    // to avoid the keyboard, we can add KeyboardAvoidingView.
    // behavior="padding": this is important, this is going to apply padding
    // enalbed: default is true, so we don't need this in the keyboardAvoidingView
    // button property: we cannot use "style={color:"red"}"..
    // register button: when pressed, it shows register screen
    // if a user types a password and press enter key, the user can log in.
    // onSubmitEditing={signIn}

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <FontAwesome5 name="rocketchat" style={{marginBottom: 20}} size={100} color="#BC8F8F" />
            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Email" 
                    autoFocus 
                    type="email" 
                    value={email} 
                    onChangeText={(text) => setEmail(text)}/>
                <Input 
                    placeholder="Password" 
                    secureTextEntry 
                    type="password" 
                    value={password} 
                    onChangeText={(pword) => setPassword(pword)}
                    onSubmitEditing={signIn}
                    />
            </View>
            <Button buttonStyle={{backgroundColor:'#778899'}} titleStyle={{color:'white'}} containerStyle={styles.button} onPress={signIn} title="Login"/> 
            <Button  buttonStyle={{backgroundColor:'#778899'}} onPress={() => navigation.navigate('Register')} containerStyle={styles.button} title="Register"/> 
   
           
            <View style={{ height: 50}} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

// container : custom var, for outer view
// flex : 1 means use up entire container
// alignItem: "center": items are in the center
// justifyContent: "center"
// button: marginTop- we don't want to touch the "login" button
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    inputContainer: {
        width: 300,
    },
    button: {
       width: 200,
       padding: 5,
       

    },

})