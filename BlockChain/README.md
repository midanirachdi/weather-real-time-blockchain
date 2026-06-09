# BlockChain

Ethereum subscription payments for the Nammumu weather platform. Users pay in ETH for a ticket, weekly, or monthly subscription; the backend records each purchase when the contract emits a `Sent` event.

## 🗂️ Structure

| Folder / file | Description |
| --- | --- |
| `Contract/` | Solidity source (`contract.sol`) — deploy this to your network |
| `Watcher/` | Node.js service that listens for contract events and POSTs them to the API |
| `Watcher/SmartContract/` | Watcher copy of the contract and `ABI.json` used at runtime |

## 📜 Contract (`Nummum`)

> **Note:** The on-chain contract is named `Nummum` (one **a**); the project brand is **Nammumu**.

The payable fallback function accepts ETH in three tiers:

| Payment | Event message | Meaning |
| --- | --- | --- |
| `ticketprice` | `Tickets` | Single access |
| `weekprice` | `Week` | Weekly subscription |
| `weekprice × 4` | `Month` | Monthly subscription |

The contract owner can update prices (`changeWeeKprice`, `changeTicketprice`) and withdraw accumulated balance (`cashout`).

Compile and deploy with [Remix](https://remix.ethereum.org) or your preferred Solidity toolchain (contract targets `pragma solidity ^0.4.0`).

After deployment, call `changeWeeKprice` and `changeTicketprice` to set prices — they are not initialized in the constructor, so payments revert until both are configured. Then copy the contract address and ABI into the Watcher (see below).

## 👁️ Watcher

The Watcher connects to an Ethereum node via Web3, subscribes to `Sent` events, and forwards each payment event to the backend.

```bash
cd BlockChain/Watcher
npm install
node index.js
```

### ⚙️ Configuration

Edit `Watcher/index.js` before running:

| Setting | Location | Default |
| --- | --- | --- |
| Ethereum RPC URL | `Web3.providers.HttpProvider(...)` | `http://parity.270bytes.com:8545/` |
| Contract address | `web3.eth.contract(abi).at(...)` | `0x48a9ca6e6cc7e5664ccc746213b3e3e6bf88e23d` |
| Backend endpoint | `SaveTransaction` → `uri` | `http://backend.270bytes.com/api/transaction` |

For local development, point the RPC URL at your node (e.g. Ganache) and set the backend URI to `http://localhost:3030/api/transaction`.

### 🔄 Data flow

```
User pays contract → Sent event → Watcher → POST /api/transaction → MongoDB
```

## 📚 Related docs

- [Architecture overview](../docs/overview.md)
- [Getting started](../README.md#getting-started)
- Website API: `Website/BackEnd/api/transaction.js`
