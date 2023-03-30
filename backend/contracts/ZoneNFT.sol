// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ZoneNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Zone {
        string location;
        bool forSale;
        uint price;
        address seller;
        string id;
    }

    mapping(uint256 => Zone) public _zones;

    event TokenBuy(address seller, address buyer, uint tokenId, uint price);

    constructor() ERC721("ZoneNFT", "ZNFT") {
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/0.jpeg",
            "Zone A - 1"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/0.jpeg",
            "Zone A - 2"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/0.jpeg",
            "Zone A - 3"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/0.jpeg",
            "Zone A - 4"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/1.jpeg",
            "Zone B - 1"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/1.jpeg",
            "Zone B - 2"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/1.jpeg",
            "Zone B - 3"
        );
        createZone(
            "https://gateway.pinata.cloud/ipfs/QmUZ767FRT46NRMGQNKTqSSMuK73o6T5rKX3iA9u91quXk/1.jpeg",
            "Zone B - 4"
        );
    }

    function createZone(
        string memory tokenURI,
        string memory location
    ) private onlyOwner {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _mint(msg.sender, newTokenId);
        _zones[newTokenId] = Zone(
            location,
            false,
            0.05 ether,
            msg.sender,
            string(abi.encodePacked(Strings.toString(newTokenId)))
        );
        _setTokenURI(newTokenId, tokenURI);
    }

    function setForSale(uint256 tokenId, uint price) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can set for sale");
        require(_zones[tokenId].forSale == false, "Already set");
        _zones[tokenId].forSale = true;
        _zones[tokenId].price = (price * 1 ether) / 100;
    }

    function unSale(uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can set for sale");
        require(_zones[tokenId].forSale == true, "Already set");
        _zones[tokenId].forSale = false;
    }

    function buyZoneNFT(uint256 tokenId) public payable {
        require(msg.sender != ownerOf(tokenId), "You are the owner");
        require(_zones[tokenId].forSale, "Token is not for sale");
        require(
            msg.value >= _zones[tokenId].price,
            "Ether value must be greater than price"
        );
        address owner = ownerOf(tokenId);

        _transfer(owner, msg.sender, tokenId);
        approve(address(this), tokenId);
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed.");
        _zones[tokenId].forSale = false;
        _zones[tokenId].seller = msg.sender;
        emit TokenBuy(owner, msg.sender, tokenId, _zones[tokenId].price);
    }

    function getAllNFTs() public view returns (Zone[] memory) {
        uint nftCount = _tokenIdCounter.current();
        Zone[] memory tokens = new Zone[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            Zone storage currentItem = _zones[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (Zone[] memory) {
        uint totalItemCount = _tokenIdCounter.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                itemCount += 1;
            }
        }

        Zone[] memory items = new Zone[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                currentId = i + 1;
                Zone storage currentItem = _zones[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
