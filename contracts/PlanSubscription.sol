// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Plan.sol";
import "hardhat/console.sol";

contract PlanSubscription is ERC721URIStorage {
    Plan public _plan;
    uint256 serviceId = 1;

    struct Subscription {
        uint256 tokenId;
        uint256 planNumber;
        string name;
        string image;
        string ipfsHash;
        uint256 createdAt; // timestamp
        uint256 invalidAfter; // timestamp after which service is invalid
    }

    Subscription[] subscriptions;

    constructor(address payable planContract) ERC721("SubscriptionNFT", "SFT") {
        _plan = Plan(planContract);
    }

    function createSubscription(
        uint256 planNum,
        string memory name,
        string memory image,
        string memory ipfsHash,
        address subOwner,
        uint256 createdAt,
        uint256 invalidAfter
    ) public payable {
        if (subOwner == address(0)) {
            subOwner = msg.sender;
        }

        Plan.PlanDetails memory plan = _plan.getPlanByNumber(planNum);
        console.log(
            "Creating Subscription NFT with plan: %s, planNum: %s, planOwner: %s",
            plan.name,
            plan.planNumber,
            plan.ownerAddress
        );
        uint256 sid = serviceId;
        Subscription memory nextSub = Subscription(
            sid,
            planNum,
            name,
            image,
            ipfsHash,
            createdAt,
            invalidAfter
        );
        address payable planOwnerAddr = payable(plan.ownerAddress);
        bool sent = planOwnerAddr.send(msg.value);
        require(sent, "Failed to send Ether");
        subscriptions.push(nextSub);
        _mint(subOwner, serviceId);
        _setTokenURI(serviceId, ipfsHash);
        serviceId++;
    }
}
