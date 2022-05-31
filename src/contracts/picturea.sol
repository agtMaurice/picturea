// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Picturea {


    uint internal picturesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Picture {
        address payable owner;
        string image;
        string description;
        uint price;
        uint sold;
    }

    mapping (uint => Picture) internal pictures;

    function addPicture(
        string memory _image,
        string memory _description, 
        uint _price
    ) public {
        uint _sold = 0;
        pictures[picturesLength] = Picture(
            payable(msg.sender),
            _image,
            _description,
            _price,
            _sold
        );
        picturesLength++;
    }

    function getPicture(uint _index) public view returns (
        address payable, 
        string memory, 
        string memory, 
        uint, 
        uint
    ) {
        return (
            pictures[_index].owner,
            pictures[_index].image,
            pictures[_index].description,
            pictures[_index].price,
            pictures[_index].sold
          
        );
    }
    
    function buyPicture(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            pictures[_index].owner,
            pictures[_index].price
          ),
          "Transfer failed."
        );
        pictures[_index].sold++;
    }
    
    function getPicturesLength() public view returns (uint) {
        return (picturesLength);
    }
}