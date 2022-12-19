// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Crownfunding {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimunContribute;
    uint public approversCount;
    mapping(address => bool) public approvers;
    uint public numRequest;
    mapping(uint => Request) public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier isContributor() {
        require(approvers[msg.sender]);
        _;
    }

    // constructor(uint minimun) {
    //     manager = msg.sender;
    //     minimunContribute = minimun;
    // }

    // Add creator address argument
    constructor(uint minimun, address creator) {
        manager = creator;
        minimunContribute = minimun;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function contribute() public payable {
        require(msg.value > minimunContribute);
        if (!approvers[msg.sender]) approversCount++;
        approvers[msg.sender] = true;
    }

    function createRequest(string memory description, uint value, address recipient) 
        public restricted {
            Request storage request = requests[numRequest++];
            request.description = description;
            request.value = value;
            request.recipient = recipient;
    }

    function approveRequest(uint index) public isContributor {
        Request storage request = requests[index];
        // make sure user is first time approve
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    } 

    function getMinimunContribute() public view returns (uint) {
        return minimunContribute;
    }

    function finalizeRequest(uint index)  public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        require(address(this).balance > request.value);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimunContribute,
            address(this).balance,
            numRequest,
            approversCount,
            manager
        );
    }
}