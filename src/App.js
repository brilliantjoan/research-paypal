import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState()

  useEffect(() => {
    getApiToken()
  }, [])

  const getApiToken = async () => {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');

    // api to get access token to access all other api
    const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', body, {
      auth: {
        username: "AYSqxS5OfccCMFJ_wahjEs27Oz4qjSqgsPClpesEED0cE3IivuVaqoVPEqycsYZrEKGx9ehZ3HovfOYP",
        password: "ECMb8SrAnHL0vfFnC64NZcYZyg8dutAECkNfLzDrmwQlocD7PePzQKOoJyl0b-J9fb1Fza4xazEJRdW9"
      }
    })
    const data = await response.data;
    setToken(data.access_token)
  }

  useEffect(() => {
    if (token && !user) {
      getUserInfo(token)
    }
  }, [token])

  const getUserInfo = async (token) => {
    // api to get user info
    const response = await axios.get('https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.data;
    setUser(data)
  }

  return (
    <div>
      token: {token} <br />
      user: {JSON.stringify(user)}
    </div >
  );
}

export default App;
