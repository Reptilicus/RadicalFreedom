pragma solidity >=0.4.21 <0.7.0;

contract RadicalFreedom {
    uint numberOfArticles;
    mapping (bytes32 => string) articles;
    bytes32[] public articleHashes;

    constructor () public {
        numberOfArticles = 0;
        articleHashes = new bytes32[](0);
    }

    function pushArticle(string memory pArticleAddress, bytes32 pArticleHash) public {
        articleHashes.push(pArticleHash);
        numberOfArticles++;
        articles[pArticleHash] = pArticleAddress;
    }

    function getArticle(bytes32 pArticleHash) public view returns (string memory) {
        return articles[pArticleHash];
    }

    function getHash(uint pHashNumber) public view returns (bytes32) {
        return articleHashes[pHashNumber];
    }

    function getNumberOfArticles() public view returns (uint) {
        return numberOfArticles;
    }
}
