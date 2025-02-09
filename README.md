#  Zegent: Under-Collateralized Lending & Verifiable Crypto AI Agent

## 🚀 About

### **How Undercollateralized Lending Works**  
Zegent enables undercollateralized lending by assessing borrowers' financial history from various exchanges and protocols using the Arbitrum API for subgraphs deployed on GraphQL. The retrieved financial data is processed through the `generate_witness` algorithm in zk-SNARKs, generating private and public signals based on parameters set in the Circom circuit. Borrower history remains private, while loan threshold eligibility and other constants are public.

The public signals and zero-knowledge proof are then sent to the Loan Contract, which inherits the Verifier Contract to call the `verify` function. This function returns a boolean value indicating whether the borrower meets the loan eligibility criteria. Borrowers who pass verification can create loan requests, and lenders can view only those who qualify based on the threshold score. Borrowers with weaker financial scores, who do not qualify for loans, can leverage Zegent’s AI-powered exchange tools, utilizing exchange ABIs to strengthen their profile through analysis and informed trading.

---

### **CryptoSage – Verifiable AI for Trading & Analysis**
CryptoSage, built using the **CDP AgentKit**, enhances token trading and analysis through AI-driven tools such as `AaveQueryTool`, `AaveSupplyTokenTool`, `MorphoQueryTool`, and `AerodromeTool`. To ensure verifiability, CryptoSage is secured through **EigenLayer’s Autonomous Verifiable Service (AVS)** mechanism.

When an AVS consumer queries CryptoSage, the request is sent to the `AgentServiceManager` contract, which emits a `NewTaskCreated` event. This notifies registered Operators, who have staked and delegated assets, to process the request. Each Operator independently hashes the response, signs it using their private key, and submits the signed hash back to the `AgentServiceManager` AVS contract. Only registered Operators who meet the required stake threshold can submit responses, ensuring a secure, verifiable, and decentralized AI-powered system for lending decisions and crypto analysis.

---

##  Architecture

## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/ProjectFinalArchi.png)

## Project Setup

### 1. Clone the repository:-
```sh
git clone https://github.com/pranjal12-web/AgenticEthereum-Zegent.git
                   or
git clone git@github.com:pranjal12-web/AgenticEthereum-Zegent.git
```
### 2. Start the frontend:
- Run the following commands and check ```http://localhost:3000```:
```sh
cd frontend
npm install
npm run dev
```
### 3. Environment variables Configuration
- Copy the example environment files and rename them:
```sh
cp Agent-AVS/.env.example Agent-AVS/.env
cp Agent-AVS/AI-Agent/.env.example Agent-AVS/AI-Agent/.env
```
- Set the following environment variables in your `~/.bashrc` file:
 ```sh
 export CDP_API_KEY_NAME=""
 export CDP_API_KEY_PRIVATE_KEY=""
 export NETWORK_ID="base-sepolia"
 export GROQ_API_KEY=""
 ```
- After adding the variables, apply the changes by running:
```sh
source ~/.bashrc
```
### 4. AI Agent setup
- To start the flask server, run and check ```http://localhost:5000```:-
```sh
cd Agent-AVS/AI-Agent
pip install -r requirements.txt
python chatbot-flask.py
```
### 5. AVS mechanism setup

- To run anvil on localhost:8545
```sh
anvil --chain-id 31337 --fork-url https://eth-mainnet.g.alchemy.com/v2/<ALCHEMY_API_KEY>
```
- To deploy contract:
```sh
forge script script/DeployAgentServiceManager.sol --rpc-url http://localhost:8545 --broadcast
```
- To test,run following commands simultaneously in different terminals:
```sh
bun run createTask.ts
bun run respondToTask.ts
```

## Glimpses Of Zegent

## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/cover.png)


## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/all_loans.png)

## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/generate_proof.png)

## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/Borrow-requests.png)

## ![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./images/chatbot.png)


