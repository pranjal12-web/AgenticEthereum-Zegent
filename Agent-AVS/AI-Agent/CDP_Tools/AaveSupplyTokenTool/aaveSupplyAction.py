from pydantic import BaseModel, Field
from cdp import Wallet
from aave_constants import AAVE_FACTORY_ABI, AAVE_GATEWAY_ABI,get_factory_address


AAVE_SUPPLY_PROMPT = """
This tool allows you to supply tokens to the Aave lending protocol, enabling you to earn yield on your assets. 
By supplying your tokens, you contribute to the liquidity of the protocol and can earn interest over time. 
It is only supported on Base Sepolia and Base Mainnet.
"""


class AaveSupplyInput(BaseModel):
    """Input argument schema for aave supply."""

    amount: str = Field(
        ..., description="The amount of the asset to transfer, e.g. `15`, `0.000001`"
    )
    asset_id: str = Field(
        ...,
        description="The asset ID to transfer, e.g. `eth`, `0x036CbD53842c5426634e7929541eC2318f3dCF7e`",
    )


def aave_supply_token(wallet: Wallet, amount: str, asset_id: str) -> str:
    """Supply tokens to the Aave.

    Args:
        wallet (Wallet): The wallet to create the token from.
        amount (str): The amount of the asset to transfer, e.g. `15`, `0.000001`.
        asset_id (str): The asset ID to transfer (e.g. `0x036CbD53842c5426634e7929541eC2318f3dCF7e`).

    Returns:
        str: A message containing the token supply details.

    """
    # print("rtyeueie")
    factory_address = get_factory_address(wallet.network_id)
    if asset_id.lower() == "eth" or asset_id.lower() == "0x0000000000000000000000000000000000000000":
        try:
            invocation = wallet.invoke_contract(
                contract_address="0x729b3EA8C005AbC58c9150fb57Ec161296F06766",
                method="depositETH",
                abi=AAVE_GATEWAY_ABI,
                args={
                    "": "0x0000000000000000000000000000000000000000",
                    "onBehalfOf": "0x38C25E19293Ec9fa21354713D445D733041Cfa0D",
                    "referralCode": "0",
                },
                amount=amount,
            ).wait()
        except Exception as e:
            return f"Supply failed {e!s}"
    else:
        try:
            invocation = wallet.invoke_contract(
                contract_address=factory_address,
                method="supply",
                abi=AAVE_FACTORY_ABI,
                args={
                    "asset": asset_id,
                    "amount": amount,
                    "onBehalfOf": "0x38C25E19293Ec9fa21354713D445D733041Cfa0D",
                    "referralCode": "0",
                },
            ).wait()
        except Exception as e:
            return f"Supply failed {e!s}"

    return f"AAVE supply {amount} of {asset_id} on network {wallet.network_id}.\nTransaction hash for the aave supply: {invocation.transaction.transaction_hash}\nTransaction link for the aave supply: {invocation.transaction.transaction_link}"
