
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract VigourHall {
    address public owner;

    struct User {
        address payable user_address;
        string username;
        string securehash;

    }

    enum ChallengeType {
        Water,
        Sleep,
        BodyFat,
        Steps,
        Exercise
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
    mapping(string => Challenge[] ) challenges;

    string[] public usernames;

    constructor() {
        owner = msg.sender;
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
    

    function registerUser(string memory _username, string memory _securehash) public {
        require(users[_username].user_address == address(0), "User already exists");
        users[_username] = User(payable(msg.sender), _username, _securehash);
        usernames.push(_username);
    }

    function reassociateUser(string memory _username, string memory _securehash, address new_address) userExists(_username) public {
        require(compareStrings(users[_username].securehash, _securehash), "User already exists");
        users[_username].address = payable(new_address);
    }

    function _notAlreadyEnrolled(string memory _username, uint challengetype) private view returns (bool){
        for (uint i = 0; i < challenges[_username].length; i++){
            if (challenges[_username][i].challengeType == challengetype){
                return false;
            }
        }
        return true;
    }

    function enrollInChallenge(string memory _username, uint challengetype) isUser(_username) public{
        require(challengetype >= 0 && challengetype <= 4, "Invalid challenge type");
        require(_notAlreadyEnrolled(_username, challengetype), "Already enrolled in challenge");
        
        if (challengetype == 0){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0, ChallengeType.Water));
        }
        else if (challengetype == 1){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0, ChallengeType.Sleep));
        }
        else if (challengetype == 2){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0, ChallengeType.BodyFat));
        }
        else if (challengetype == 3){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0, ChallengeType.Steps));
        }
        else if (challengetype == 4){
            challenges[_username].push(Challenge(true, false, false, 0, 0, 0, 0, ChallengeType.Exercise));
        }
    }

    function canBePromoted(uint currentTier, uint nextTier, uint currentStreak) private pure returns (bool){
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


// due to the stack limitation of solidity we will have to update state in to groups

// Because the way the contract is designed the challenge completions do not neccessarly have to be submitted every day
// as long as the trusted party calling the contract is able to verify the streaks and completions on thier end and send the appropriate state to the contract
    function updateUserChallengesState(string username, uint challengetype, uint newCompletions, bool continueStreak, uint streaknumber) isOwner() public{
        
    }



    // compare two strings 
    

}