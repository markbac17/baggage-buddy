import React, { Component , useEffect } from "react";
import { render } from "react-dom";
import QrCode from "react.qrcode.generator";
import qrcode from "qrcode";

function CustomerQRCode(props) {
  const generateQr = () => {
    const qr = document.querySelector("#qr");
    qrcode.toCanvas(qr,"http://baggage-buddy.duckdns.org:9012/" + props.data,
      error => {
        // qrcode.toCanvas(qr, "https://tourismpreneur.netlify.com/guest/5aa61118-bdf0-554f-9ed7-700891d7e977", error => {
        if (error) console.error(error);
        console.log("Success!");
      }
    );
  };
  useEffect(() => {
    generateQr();
  }, []);

  return (
    <div>
      <QrCode value="http://baggage-buddy.duckdns.org:9012" size="200" />
    </div>
  );
}

export default CustomerQRCode