// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Plan {
    uint256 planNumber = 1;

    struct PlanDetails {
        uint256 planNumber;
        string name;
        string image;
        string price;
        uint256 value;
        uint256 durationDays;
        string ipfsHash;
        address ownerAddress;
        uint256 createdAt; // timestamp
        bool inUse;
    }

    PlanDetails[] plans;
    PlanDetails[] newPds;

    mapping(address => PlanDetails[]) userPlans;
    mapping(address => bool) registeredAPlan;

    // constructor() Plan("PlanNFT", "PFT") {
    // 	// create the token here. Nothing to do for now, might add something later
    // }

    function createPlan(
        string memory name,
        string memory image,
        string memory price,
        uint256 value,
        uint256 durationDays,
        string memory ipfsHash,
        uint256 createdAt,
        bool inUse
    ) public {
        PlanDetails memory nextPlan;
        bool hasPlan = _IsUserHasPlan(msg.sender);
        if (hasPlan == true) {
            console.log("Adding to more plans: %s", hasPlan);
            // user has registerd a plan. We should add to existing list
            PlanDetails[] storage pds = userPlans[msg.sender];
            nextPlan = PlanDetails(
                planNumber,
                name,
                image,
                price,
                value,
                durationDays,
                ipfsHash,
                msg.sender,
                createdAt,
                inUse
            );
            pds.push(nextPlan);
            userPlans[msg.sender] = pds;
        } else {
            console.log("Creating a new plan for user: %s", hasPlan);
            nextPlan = PlanDetails(
                planNumber,
                name,
                image,
                price,
                value,
                durationDays,
                ipfsHash,
                msg.sender,
                createdAt,
                inUse
            );
            newPds.push(nextPlan);
            userPlans[msg.sender] = newPds;
            newPds.pop();
        }
        plans.push(nextPlan);
        planNumber++;
        registeredAPlan[msg.sender] = true;
    }

    function _IsUserHasPlan(address userAddr) public view returns (bool) {
        bool hp = registeredAPlan[userAddr];
        return hp;
    }

    function getAllPlans() public view returns (PlanDetails[] memory) {
        PlanDetails[] memory strs = new PlanDetails[](plans.length);
        for (uint256 i = 0; i < plans.length; i++) {
            PlanDetails storage p = plans[i];
            strs[i] = p;
        }
        return strs;
    }

    function getPlanByNumber(
        uint256 planNum
    ) public view returns (PlanDetails memory) {
        return plans[planNum - 1];
    }

    function getAllUserPlans(
        address userAddr
    ) public view returns (PlanDetails[] memory) {
        bool hp = registeredAPlan[userAddr];
        PlanDetails[] memory strs;
        if (!hp) {
            strs = new PlanDetails[](0);
            return strs;
        }
        PlanDetails[] storage uPlans = userPlans[userAddr];
        strs = new PlanDetails[](uPlans.length);
        uint256 j = 0;
        for (uint256 i = 0; i < uPlans.length; i++) {
            PlanDetails storage p = uPlans[i];
            strs[i] = p;
            j = i;
        }
        return strs;
    }
}
