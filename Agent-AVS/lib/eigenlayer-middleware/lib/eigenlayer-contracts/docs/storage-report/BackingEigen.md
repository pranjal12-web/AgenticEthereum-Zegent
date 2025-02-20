| Name                              | Type                                                          | Slot | Offset | Bytes | Contract                                          |
|-----------------------------------|---------------------------------------------------------------|------|--------|-------|---------------------------------------------------|
| _initialized                      | uint8                                                         | 0    | 0      | 1     | src/contracts/token/BackingEigen.sol:BackingEigen |
| _initializing                     | bool                                                          | 0    | 1      | 1     | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[50]                                                   | 1    | 0      | 1600  | src/contracts/token/BackingEigen.sol:BackingEigen |
| _owner                            | address                                                       | 51   | 0      | 20    | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[49]                                                   | 52   | 0      | 1568  | src/contracts/token/BackingEigen.sol:BackingEigen |
| _balances                         | mapping(address => uint256)                                   | 101  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _allowances                       | mapping(address => mapping(address => uint256))               | 102  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _totalSupply                      | uint256                                                       | 103  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _name                             | string                                                        | 104  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _symbol                           | string                                                        | 105  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[45]                                                   | 106  | 0      | 1440  | src/contracts/token/BackingEigen.sol:BackingEigen |
| _hashedName                       | bytes32                                                       | 151  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _hashedVersion                    | bytes32                                                       | 152  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _name                             | string                                                        | 153  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _version                          | string                                                        | 154  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[48]                                                   | 155  | 0      | 1536  | src/contracts/token/BackingEigen.sol:BackingEigen |
| _nonces                           | mapping(address => struct CountersUpgradeable.Counter)        | 203  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _PERMIT_TYPEHASH_DEPRECATED_SLOT  | bytes32                                                       | 204  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[49]                                                   | 205  | 0      | 1568  | src/contracts/token/BackingEigen.sol:BackingEigen |
| _delegates                        | mapping(address => address)                                   | 254  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _checkpoints                      | mapping(address => struct ERC20VotesUpgradeable.Checkpoint[]) | 255  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| _totalSupplyCheckpoints           | struct ERC20VotesUpgradeable.Checkpoint[]                     | 256  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| __gap                             | uint256[47]                                                   | 257  | 0      | 1504  | src/contracts/token/BackingEigen.sol:BackingEigen |
| transferRestrictionsDisabledAfter | uint256                                                       | 304  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| allowedFrom                       | mapping(address => bool)                                      | 305  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| allowedTo                         | mapping(address => bool)                                      | 306  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
| isMinter                          | mapping(address => bool)                                      | 307  | 0      | 32    | src/contracts/token/BackingEigen.sol:BackingEigen |
