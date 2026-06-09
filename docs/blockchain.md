# Blockchain

Nammumu uses an Ethereum smart contract to handle subscription payments. A Node.js watcher listens for on-chain events and notifies the backend to activate user subscriptions.

## Smart Contract: `Nummum`

**Source:** `BlockChain/Contract/contract.sol`

**Deployed address:** `0x48a9ca6e6cc7e5664ccc746213b3e3e6bf88e23d`

**Solidity version:** `^0.4.0`

**Compile & deploy:** Use [Remix](https://remix.ethereum.org) to compile and deploy the contract. Export the ABI after deployment.

### State Variables

| Variable | Access | Description |
|----------|--------|-------------|
| `owner` | private | Contract deployer; only owner can change prices or cash out |
| `totalbalance` | private | Accumulated ETH from payments |
| `weekprice` | private | Price for the weekly plan (in wei) |
| `ticketprice` | private | Price for the ticket plan (in wei) |

### Event

```solidity
event Sent(string msg, address from, uint amount);
```

Emitted plan values: `'Week'`, `'Tickets'`, `'Month'`.

### Functions

| Function | Access | Description |
|----------|--------|-------------|
| `Nummum()` | constructor | Sets `owner = msg.sender` |
| `()` fallback | payable | Routes incoming ETH to the correct plan |
| `changeWeeKprice(uint amountWeek)` | owner | Update weekly price |
| `changeTicketprice(uint amountticket)` | owner | Update ticket price |
| `cashout()` | owner | Transfer accumulated balance to owner |

### Payment Logic (Fallback)

The fallback function uses integer division to match exact payment amounts:

```
if msg.value / weekprice == 1        → Week plan
else if msg.value / ticketprice == 1 → Tickets plan
else if msg.value / (weekprice * 4) == 1 → Month plan
else → revert()
```

Payments must be **exact** — sending the wrong amount causes the transaction to revert.

The monthly price is implicitly `weekprice * 4`; there is no separate `monthprice` variable in the Solidity source.

### ABI Note

The deployed ABI (used by the watcher and frontend in `configContract.js`) differs from the checked-in `contract.sol`:

| Deployed ABI | Source `.sol` |
|--------------|---------------|
| `Sent(plan, from, amount, week, month, ticket)` — 6 fields | `Sent(msg, from, amount)` — 3 fields |
| `changeMonthprice(uint256)` present | Not in source file |

The watcher reads `result.args.plan`, `.week`, `.month`, and `.ticket` from the richer deployed ABI. When recompiling from source, ensure the ABI matches what the watcher and frontend expect.

## Event Watcher

**Path:** `BlockChain/Watcher/index.js`

### Dependencies

- `web3@^0.20.3`
- `request@^2.85.0`

### Configuration

| Setting | Default Value |
|---------|---------------|
| Ethereum RPC | `http://parity.270bytes.com:8545/` |
| Contract address | `0x48a9ca6e6cc7e5664ccc746213b3e3e6bf88e23d` |
| Backend URL | `http://backend.270bytes.com/api/transaction` |
| ABI file | `SmartContract/ABI.json` |

### How It Works

1. Instantiates the contract: `web3.eth.contract(abi).at(address)`
2. Watches for `Sent` events from the latest block: `nummumContract.Sent({fromBlock: 'latest'}).watch(...)`
3. On each event, builds a transaction object:

```javascript
{
  price: { ticket_price, week_price, month_price },
  sender_adr,        // payer wallet address
  contract_adr,      // contract address
  selected_package,  // "Week", "Month", or "Ticket"
  transaction_date,
  purchase_amount    // ETH amount
}
```

4. POSTs the JSON payload to `/api/transaction` on the backend.

### Running Locally

```bash
cd BlockChain/Watcher
npm install
node index.js
```

For local development, update the `SaveTransaction` URI in `index.js`:

```javascript
uri: 'http://localhost:3030/api/transaction'
```

### Default Price Fallbacks

If event args are missing, the watcher uses these defaults:

| Plan | ETH |
|------|-----|
| Ticket | 0.001 |
| Week | 0.007 |
| Month | 0.021 |

## Subscription Activation

When `/api/transaction` receives a POST from the watcher, it:

1. Finds the user by matching `sender_adr` to `wallet_adr` in the database.
2. Applies the subscription based on `selected_package`:

| Package | Effect |
|---------|--------|
| `"Month"` | Extends `apiExpirationDate` by 30 days |
| `"Week"` | Extends `apiExpirationDate` by 7 days |
| `"Ticket"` | Adds 10 to `token_balance` |

3. Saves the transaction record to MongoDB.

## Admin Price Management

Admins can update on-chain prices from `/admin/pricing`:

1. Enter a USD price in the admin UI.
2. The frontend converts USD to ETH using the CryptoCompare API.
3. A MetaMask transaction calls `changeWeeKprice`, `changeTicketprice`, or `changeMonthprice` on the contract.
4. The backend `Configuration` collection is updated via `POST /api/price/:plan`.

## File Reference

| File | Purpose |
|------|---------|
| `BlockChain/Contract/contract.sol` | Canonical Solidity source |
| `BlockChain/Watcher/SmartContract/ABI.json` | Deployed contract ABI |
| `BlockChain/Watcher/index.js` | Event watcher script |
| `Website/frontend/src/utils/configContract.js` | Frontend ABI and address copy |
