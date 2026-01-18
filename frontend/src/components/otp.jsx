import React, { useRef, useState } from "react";

function OTPInput({ onChangeOTP }) {
  const length = 6;
  const [otp, setOTP] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    onChangeOTP(newOTP.join(""));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    const newOTP = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOTP[i] = pasted[i];
      inputsRef.current[i].value = pasted[i];
    }

    setOTP(newOTP);
    onChangeOTP(newOTP.join(""));
  };

  return (
    <div onPaste={handlePaste} className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          className="w-12 h-14 border-2 rounded-lg text-center text-xl focus:border-blue-600"
        />
      ))}
    </div>
  );
}

export default OTPInput;
