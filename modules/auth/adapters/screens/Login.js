import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { Input, Button, Image, Icon } from '@rneui/base'
import { isEmpty } from 'lodash';
import Loading from '../../../../kernel/components/Loading';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login(props) {
    const {navigation} = props;
    const [error/*GET*/, setError/*SET*/] = useState({email:'', password:''});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);;
    const [show, setShow] = useState(false);
    //const [failSession, setFailSession] = useState(false);
    const auth = getAuth();

    const login = () => {
      if(!(isEmpty(email) || isEmpty(password))){
        setShow(true)
        setError({email: '', password: ''});
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            try {
              await AsyncStorage.setItem('@session', JSON.stringify(user))
            } catch (e) {
              // saving error
              console.log("ERROR! Login storage: ", e)
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
      }else{
        setError({email: 'Campo obligatorio', password: 'Campo obligatorio'});
      }
    }
  return (
    <View syle = {styles.container}>
      <ScrollView>
        <Image source = {require('../../../../assets/hucha.png')} 
          resizeMode = 'contain'
          style = {styles.logotype}
        />

        <Input //label = 'Correo electrónico'
          //labelStyle  = {{color: 'tomato', fontSize: 14}}
          placeholder = 'Correo electrónico'
          keyboardType = 'email-address'
          containerStyle = {styles.input}
          onChange = {(event) => setEmail(event.nativeEvent.text)}//optener lo que el usuario escribe
          errorMessage = {error.email}
          autoCapitalize = "none"
        />

        <Input //label = 'Correo electrónico'
          //labelStyle  = {{color: 'tomato', fontSize: 14}}
          placeholder = 'Contraseña'
          containerStyle = {styles.input}
          onChange = {(event) => setPassword(event.nativeEvent.text)}//optener lo que el usuario escribe
          secureTextEntry = {showPassword}
          rightIcon = {
            <Icon type= "material-community"
              name = {showPassword ? 'eye-off-outline' : 'eye-outline'}
              color = '#007bff'
              onPress = {() => setShowPassword(!showPassword)}
            />
          }
          errorMessage = {error.password}
        />

        <Button title = 'Iniciar Sesión'
          icon = {
            <Icon type = 'material-community'
              name = 'login'
              size = {22}
              color = '#fff'
            />
          }
          buttonStyle = {styles.btnSuccess}
          containerStyle = {styles.btnContainer}
          onPress = {login}
        />
        <Text style={styles.createAccount} 
          onPress = {() => console.log("OK")}>
            ¡Registrate!
        </Text>
        <Loading show={show} text='Iniciando Sesión'/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: "100%"
  },

  logotype: {
    width: "100%",
    height: 150,
    marginTop: 16,
    marginBottom: 16
  },

  input: {
    width: '100%',
    marginBottom: 16,
  },

  btnSuccess: {
    color: '#fff',
    backgroundColor: '#28a745'
  },

  btnContainer: {
    margin: 16
  },

  createAccount:{
    color: '#007bff'
  },

});
