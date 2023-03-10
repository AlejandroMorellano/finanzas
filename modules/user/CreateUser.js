import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view' 
import { isEmpty, size } from 'lodash' 
import { Image, Input, Button, Icon } from '@rneui/base'
import Loading from '../../kernel/components/Loading';
import { validateEmail } from '../../kernel/validations'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateUser(props) {
    const {navigation} = props;
    const payload = {email: '', password: '', repeatPassword: ''}
    const [show, setShow] = useState(false)
    const [error, setError] = useState(payload)
    const [data, setData] = useState(payload)
    const [showPassword, setShowPassword] = useState(true)
    const [showRepeatPassword, setShowRepeatPassword] = useState(true)

    const changePayload = (e, type) => {
        setData({...data,[type]: e.nativeEvent.text})
    }

    const auth = getAuth();
    const createUser = () => {
        if(!(isEmpty(data.email) || isEmpty(data.password))){
            if(validateEmail(data.email)){
                if(size(data.password) >= 6){
                    if(data.password == data.repeatPassword){
                        console.log("CreateUser: Listo para iniciar sesion");
                        createUserWithEmailAndPassword(auth, data.email, data.password)
                        .then(async (userCredential) => {
                          // Signed in 
                          const user = userCredential.user;
                          try {
                            await AsyncStorage.setItem('@session', JSON.stringify(user))
                          } catch (e) {
                            // saving error
                            console.log("ERROR! CreateUser storage: ", e)
                          }
                          setShow(false);
                          navigation.navigate("profileStack");
                         // ...
                      })
                      .catch((error) => {
                        setShow(false)
                        setError({email: '', password: 'Usuario o contraseña incorrectos'});
                        const errorCode = error.code;
                        const errorMessage = error.message;
                      // ..
                      });
                        setError(payload)
                    }else{
                        setError({email: '', password: 'Las contraseñas deben coincidir', 
                            repeatPassword: 'Las contraseñas deben coincidir'
                        })
                    }
                }else{
                    setError({email: '', password: 'Minimo 6 caracteres', repeatPassword: 'Minimo 6 caracteres'})
                }
            }else{
                setError({email: 'Email no valido', password: '', repeatPassword: ''})
            }
        }else{
            setError({email: 'Campo obligatorio', password: 'Campo obligatorio', 
                repeatPassword: 'Campoobligatorio'
            })
        }
    }

  return (
    <KeyboardAwareScrollView>
        <Image 
            source = {require('../../assets/hucha.png')}
            resizeMode = 'contain'
            style = {styles.logo}
        />

        <View style = {styles.viewForm}>
            <View style = {styles.container}>
                <Input placeholder = "Correo electronico"
                    keyboardType = "email-address"
                    rightIcon = {
                        <Icon type = "material-community" name = "email-outline" size = {22}/>
                    }
                    containerStyles = {styles.input}
                    onChange = {(e) => changePayload(e, "email")}
                    errorMessage = {error.email}
                    autoCapitalize = "none"
                />

                <Input placeholder = "Contraseña"
                    containerStyles = {styles.input}
                    rightIcon = {
                        <Icon type = "material-community" name = {showPassword ? 'eye-off-outline': 'eye-outline'} size = {22}
                            onPress = {() => setShowPassword(!showPassword)}
                        />
                    }
                    secureTextEntry = {showPassword}
                    onChange = {(e) => changePayload(e, "password")}
                    errorMessage = {error.password}
                />

                <Input placeholder = "Repetir contraseña"
                    containerStyles = {styles.input}
                    rightIcon = {
                        <Icon type = "material-community" name = {showRepeatPassword ? 'eye-off-outline': 'eye-outline'} size = {22}
                            onPress = {() => setShowRepeatPassword(!showRepeatPassword)}
                        />
                    }
                    secureTextEntry = {showRepeatPassword}
                    onChange = {(e) => changePayload(e, "repeatPassword")}
                    errorMessage = {error.repeatPassword}
                />

                <Button 
                    title = 'Crear cuenta'
                    containerStyles = {styles.btnContainer}
                    buttonStyles = {styles.btn}
                    onPress = {createUser}
                />
            </View>
        </View>

        <Loading show={show} text ='Registrar usuario'/>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 150,
        marginTop: 20
    },

    viewForm: {
        marginHorizontal: 20
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifiContect: 'center',
        marginTop: 20
    },

    input: {
        width: '100%',
        marginVertical: 10
    },

    btnContainer: {
        marginBottom: 20,
        width: '95%'
    },

    btn: {
        backgroundColor: '#28a745'
    }
})