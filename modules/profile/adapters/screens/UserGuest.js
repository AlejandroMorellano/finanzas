import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Image, Button } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation()
  return ( 
    <View style = {styles.container}>
        <ScrollView style = {styles.mx} centerContent = {true}>
            <Image source = {require("../../../../assets/hucha.png")}
                resizeMode = "contain"
                style = {styles.img}
            />
            <Text style = {styles.title}>Bienvenido a HuchaPower</Text>
            <Text style = {styles.description}>¿Te gustaría ahorrar dinero?, Nosotros te ayudamos</Text>
            <View style = {styles.viewBtnContainer}>
                <Button title = "Iniciar Sesión"
                    icon = {{
                        name: 'login',
                        type: 'material-community',
                        size: 15,
                        color: 'white'
                    }}
                    buttonStyle = {styles.btn}
                    containerStyle = {styles.btnContainer}
                    onPress = {() => navigation.navigate('loginStack')}
                />
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        height: "100%"
    },

    mx: {
        marginLeft: 32,
        marginRight: 32
    },

    img: {
        width: "100%",
        height: 300
    },

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: "center",
        margin: 16
    },

    description: {
        textAlign: "center",
        marginBottom: 16
    },

    viewBtnContainer: {
        flex: 1,
        alignItems: 'center'
    },

    btn: {
        backgroundColor: 'tomato',
        color: '#fff'
    },

    btnContainer: {
        width: "70%"
    },

})
