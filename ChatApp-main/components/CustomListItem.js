import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../firebase"

// this component for creating chat room section
const CustomListItem = ({id, chatName, enterChat}) => {
    // we need to implement key and id for the lists of chats in HomeScreen
    // so we pass key to ListItem
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => 
            setChatMessages(snapshot.docs.map((doc) => doc.data()))
        );
        // need to clean up
        return unsubscribe;
    },[chatMessages])
    return (
        <ListItem 
            key={id} 
            onPress={() => enterChat(id, chatName)} 
            bottomDivider>
            <Avatar
                rounded
                size={38}
                // if the chatMessage exists, then access the first element, access the first photoURL
                source= {{
                    uri: chatMessages?.[0]?.photoURL ||
                        "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800"}}>
                    {chatName}
                </ListItem.Title>
                {/* want to show the most recent message */}
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                     {/* ?. for undefined and continue to reference the next one without null value: prevent errors */}
                   {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
