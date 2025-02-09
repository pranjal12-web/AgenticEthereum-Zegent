from pydantic import BaseModel, Field
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import os

GRAPH_API_KEY = os.getenv('GRAPH_API_KEY')
if not GRAPH_API_KEY:
    raise ValueError("Please set GRAPH_API_KEY in your .env file")

# Updated subgraph endpoint for Aave V2
GATEWAY_URL = "https://gateway.thegraph.com/api"

MORPHO_BLUE_SUBGRAPH = f"{GATEWAY_URL}/{GRAPH_API_KEY}/subgraphs/id/8Lz789DP5VKLXumTMTgygjU2xtuzx8AhbaacgN5PYCAs"

MORPHO_QUERY_PROMPT = """
This tool queries Morpho protocol data from The Graph Protocol for a particular wallet address.
You can ask questions like:
- "Get the total liquidation amount for my wallet address"
- "Get the total deposit amount for my wallet address"
"""

class MorphoQueryInput(BaseModel):
    """Input schema for Morpho queries."""
    address: str = Field(
        ...,
        description="Wallet address", example="0x54651adfd19b33B5E4A5027bE9d6aE02C1C3284E"
    )


def setup_graph_client(subgraph_url: str) -> Client:
    """Set up a Graph Protocol client for the given subgraph."""
    transport = RequestsHTTPTransport(
        url=subgraph_url,
        verify=True,
        retries=3,
    )
    return Client(transport=transport, fetch_schema_from_transport=True)

def format_number(value: float, decimals: int = 2) -> str:
    """Format numbers to avoid scientific notation and limit decimals."""
    return f"{round(value, decimals):,.{decimals}f}"

def query_morpho(address: str) -> dict:
    """Query Morpho data from The Graph."""
    client = setup_graph_client(MORPHO_BLUE_SUBGRAPH)
    
    protocolMorpho_Query = gql("""
    query MorphoQuery($address: ID!) {
        account(id: $address) {
            borrowCount
            depositCount
            liquidationCount
            repayCount
            withdrawCount
            closedPositionCount
            id
            openPositionCount
            receivedCount
            transferredCount
                               
            metaMorphoDeposit {
                amount
                amountUSD
                id
                asset {
                    name
                    symbol
                    decimals
                }
            }

            liquidations {
                amount
                amountUSD
                id
                asset {
                    name
                    symbol
                    decimals
                }
            }
            
            repays {
                amount
                amountUSD
                id
                asset {
                    decimals
                    name
                    symbol
                }
            }
        }
        
    }
    """)

    try:
        result = client.execute(protocolMorpho_Query, variable_values={"address": address.lower()})

        # Ensure account data exists
        account_data = result.get("account")
        if not account_data:
            return {"error": f"No market data found for address {address}"}

        # Extract key details
        total_deposit_amount = sum(float(deposit["amountUSD"]) for deposit in account_data.get("metaMorphoDeposit", []))
        total_liquidation_amount = sum(float(liquidation["amountUSD"]) for liquidation in account_data.get("liquidations", []))
        total_repay_amount = sum(float(repay["amountUSD"]) for repay in account_data.get("repays", []))

        # Return the results
        return {
            "address": account_data["id"],
            "total_deposit_amount": total_deposit_amount,
            "total_liquidation_amount": total_liquidation_amount,
            "total_repay_amount": total_repay_amount
        }

    except Exception as e:
        print(f"Error during GraphQL execution: {str(e)}")
        return {"error": f"Error querying Aave data: {str(e)}"}