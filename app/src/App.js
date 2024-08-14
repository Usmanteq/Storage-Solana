import React, { useState } from "react";
import "./App.css";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import idl from "./dapp.json";

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = anchor.web3;

// Create a keypair for the account that will hold the variable data
let myAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programiD = new PublicKey(idl.metadata.address);
console.log(programiD, "program Id is set correctly");

//Set out network to devnet
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done"
const opts = {
  preflightCommitment: "processed",
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [retrieveValue, setRetrieveValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  window.onload = async function () {
    try {
      if (window.solana) {
        const solana = window.solana;
        if (solana.isPhantom) {
          console.log("Phantom Wallet found!");
          const res = await solana.connect({ onlyIftrusted: true });
          console.log("Connected with Public Key:", res.publicKey.toString());
          setWalletAddress(res.publicKey.toString());
        }
      } else {
        alert("wallet not found! Get a Phantom Wallet ");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectwallet = async () => {
    if (window.solana) {
      const solana = window.solana;
      const res = await solana.connect();
      setWalletAddress(res.publicKey.toString());
    } else {
      alert("Wallet not found! Get a Phantom Wallet");
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new anchor.AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    console.log(provider, "provider set correctly");
    return provider;
  };

  const Retrieve = async () => {
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl, programiD, provider);
      const account = await program.account.init.fetch(myAccount.publicKey);
      setRetrieveValue(account.value.toString());
      console.log("retrieved value is", retrieveValue);
    } catch (error) {
      console.log("Error in fetching: ", error);
      setRetrieveValue(null);
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const UpdateValue = async () => {};

  return (
    <div>
      <h1>Hello</h1>
      <header className="App-header">
        {!walletAddress && (
          <div>
            <button className="btn" onClick={connectwallet}>
              Connect Wallet
            </button>
          </div>
        )}
        {walletAddress && (
          <div>
            <p>
              Connected account :{" "}
              <span className="address">{walletAddress}</span>
            </p>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
