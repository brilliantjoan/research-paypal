import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


function App() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState()
  let PayPalButton;


  if (window.paypal !== undefined) {
    PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
  }

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

  function _createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "1",
          },
        },
      ],
    });
  }
  async function _onApprove(data, actions) {
    let order = await actions.order.capture();
    console.log(order);
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(order));
    return order;
  }
  function _onError(err) {
    console.log(err);
    let errObj = {
      err: err,
      status: "FAILED",
    };
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
  }

  return (
    <div>
      token: {token} <br />
      user: {JSON.stringify(user)} <br /> <br />
      using 3rd party library
      <PayPalScriptProvider options={{ "client-id": "AYSqxS5OfccCMFJ_wahjEs27Oz4qjSqgsPClpesEED0cE3IivuVaqoVPEqycsYZrEKGx9ehZ3HovfOYP" }}>
        <PayPalButtons style={{ layout: "horizontal" }} />
        using window.paypal
      </PayPalScriptProvider>
      {window.paypal !== undefined && (<PayPalButton
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onCancel={() => _onError("CANCELED")}
        onError={(err) => _onError("ERROE")}
      />)}
    </div >
  );
}

export default App;
