Prebuilt Relayer - Game Base on Monad
This project serves as a starter base for creating a game on Monad using a relayer that enables blockchain transactions without requiring the user to sign them.
With this solution, you no longer need to configure smart contracts, Wagmi, or contract interactions manually – simply build your game, and you're ready to go!

Table of Contents
Features
Technologies Used
Installation
Configuration
Usage
Architecture
NAD Domain Name
Contributing
License
Features
Transaction Relayer:
Sends transactions on the blockchain via a relayer, allowing users to play without having to pay gas fees or interact with their wallet.

Transaction Queue Management:
Transactions are queued and processed sequentially to prevent nonce issues and ensure reliable execution.

Preconfigured Actions:
Native support for actions such as click and submitScore, making it easy to integrate game interactions.

Blockchain Abstraction:
No need to configure smart contracts, Wagmi, or contract interactions – all of this is handled on the back end.

Technologies Used
Next.js: React framework for building the application.
Viem: Library used to interact with the blockchain.
Wagmi: Used for managing wallet connections and blockchain interactions (abstracted away from the user).
Relayer API: A Next.js API route that handles sending transactions via a queue.
NAD Domain Name: Utilized to simplify access and domain configuration.
Installation
Clone the repository:

bash
Copy
git clone https://github.com/Veenoway/prebuilt-relayer.git
cd prebuilt-relayer
Install dependencies:

bash
Copy
npm install
# or
yarn install
Configure the environment:

Create a .env.local file at the root of the project and add the necessary variables (see Configuration).

Start the project in development mode:

bash
Copy
npm run dev
# or
yarn dev
Configuration
Create a .env.local file at the root of the project with the following content (adjust the values to your configuration):

env
Copy
# Relayer private key (server-side only)
RELAYER_PK=0x...

# RPC URL for Monad or any compatible network
RPC_URL=https://rpc-devnet.monadinfra.com/rpc/YOUR_RPC_KEY

# Chain ID (e.g., 20143 for Monad)
CHAIN_ID=20143

# Address of the smart contract used by the relayer
CONTRACT_ADDRESS=0x76717dBB39075DE78B89AD71E2471DD8eC76d7eB

# (Optional) NAD Domain configuration if needed
NAD_DOMAIN=your-nad-domain.example
Note:
Environment variables not prefixed with NEXT_PUBLIC_ are only available on the server. Since the relayer runs in a Next.js API route, these details remain hidden from the client.

Usage
The relayer exposes an API route accessible via POST /api/relay.

Example Request
Send a POST request with a JSON payload to execute a transaction. For example:

For the click action:

json
Copy
{
  "playerAddress": "0x77A89C51f106D6cD547542a3A83FE73cB4459135",
  "action": "click"
}
For the submitScore action:

json
Copy
{
  "playerAddress": "0x77A89C51f106D6cD547542a3A83FE73cB4459135",
  "action": "submitScore",
  "score": 123
}
The response will return a JSON object containing a txHash key if the transaction is successfully sent, or an error message if it fails.

Architecture
API Route (/api/relay/route.ts):

Handles incoming requests.
Queues transactions.
Processes transactions sequentially to ensure proper nonce management.
Nonce Management:

The nonce is fetched using the eth_getTransactionCount method with the "pending" parameter.
A local counter (currentNonce) is maintained and incremented with each transaction.
In case of a "Nonce too low" error, the nonce is automatically resynchronized with the network.
Technical Abstraction:

The relayer hides all the complexity of configuring Wagmi, smart contract interactions, and blockchain operations.
You can focus on developing the gameplay and user experience without worrying about the underlying blockchain details.
NAD Domain Name
The project also integrates NAD Domain Name configuration to simplify access to the service and the domain setup. This further streamlines the process, eliminating the need to handle complex hosting or DNS configurations.

Contributing
Contributions are welcome!

Fork the repository.
Create your feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -am 'Add some feature').
Push the branch (git push origin feature/YourFeature).
Open a Pull Request.
License
This project is licensed under the MIT License.
