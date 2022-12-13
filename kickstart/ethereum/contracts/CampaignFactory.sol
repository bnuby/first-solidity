// SPDX-License-Identifier: MIT

import "./Crownfunding";

pragma solidity ^0.8.9;

contract CampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(uint minimun) public {
        Crownfunding newCampaign = new Crownfunding(minimun, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
}