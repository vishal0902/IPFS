// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LW3Punks is ERC721, Ownable {
    using Strings for uint256;

    string public _baseTokenURI;
    uint256 public _price = 0.01 ether;
    uint256 public tokenId;
    uint256 public maxTokenIds = 10;
    bool _paused;

    modifier _onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused.");
        _;
    }

    constructor(string memory baseURI) ERC721("LW3 Punks", "LW3P") {
        _baseTokenURI = baseURI;
    }

    function mint() public payable _onlyWhenNotPaused {
        require(
            tokenId < maxTokenIds,
            "Exceeded maximum LW3Punks token supply"
        );
        require(msg.value >= _price, "Ethers sent is not correct");
        tokenId += 1;
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"))
                : "";
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}

    fallback() external payable {}
}
