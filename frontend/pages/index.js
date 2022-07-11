import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Contract, utils, BigNumber, providers} from 'ethers'
import Web3Modal from 'web3modal'
import {useState, useRef, useEffect} from 'react'
import { lw3ContractAbi,  lw3ContractAddr } from '../constants'


export default function Home() {
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] =  useState("0");

  //const [maxToken, setMaxToken] = useState(zero);

  const web3ModalRef = useRef();



  
  const getTotalTokenMinted = async() => {
     try {
       const provider = await getProviderOrSigner();
       const lw3Contract = new Contract(
        lw3ContractAddr,
        lw3ContractAbi,
        provider
       );

       const tokenMinted = await lw3Contract.tokenId();
       setTokenIdsMinted(tokenMinted.toString());
     } catch (error) {
      console.log(error);
     }
  }
  
  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const lw3Contract = new Contract(
        lw3ContractAddr,
        lw3ContractAbi,
        signer
      );

      const txn = await lw3Contract.mint({
        value: utils.parseEther("0.01")
      });
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await getTotalTokenMinted();
    } catch (e) {
      console.log(e);
    }
  }
  
  
  const getProviderOrSigner = async (signerNeeded = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const {chainId} = await web3Provider.getNetwork();
      if(chainId !== 80001){
        window.alert("Switch Your Network to Mumbai Testnet");
        throw new Error("Switch Your Network to Mumbai Testnet");
      }
      if(signerNeeded){
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.log(err);
    }
  }

  const connectWallet = async () =>{
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  }
  
  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions:{},
        disableInjectedProvider:false
      });
      connectWallet();
      getTotalTokenMinted();
      setInterval(async function() {
        await getTotalTokenMinted();
      }, 5*1000);
    }
  },[]);

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };
  
  
  
  
  
  return (
    <div>
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./1.png" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by LW3Punks</footer>
    </div>
  );
}
