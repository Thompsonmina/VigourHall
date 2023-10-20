import vigourhall_artefacts from '../out/vigour_hall.sol/VigourHall.json'
import { ethers } from "ethers";

export const vigour_hall_address = "0xfc9bD7939E8F848290fCdCf88e9e19CfdECe878B";
export const vigour_hall_abi = vigourhall_artefacts.abi;


export async function isEnrolledInChallenge(provider, username, challengeType) {
    console.log("is in isenrolled")
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, provider);

    // Call the isEnrolledInChallenge function
    const notEnrolled = await contract.notAlreadyEnrolled(username, challengeType);

    return !notEnrolled;
}

export async function enrollInChallenge(signer, username, challengeType) {
    console.log("is in enroll")
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, signer);


    // Call the enrollInChallenge function
    const tx = await contract.enrollInChallenge(username, challengeType);
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    return receipt;
}

export async function getUsers(provider) {
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, provider);
        
    let userCount = await contract.totalusers();
    // console.log(ethers.utils.BigNumber.from(userCount).toNumber());
    userCount = Number(userCount)

    // Create promises to fetch usernames concurrently
    const usernamePromises = Array.from({ length: userCount }, (_, i) =>
        contract.usernames(i)
    );

    // Resolve all promises and get the usernames
    const usernames = await Promise.all(usernamePromises);

    console.log(usernames);
    return usernames;
}


export async function getUserDetails(provider, username) {
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, provider);

    let userDetails = await contract.users(username);
    console.log(userDetails)
    console.log(userDetails[0])

    userDetails = {address: userDetails[0], username: userDetails[1], storage_cid: userDetails[2]}

    const enrolledNums = Number(await contract.numberOfEnrolledChallenges(username))

    const enrolledChallengesPromises = Array.from({ length: enrolledNums }, (_, i) =>
        contract.challenges(username, i)
    );

    const challenges = await Promise.all(enrolledChallengesPromises);
   
    const formatted_challenges = challenges.flatMap((challenge) => {
        return {
            tier1: challenge[0], tier2: challenge[1], tier3: challenge[2],
            currentstreak: Number(challenge[3]), longeststreak: Number(challenge[4]), currentstreakgap: Number(challenge[5]),
            totalTier1Completions: Number(challenge[6]), totalTier2Completions: Number(challenge[7]), totalTier3Completions: Number(challenge[8]),
            lastSubmissionDate: challenge[9], challengeType: Number(challenge[10])
        }
    })

    console.log(challenges, "challenges");
    console.log(formatted_challenges, "formatted_challenges")
    userDetails["challenges"] = challenges;
    return userDetails;
}

