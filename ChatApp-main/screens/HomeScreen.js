import React, { useEffect, useState, useLayoutEffect} from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from "../firebase";
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';

//    <Avatar rounded source={{uri: auth?.currentUser?.photoURL}}/> shows logged in profile picture
//    <TouchableOpacity> when user clicks the picture, the opacity changes.
// replace() HomeScreen to LoginScreen 
const HomeScreen = ({navigation}) => {
    
    const [chats, setChats ] = useState([]);// by default, it's an empty array.

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    };


    //By using this Hook(useEffect), you tell React that your component needs to do something after rende
    // doc.id is 'zp9dAqOyQUEtmAKrDbCH', doc.data() is chatName:"Signal clone chat" in the Cloud Firestore

    useEffect(()=>{
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc =>({
                id:doc.id,
                data: doc.data()
            })))
        ))
        return () => unsubscribe();
    }, [])

    useLayoutEffect(() =>{
        navigation.setOptions({
            title: 'Signal',
            headerStyle:{backgroundColor: "#fff" },
            headerTitleStyle: {color: "black"},
            headerTintColor: "red",
            headerLeft: () => (
             <View style={{marginLeft: 20 }} >
                <TouchableOpacity onPress = {signOutUser} activeOpacity={0.5}>
                <Avatar rounded source={{uri: auth?.currentUser?.photoURL}}/>
                </TouchableOpacity>
            </View>
            ),
            headerRight: () => ( 
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20,
                }}
                >
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    {/* when we click the pencil, it will show a different screen 'AddChat' */}
                    <TouchableOpacity onPress={() => navigation.navigate('AddChat')} activeOpacity={0.5}> 
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
          id,
          chatName,
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {/* chats : destructure => id, data */}
                {/* key allows you to have efficient rendering of the lists */}
                {chats.map(({id, data:{chatName}}) => (
                    <CustomListItem 
                    key={id}
                    id={id} 
                    chatName={chatName}
                    enterChat={enterChat}
                    />

                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        height: '100%',
        
    }
})
