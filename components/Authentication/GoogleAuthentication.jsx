import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import Button from "../../constants/Button";
import Colors from "../../constants/Colors";
import * as Google from "expo-auth-session/providers/google";
import { SafeAreaView } from "react-native-safe-area-context";

// GoogleSignin.configure({
//   androidClientId:
//     "72975761200-16qnfns3n51tk00u5pshhssvprdrdhtm.apps.googleusercontent.com",
//   iosClientId:
//     "72975761200-toca2bq1id1drv1mubidm88be12usb4a.apps.googleusercontent.com",
//   offlineAccess: true,
//   webClientId:
//     "72975761200-16qnfns3n51tk00u5pshhssvprdrdhtm.apps.googleusercontent.com",
// });

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "72975761200-16qnfns3n51tk00u5pshhssvprdrdhtm.apps.googleusercontent.com",
    iosClientId:
      "72975761200-toca2bq1id1drv1mubidm88be12usb4a.apps.googleusercontent.com",
    offlineAccess: true,
    webClientId:
      "72975761200-16qnfns3n51tk00u5pshhssvprdrdhtm.apps.googleusercontent.com",
  });
  useEffect(() => {
    handleGoogleSignIn();
  }, [response]);
  async function handleGoogleSignIn() {
    if (response?.type == "success") {
      await getUserInfo(response.authentication.accessToken);
    }
  }
  const getUserInfo = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = response.json();
      //   await loginToLioServer(userInfo);
    } catch (error) {
      if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const loginToLioServer = async (userInfo) => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_LIOSERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the appropriate content type
        },
        body: JSON.stringify(userinfo), // Use userInfo or other relevant data
      });

      const responseData = await response.json();
    } catch (error) {
      throw new Error("Error");
    }
  };

  return (
    <SafeAreaView>
      <Button
        onPress={() => promptAsync()}
        style={{
          backgroundColor: Colors.light.text,
          width: "80%",
          paddingHorizontal: 30,
        }}
        text="Sign in with Google"
        textStyle={{ color: Colors.light.primary }}
      />
    </SafeAreaView>
  );
};

export default GoogleSignIn;
