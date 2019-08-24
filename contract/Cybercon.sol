pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Cybercon is ERC721Token, Ownable {
     constructor(
        uint256[] memory _timingsSet,
        uint256[] memory _economySet,
        uint256[] memory _eventSet,
        string memory _name,
        string memory _symbol,
        string memory _description,
        string memory _place
    ) ERC721Full(_name, _symbol)
    {
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId,
        string  _tokenURI
    ) public
    {
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _tokenURI);
    }
}