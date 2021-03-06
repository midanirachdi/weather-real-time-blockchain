const address = '0x48a9ca6e6cc7e5664ccc746213b3e3e6bf88e23d';
const abi = [
  {
    "constant": false,
    "inputs": [],
    "name": "cashout",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amountMonth",
        "type": "uint256"
      }
    ],
    "name": "changeMonthprice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amountticket",
        "type": "uint256"
      }
    ],
    "name": "changeTicketprice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amountWeek",
        "type": "uint256"
      }
    ],
    "name": "changeWeeKprice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "plan",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "week",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "month",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "ticket",
        "type": "uint256"
      }
    ],
    "name": "Sent",
    "type": "event"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
];
module.exports = {
  abi,
  address
}
