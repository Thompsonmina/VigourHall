import vigourhall_artefacts from '../out/vigour_hall.sol/VigourHall.json'
import { ethers } from "ethers";

const vigour_hall_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const vigour_hall_abi = vigourhall_artefacts.abi;


export async function isEnrolledInChallenge(provider, username, challengeType) {
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, provider);

    // Call the isEnrolledInChallenge function
    const notEnrolled = await contract.notAlreadyEnrolled(username, challengeType);

    return !notEnrolled;
}

export async function enrollInChallenge(signer, username, challengeType) {
    const contract = new ethers.Contract(vigour_hall_address, vigour_hall_abi, signer);


    // Call the enrollInChallenge function
    const tx = await contract.enrollInChallenge(username, challengeType);
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    return receipt;
}


export function get_users() {
    return [];
}