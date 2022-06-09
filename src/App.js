
import './App.css';

import { NavigationBar } from './components/navigation';
import { AddPicture } from './components/newpicture';
import { Pictures } from './components/renderpictures';
import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import Picturea from "./contracts/picturea.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;



const contractAddress = "0xe91F0323aF3b10B44DC94233767B15fE772e8763";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [pictures, setPictures] = useState([]);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(Picturea, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getPictures = useCallback(async () => {
    const picturesLength = await contract.methods.getPicturesLength().call();
    const pictures = [];
    for (let index = 0; index < picturesLength; index++) {
      let _pictures = new Promise(async (resolve, reject) => {
      let picture = await contract.methods.getPicture(index).call();

        resolve({
          index: index,
          owner: picture[0],
          image: picture[1],
          description: picture[2],
          price: picture[3],
          sold: picture[4]   
        });
      });
      pictures.push(_pictures);
    }


    const _pictures = await Promise.all(pictures);
    setPictures(_pictures);
  }, [contract]);


  const addPicture = async (
    _image,
    _description,
    _price,
 
  ) => {
    let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addPicture(_image, _description, price)
        .send({ from: address });
      getPictures();
    } catch (error) {
      alert(error);
    }
  };

  const modifyPrice = async (_index, _price) => { 
    const price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods.changePrice(_index, price).send({ from: address });
      getPictures();
      alert("you have successfully changed the price");
     
    } catch (error) {
      alert(error);
    }};



  const deletePicture = async (
    _index
  ) => {
    try {
      await contract.methods
        .deletePicture(_index)
        .send({ from: address });
      getPictures();
    } catch (error) {
      alert(error);
    }
  };


  const buyPicture = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = pictures[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.buyPicture(_index).send({ from: address });
      getPictures();
      getBalance();
      alert("you have successfully donated to the writer");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getPictures();
    }
  }, [contract, getPictures]);
  
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <Pictures pictures={pictures} buyPicture={buyPicture} walletAddress={address} modifyPrice={modifyPrice} deletePicture={deletePicture}/>
      <AddPicture addPicture={addPicture} />
    </div>
  );
}

export default App;