
import os
import pickle

from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from cdp_langchain.tools import CdpTool
from langgraph.prebuilt import create_react_agent
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from CDP_Tools.AaveQueryTool.AaveQueryTool import AAVE_MARKETS_PROMPT,AaveMarketsQueryInput,query_aave_markets
from CDP_Tools.AaveSupplyTokenTool.aaveSupplyAction import AAVE_SUPPLY_PROMPT,aave_supply_token,AaveSupplyInput
from CDP_Tools.AerodromeAddLiquidityTool.AerodromeAddLiquidityAction import aerodrome_add_liquidity,AERODROME_ADD_LIQUIDITY_PROMPT,AerodromeAddLiquidityInput
from CDP_Tools.MorphoQueryTool.MorphoQueryTool import query_morpho,MORPHO_QUERY_PROMPT,MorphoQueryInput

from flask_cors import CORS
from flask import Flask, request, jsonify

def crypto_ai_agent(user_input):
    load_dotenv()

    # Configure wallet data file
    wallet_data_file = "wallet_data_mainnet.txt"

   
    def initialize_agent():
        """Initialize the agent with CDP Agentkit."""
 
        llm = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0.7
    )
        print("LLM",llm)

        wallet_data = None

        if os.path.exists(wallet_data_file):
            with open(wallet_data_file) as f:
                wallet_data = f.read()

        # Configure CDP Agentkit Langchain Extension.
        values = {}
        if wallet_data is not None:
            # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
            values = {"cdp_wallet_data": wallet_data}

        agentkit = CdpAgentkitWrapper(**values)

        # persist the agent's CDP MPC Wallet Data.
        wallet_data = agentkit.export_wallet()
        with open(wallet_data_file, "w") as f:
            f.write(wallet_data)

        # Initialize CDP Agentkit Toolkit and get tools.
        cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
        tools = cdp_toolkit.get_tools()

        aaveProtocolTool = CdpTool(

            name="query_aave",
            description=AAVE_MARKETS_PROMPT,
            cdp_agentkit_wrapper=agentkit,
            args_schema=AaveMarketsQueryInput,
            func=query_aave_markets,
            
            )
        
        aaveSupplyAction = CdpTool(
        
        name="aave_supply",
        description=AAVE_SUPPLY_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=AaveSupplyInput,
        func=aave_supply_token,
        )

        AerodromeAddLiquidityAction = CdpTool(
    
        name="aerodrome_add_liquidity",
        description=AERODROME_ADD_LIQUIDITY_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=AerodromeAddLiquidityInput,
        func=aerodrome_add_liquidity,

        )

        MorphoQueryTool =CdpTool(

        name="Morpho_query",
        description=MORPHO_QUERY_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=MorphoQueryInput,
        func=query_morpho,
        )

        tools.append(aaveProtocolTool)
        tools.append(aaveSupplyAction)
        tools.append(AerodromeAddLiquidityAction)
        tools.append(MorphoQueryTool)
        

        # Store buffered conversation history in memory.
        memory = MemorySaver()
        config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

        # Create ReAct Agent using the LLM and CDP Agentkit tools.
        return create_react_agent(
            llm,
            checkpointer=memory,
            tools=tools,
            state_modifier=
            ("You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested."
            "You are equipped to perform on-chain actions with your tools. If you need funds and are on network ID 'base-sepolia,' "
            "you can request them from the faucet. For other networks, provide your wallet details and request funds from the user. "
            "Before executing any actions, ensure you retrieve wallet details to verify the network you are operating on. "
            "If you encounter a 5XX (internal) HTTP error code, ask the user to try again later. "
    
            "You are the best risk assessment agent for DAOs like AAVE and Morpho. You provide detailed research proposals, "
            "similar to Chaos Labs and Gauntlet. Your services include: "
            "- Gauging the sentiment of a given asset. "
            "- Analyzing the asset to determine appropriate proposal actions. "
            "- Crafting a reference proposal to update the asset parameters on the DAO. "
            
            "Ensure proposals are formatted correctly, including data and numbers to support your analysis. "
            "Include relevant graphs, such as TVL, circulating supply, and market price changes, to provide deeper insights. "
            "Accuracy of data is appreciated but not mandatory if real-time data is unavailable. "
            
            "You can also summarize DAO proposals concisely. Provide summaries with clear and user-friendly language. "
            "Additionally, you can deliver detailed research proposals for any given asset. Always include actionable insights "
            "and end your proposals with a friendly prompt like: 'How can I assist you further?' "
            
            "Maintain a user-friendly tone and deliver responses line by line for better readability. Avoid restating your tool descriptions "
            "unless explicitly requested. If searching the web is necessary to enhance your response, use it to include up-to-date data and insights."
            ),
        ), config


    # Chat Mode
    def run_chat_mode(agent_executor, config):
        """Run the agent interactively based on user input."""
        print("Starting chat mode... Type 'exit' to end.")
        
        responses = []
        while True:
            try:
                input = user_input
                if input.lower() == "exit":
                    return responses

                # Run agent with the user's input in chat mode
                response_text=[]
                for chunk in agent_executor.stream(
                    {"messages": [HumanMessage(content=input)]}, config):

                    if "agent" in chunk:
                        response_text.append(chunk["agent"]["messages"][0].content)
                    elif "tools" in chunk:
                        response_text.append(chunk["tools"]["messages"][0].content)
                        response_text.append("-------------------")
                final_response = "\n".join(response_text)
                responses.append(final_response)

            except KeyboardInterrupt:
                print("Goodbye Agent!")
                return responses
    
    agent_executor, config = initialize_agent()

    ai_response=run_chat_mode(agent_executor=agent_executor, config=config)

    return ai_response


pickle.dump(crypto_ai_agent,open("model.pkl","wb"))

app = Flask(__name__,template_folder='templates')
CORS(app)

# Load your trained model
with open('model.pkl', 'rb') as model_file:
    loaded_model = pickle.load(model_file)

@app.route('/response',  methods=['GET', 'POST'])
def recommend():
    try:
                
        data = request.get_json() 
        user_input = data.get('user_input')
        print(user_input)
        
        response = crypto_ai_agent(user_input)
        print(response)
        
        return jsonify({'response': response})
    
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

# Run the Flask app
if __name__ == '__main__':
    print("hello")
    app.run(host='127.0.0.1', port=5000, debug=True)