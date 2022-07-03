import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import * as firebase from "firebase";
import { db, auth } from "../firebase";

const ChatScreen = ({navigation, route}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Avatar rounded
                    // messages[0] means the most recent one 
                    // if the photoURL is null, we use a default profile link in the second
                    source={{
                        uri: 
                            messages[0]?.data.photoURL ||
                        "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png"
                    }}
                         />
                    <Text style={{color: "white", marginLeft: 10, fontWeight: "700"}}>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () =>(
                <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20,
                }}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, messages]);

    // we need to know which chat to store data with information below
    // we use doc(route.params.id)
    // go inside that chat, and pass a message by creating another collection
    // called 'messages', and inside the collection "add()" message,
    // we pass an object such as timestamp
    // timestamp here if we use serverTimestamps(), it will display uniform timestamp regardless of regions.
    // server-generated timestamp 

    // 'displayName', 'email', and 'photoURL' from the RegisterScreen.js
    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });
        // after sending a message, clear the textInput.
        setInput("")
    };

    // build an array of messages on the screen 
    // route is a dependency
    // snapshot: the documents can be accessed as an array via the docs property
    // doc: one elem of an array of all the documents in the QuerySnapshot.
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => setMessages(
                snapshot.docs.map(doc => ({
                   id: doc.id,
                   data: doc.data()
                }))
            ));
        //  run one time, then remove yourself.
        return unsubscribe;
    }, [route]);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor:"white"
        }}>
            {/* allows you to control the appearance of the status bar while your app is running. 
            e.g. time, batter icon, wifi icon on the top */}
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                    {/* Fragment shortcut: <> </> */}
                    <>
                        {/* to avoid the chat area touching the top add "contentContainerStyle" */}
                        <ScrollView contentContainerStyle={{paddingTop:15}}>
                            {messages.map(({id, data}) =>(
                                data.email === auth.currentUser.email ? (
                                    // Keys help React identify which items have changed, are added,
                                    // or are removed. Keys should be given to the elements
                                    //  inside the array to give the elements a stable identity
                                    <View key={id} style={styles.receiver}>
                                        <Avatar 
                                        rounded
                                        // WEB
                                        containerStyle={{
                                            position:"absolute",
                                            bottom:-15,
                                            right:-5,
                                        }}
                                        size={30}
                                        position="absolute"
                                        bottom={-15}
                                        right={-5}
                                        source={{
                                            uri: data.photoURL,
                                        }}
                                        />
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                    </View>
                                ): (
                                    <View style={styles.sender}>
                                        <Avatar
                                            rounded
                                            containerStyle={{
                                                position:"absolute",
                                                bottom:-15,
                                                left:-5,
                                            }}
                                            size={30}
                                            position="absolute"
                                            bottom={-15}
                                            left={-5}
                                            source={{
                                                uri: data.photoURL,
                                            }}
                                            
                                        />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        {/* we want to display sender name, not me */}
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput 
                                value={input} 
                                onChangeText={text => setInput(text)}
                                onSubmitEditing={sendMessage}
                                placeholder="Signal Message"
                                style={styles.textInput}
                            />

                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5} >
                                <Ionicons name="send" size={24} color="#2B68E6"/>
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* <Text>{route.params.chatName}</Text> */}
        </SafeAreaView>
    )
}

export default ChatScreen

// receiver: me
const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
    // layer outside the textInput 
    footer:{
        flexDirection : "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    // message text input
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        // to give space between textInput and the "send icon" 
        marginRight: 15,
        //borderColor: "red",
        //borderWidth: 5,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        // position will be on the right side
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    receiverText:{
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
    },
    sender:{
        padding: 15,
        backgroundColor: "#2B68E6",
        // positon will be on the left side
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",
    },
    senderName:{
        left:10,
        paddingRight: 10,
        fontSize: 10,
        color: "white"
    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,
    }

})