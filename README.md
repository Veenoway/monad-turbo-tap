# Prebuilt Relayer - Game Base on Monad

This project serves as a starter base for creating a game on Monad using a relayer that enables blockchain transactions without requiring the user to sign them. Simply build your game, and you're ready to go!

## Features

- **Transaction Relayer**: Send transactions via a relayer - users play without gas fees or wallet interactions
- **Transaction Queue Management**: Sequential processing to prevent nonce issues
- **Preconfigured Actions**: Native support for click and submitScore actions
- **Blockchain Abstraction**: No manual configuration needed for smart contracts or Wagmi

## Technologies Used

- Next.js
- Viem
- Wagmi
- Relayer API
- NAD Domain Name

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Veenoway/prebuilt-relayer.git
cd prebuilt-relayer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file following .env.exemple

4. Start development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

Send POST requests to `/api/relay` with payload:

```json
{
  "playerAddress": "0x76717dBB39075DE78B89AD71E2471DD8eC76d7eB",
  "action": "click"
}
```

Or for submitting scores:

```json
{
  "playerAddress": "0x76717dBB39075DE78B89AD71E2471DD8eC76d7eB",
  "action": "submitScore",
  "score": 123
}
```

## Architecture

- **API Route**: Handles requests and queue management
- **Nonce Management**: Automatic synchronization with network
- **Technical Abstraction**: Hidden complexity for easier development

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push branch (`git push origin feature/YourFeature`)
5. Open Pull Request

## License
MIT License

