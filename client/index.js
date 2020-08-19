import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;



const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:7545'));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');
  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');
  const $edit = document.getElementById('edit');
  const $editResult = document.getElementById('edit-result');
  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');
  const $crudResult = document.getElementById('crudResult');
  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
   
  });

  

  $create.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const ipv4 = e.target.elements[1].value;
    crud.methods.create(name,ipv4).send({from: accounts[0]})
    .then(result => {
      $createResult.innerHTML = `New  Member ${name} successfully created`;
    })
    .catch(_e => {
      $createResult.innerHTML = `Ooops... there was an error while trying to create a new  Member...`;
    });
  });
  

  $read.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods.read(id).call()
    .then(result => {
      $readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]} IPv4: ${result[2]}`;
    })
    .catch(_e => {
      $readResult.innerHTML = `Ooops... there was an error while trying to read  Member ${id}`;
    });
  });

  

  $edit.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    const ipv4 =e.target.elements[2].value;
    crud.methods.update(id, name,ipv4).send({from: accounts[0]})
    .then(result => {
      $editResult.innerHTML = `Changed name of  Member ${id} to ${name} IPV4 to ${ipv4}`;
    })
    .catch(_e => {
      $editResult.innerHTML = `Ooops... there was an error while trying to update  Member of user ${id} to ${name} IPV4 ${ipv4}`;
    });
  });

  $delete.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods.destroy(id).send({from: accounts[0]})
    .then(result => {
      $deleteResult.innerHTML = `Deleted  Member ${id}`;
    })
    .catch(_e => {
      $deleteResult.innerHTML = `Ooops... there was an error while trying to delete  Member ${id}`;
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
