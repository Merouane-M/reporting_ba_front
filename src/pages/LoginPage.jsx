import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-sofigrey">
      <div className="relative w-6/7 h-[85vh] rounded-xl overflow-hidden shadow-2xl flex ">
        <img
          src="/LoginImage.jpg"
          alt="Login"
          className="absolute inset-0 w-full h-full object-cover "
        />

        <div className="relative z-10 flex w-full h-full">
          <div className="w-1/2 flex flex-col justify-center items-center  p-12 ">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary absolute top-4 left-4"
            >
              Retour
            </button>

            <img
              src="/logo-sofinance-white.svg"
              alt="Logo"
              className="w-1/3 h-1/3 drop-shadow-3xl object-contain"
            />

            <h1 className="text-4xl text-white mt-6 font-bold drop-shadow-3xl text-center">
              Bienvenue
            </h1>
            <h2 className="text-2xl text-white font-medium mt-2 text-center drop-shadow-3xl">
              sur l’outil de reporting Sofinance
            </h2>
          </div>

          <div className="w-1/2 flex justify-center items-center p-12">
            <LoginForm onSuccess={() => navigate("/home")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
