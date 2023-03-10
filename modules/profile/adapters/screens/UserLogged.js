import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Avatar } from "@rneui/base";
import Loading from "../../../../kernel/components/Loading";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from 'firebase/auth';
import * as Imagepicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
//import { getAuth, updateProfile } from "firebase";

export default function UserLogged(props) {
  const auth = getAuth();
  const { user } = props;
  const [show, setShow] = useState(false);

  /*const removeValue = async () => {
    try {
      setShow(true)
      await AsyncStorage.removeItem('@session')
      setShow(false)
      setReload(true)
    } catch(e) {
    }
  }*/

  const uploadImage = async (uri) => {
    setShow(true);
    const response = await fetch(uri);
    const { _bodyBlob } = response;
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}`);
    return uploadBytes(storageRef, _bodyBlob);
  };

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(Permissions.CAMERA);
    if (resultPermission.permissions.camera.status !== "denied") {
      let result = await Imagepicker.launchImageLibraryAsync({
        mediaTypes: Imagepicker.mediaTypesOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        uploadImage(result.assets[0].uri)
          .then((response) => {
            uploadPhotoProfile();
          })
          .catch((err) => {
            console.log("error foto: ", err);
          });
      } else {
        console.log("No se selecciono una imagen");
      }
    }
  };

  const uploadPhotoProfile = () => {
    const storage = getStorage();
    getDownloadURL(ref(storage, `avatars/${user.uid}`))
      .then((url) => {
        updateProfile(auth.currentUser, {
          photoURL: url,
        });
        console.log("respuesta firestore: ", response);
      })
      .then(() => {
        setShow(false);
      })
      .catch((error) => {
        setShow(false);
        console.log("fallo uploadPhotoProfile: ", error);
      });
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.infoContainer}>
          <Avatar
            size="large"
            rounded
            source={{uri: user.photoURL}}
            containerStyle={styles.avatar}
          >
            <Avatar.Accesory size={22} onPress={changeAvatar} />
          </Avatar>
          <View>
            <Text style={styles.displayName}>
              {user.providerData[0].displayName
                ? user.providerData[0].displayName
                : "Anonimo"}
            </Text>
            <Text>{user.providerData[0].email}</Text>
          </View>
        </View>
      )}
      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.btn}
        onPress={() => auth.signOut()}
      />
      <Loading show={show} text="Actualizando Imagen" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
  },

  btn: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "tomato",
    paddingVertical: 10,
  },

  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 30,
  },

  avatar: {
    marginRight: 16,
  },

  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
