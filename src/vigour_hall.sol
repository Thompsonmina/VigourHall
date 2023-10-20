
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract VigourHall {
    address public owner;
    string serverPublicKey;

    address[] public verifiedParties;

    struct User {
        address payable user_address;
        string username;
        string securehash;
        string userdata_cid;

    }

    enum ChallengeType {
        Water,
        Sleep,
        BodyFat,
        Steps,
        Activity
    }

    struct Challenge{
        bool tier1;
        bool tier2;
        bool tier3;
        uint32 currentstreak;
        uint32 longeststreak;
        uint32 currentstreakgap;
        uint64 totalTier1Completions;
        uint64 totalTier2Completions;
        uint64 totalTier3Completions;
        uint lastSubmissionDate;
        ChallengeType challengeType;
    }


    // unique username per user
    mapping(string => User) public users;
    mapping(string => Challenge[] ) public challenges;

    string[] public usernames;
    uint public totalusers;

    constructor() {
        owner = msg.sender;
        verifiedParties.push(msg.sender);
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    modifier userExists(string memory _username) {
        require(users[_username].user_address != address(0), "User does not exist");
        _;
    }  

    modifier isUser(string memory _username) {
        require(users[_username].user_address == msg.sender, "Not user");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier isVerifiedParty() {
        bool found = false;
        for (uint i = 0; i < verifiedParties.length; i++){
            if (verifiedParties[i] == msg.sender){
                found = true;
            }
        }
        require(found, "Not verified party");
        _;
    }

    modifier isEnrolled(string memory _username, uint challengetype) {
        bool found = false;
        for (uint i = 0; i < challenges[_username].length; i++){
            if (uint(challenges[_username][i].challengeType) == challengetype){
                found = true;
            }
        }
        require(found, "Not enrolled in challenge");
        _;
    }

    function changePublicKey(string memory newServerPublicKey) isOwner() public {
        serverPublicKey = newServerPublicKey;
        emit PublicKeyChanged(newServerPublicKey);
    }   

    function changeOwner(address new_owner) isOwner() public {
        owner = new_owner;
        emit OwnerChanged(new_owner);
    }
    
    function registerUser(string memory _username, string memory _securehash) public {
        require(users[_username].user_address == address(0), "User already exists");
        users[_username] = User(payable(msg.sender), _username, _securehash, "");
        usernames.push(_username);
        totalusers++;
        emit UserRegistered(_username);
    }

    function reassociateUser(string memory _username, string memory _securehash, address new_address) userExists(_username) public {
        require(compareStrings(users[_username].securehash, _securehash), "User already exists");
        users[_username].user_address = payable(new_address);
        emit UserReassociated(_username);
    }

    function addToVerifiedParties(address new_party) isOwner() public {
        verifiedParties.push(new_party);
    }

    function notAlreadyEnrolled(string memory _username, uint challengetype) public view returns (bool){
        for (uint i = 0; i < challenges[_username].length; i++){
            if (uint(challenges[_username][i].challengeType) == challengetype){
                return false;
            }
        }
        return true;
    }

    function enrollInChallenge(string memory _username, uint challengetype) isUser(_username) public{
        require(challengetype >= 0 && challengetype <= 4, "Invalid challenge type");
        require(notAlreadyEnrolled(_username, challengetype), "Already enrolled in challenge");
        
        if (challengetype == 0){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0,0,0,0, ChallengeType.Water));
        }
        else if (challengetype == 1){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0,0,0,0,ChallengeType.Sleep));
        }
        else if (challengetype == 2){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0,0,0,0,ChallengeType.BodyFat));
        }
        else if (challengetype == 3){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0,0,0,0,ChallengeType.Steps));
        }
        else if (challengetype == 4){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0,0,0,0, ChallengeType.Activity));
        }
        emit ChallengeEnrolled(_username, challengetype);
    }

    function numberOfEnrolledChallenges(string memory _username) public view returns (uint) {
        return challenges[_username].length;
    }

    function canBePromoted(uint currentTier, uint currentStreak) private pure returns (bool){
        if (currentTier == 1){
            if (currentStreak >= 20){
                return true;
            }
        }
        else if (currentTier == 2) {
            if (currentStreak >= 50){
                return true;
            }
        }
        return false;
    }

    function shouldBeDemoted(uint currentTier, uint streakgap) private pure returns (bool){
        if (currentTier == 2){
            if (streakgap > 20){
                return true;
            }
        }
        else if (currentTier == 3){
            if (streakgap > 5){
                return true;
            }
        }
        return false;
    }

    function ChallengeTierCompletionParameters(uint challengetype) public pure returns (uint, uint, uint){
        require(challengetype >= 0 && challengetype <= 4, "Invalid challenge type");
        uint tier1CompletionUnits;
        uint tier2CompletionUnits;
        uint tier3CompletionUnits;
    
        if (challengetype == 0){
            // The water challenge measured in millilitres
            tier1CompletionUnits = 1000;
            tier2CompletionUnits = 2500;
            tier3CompletionUnits = 4000;
        }
        else if (challengetype == 1){
            // The sleep challenge measured in minutes
            tier1CompletionUnits = 300;
            tier2CompletionUnits = 360;
            tier3CompletionUnits = 480;
        }
        else if (challengetype == 2){
            // The body fat challenge measured in percentage
            tier1CompletionUnits = 18;
            tier2CompletionUnits = 15;
            tier3CompletionUnits = 13;
        }
        else if (challengetype == 3){
            // The steps challenge measured in steps
            tier1CompletionUnits = 6000;
            tier2CompletionUnits = 10000;
            tier3CompletionUnits = 20000;
        }
        else if (challengetype == 4){
            // The Activity challenge measured in minutes
            tier1CompletionUnits = 60;
            tier2CompletionUnits = 120;
            tier3CompletionUnits = 240;
        }

        return (tier1CompletionUnits, tier2CompletionUnits, tier3CompletionUnits);
    }

// Because the way the contract is designed the challenge completions do not neccessarly have to be submitted every day
// as long as the trusted party calling the contract is able to verify the streaks and completions on thier end and send the appropriate state to the contract
    function updateUserChallengesState(string memory username, uint challengetype, uint newCompletionsnum, uint streaknumber, uint timestamp, bool continueStreak,  string memory data_url) isVerifiedParty() isEnrolled(username, challengetype) public{
        require(challengetype >= 0 && challengetype <= 4, "Invalid challenge type");
        bool found = false;
        for (uint i = 0; i < challenges[username].length; i++){
            if (uint(challenges[username][i].challengeType) == challengetype){
                found = true;
                challenges[username][i].lastSubmissionDate = timestamp; 

                // increment the total completions for the challenge tier the user is a part of
                if (challenges[username][i].tier1){
                    challenges[username][i].totalTier1Completions += uint64(newCompletionsnum);
                }
                else if (challenges[username][i].tier2){
                    challenges[username][i].totalTier2Completions += uint64(newCompletionsnum);
                }
                else if (challenges[username][i].tier3){
                    challenges[username][i].totalTier3Completions += uint64(newCompletionsnum);
                }

                if (continueStreak){
                    challenges[username][i].currentstreak += uint32(newCompletionsnum);
                    if (challenges[username][i].currentstreak >= challenges[username][i].longeststreak){
                        challenges[username][i].longeststreak = challenges[username][i].currentstreak;
                    }
                }
                else {
                    challenges[username][i].currentstreak = uint32(streaknumber);
                    challenges[username][i].currentstreakgap = uint32(streaknumber);
                }
            }

        }

        require(found, "Challenge not found");
        emit ChallengeCompleted(username, challengetype, newCompletionsnum, streaknumber, timestamp, continueStreak);
    }

    function getPromotion(string memory username, uint challengetype) isUser(username) public returns (bool){
        bool found = false;
        bool promoted = false;
        uint newtier;
        for (uint i = 0; i < challenges[username].length; i++){
            if (uint(challenges[username][i].challengeType) == challengetype){
                found = true;
                if (challenges[username][i].tier1){
                    if (canBePromoted(1, challenges[username][i].currentstreak)){
                        challenges[username][i].tier1 = false;
                        challenges[username][i].tier2 = true;
                        promoted = true;
                        newtier = 2;
                    }
                }
                else if (challenges[username][i].tier2){
                    if (canBePromoted(2, challenges[username][i].currentstreak)){
                        challenges[username][i].tier2 = false;
                        challenges[username][i].tier3 = true;
                        promoted = true;
                        newtier = 3;
                    }
                }
            }
        }
        require(found, "Challenge not found");

        if (promoted){
            emit ChallengeTierPromoted(username, challengetype, newtier);
        }

        return promoted;
    }

    event PublicKeyChanged(string newServerPublicKey);
    event OwnerChanged(address new_owner);

    event UserRegistered(string username);
    event UserReassociated(string username);
    event ChallengeEnrolled(string username, uint challengetype);
    event ChallengeCompleted(string username, uint challengetype, uint completions, uint streaknumber, uint timestamp, bool continueStreak);
    event ChallengeTierPromoted(string username, uint challengetype, uint newtier);
    event ChallengeTierDemoted(string username, uint challengetype, uint newtier);


    // compare two strings 

}