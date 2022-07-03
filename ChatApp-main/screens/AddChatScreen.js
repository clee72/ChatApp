import React, { useLayoutEffect , useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("");

    // hearBackTitle is <chats
    useLayoutEffect( () => {
        navigation.setOptions({
            title: "Add a new chat",
            headerBackTitle: "Chats",
        })

    }, [navigation])

    //we want to store all chats in Cloud Firestore in firebase
    // navigation.goBack() means after user enters chatName it will go back to the prev screen
    const createChat = async () =>{
        await db.collection('chats').add({
            chatName: input
        }).then(() => {
            navigation.goBack()
        }).catch(error => alert(error));

    }
    return (
        <View style={styles.container}>
            <Input 
                placeholder='   Enter a chat name'
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon name="wechat" type="andtdesign" size={24} color="#2F4F4F" />
                }
            />  
            {/* disabled the button unless we type the chat room name */}
            <Button buttonStyle={{backgroundColor:"#778899"}} disabled={!input} onPress={createChat} title='Create new Chat'/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 50,
        height: "100%",
    }
})
