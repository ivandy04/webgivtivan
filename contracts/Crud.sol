pragma solidity >=0.4.21 <0.6.0;


contract Crud {
  struct User {
    uint id;
    string name;
    string ipv4;
  }
  User[] public users;
  uint public nextId = 1;

  constructor() public{
       create("DJarum","233.121.4.55");
       create("Gudang Garam","221.33.45.2");
    }

  function create(string memory name,string memory ip) public {
    users.push(User(nextId, name,ip));
    nextId++;
  }

  function read(uint id) view public returns(uint, string memory,string memory) {
    uint i = find(id);
    return(users[i].id, users[i].name, users[i].ipv4);
  }


  function update(uint id, string memory name, string memory ip) public {
    uint i = find(id);
    users[i].name = name;
    users[i].ipv4 = ip;
  }

  function destroy(uint id) public {
    uint i = find(id);
    delete users[i];
  }

  function find(uint id) view internal returns(uint) {
    for(uint i = 0; i < users.length; i++) {
      if(users[i].id == id) {
        return i;
      }
    }
    revert(' Member does not exist!');
  }

}
