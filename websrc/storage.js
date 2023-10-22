import { encrypt, decrypt } from "./encrypt.js";
// Generate a JSON file

function generateJSONFile(data) {
    const content = JSON.stringify(data);
    const blob = new Blob([content], { type: "application/json" });
    const file = new File([blob], "example.json");
    
    return file
}

function encryptFitnessData(data, mnemonic_phrase) {

    console.log("whats going on here", data)
    for (let key in data) {
        console.log(key, "key")
        if (data.hasOwnProperty(key)) { // This ensures you're not iterating over prototype propertie
            for (let nestkey in data[key]) {
                console.log(nestkey, "nestkey")
                console.log(key); // This will log the keys: a, b, c
                console.log(data[key][nestkey], "data[key][nestkey]")
                data[key][nestkey] = encrypt(JSON.stringify(data[key][nestkey]), mnemonic_phrase);
            }
        }
    }
    return data
}

function decryptFitnessData(data, mnemonic_phrase) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) { // This ensures you're not iterating over prototype propertie
            for (let nestkey in data[key]) {
                data[key][nestkey] = decrypt(JSON.parse(data[key][nestkey]), mnemonic_phrase);
            }
        }
    }
    return data
}

function oneLevelDeepMerge(obj1, obj2) {
    const output = {...obj1};  // Start with a shallow copy of obj1
    
    for (const [key, value] of Object.entries(obj2)) {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null && obj1.hasOwnProperty(key) && typeof obj1[key] === 'object') {
        // If the property is an object on both obj1 and obj2, merge them
        output[key] = {...obj1[key], ...value};
      } else {
        // Otherwise, use the value from obj2
        output[key] = value;
      }
    }
    
    return output;
}
  

export async function saveNewFitnessData(new_data, mnemonic_phrase, username, cid = null) {

    let encrypted_new_data = encryptFitnessData(new_data, mnemonic_phrase);
    console.log(encrypted_new_data, "encrypted_new_data")

    if (cid == null || cid == "") {
        cid = await sendFitnessData(encrypted_new_data);
        return cid
    }

    let current_data = await getFitnessData(cid);
    let merged_data = oneLevelDeepMerge(current_data, encrypted_new_data);
    cid = await sendFitnessData(merged_data, username);
    return cid
}

export async function sendFitnessData(data, username) {
    let file = generateJSONFile(data)
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the Flask endpoint
    let response = await fetch(`http://127.0.0.1:5000/store_fitness_data/${username}`, {
            method: "POST",
            body: formData,
    })
    let json_data = await response.json()
    if (json_data.error) {
        console.error("Upload failed:", json_data.error);
    }
    else {
        console.log("JSON file uploaded successfully. CID:", json_data.cid);
        return json_data.cid
    }    
}

export async function getFitnessData(cid) {
    let data;
    let url = "https://" + cid + ".ipfs.w3s.link"

    let response = await  fetch(url)
    let json_data = await response.json()
    console.log(json_data)
    return json_data
}

export async function downloadFitnessData(cid, username, decrypt=false, mnemonic_phrase=null) {
    let jsonData = await getFitnessData(cid);

    if (decrypt) {
        jsonData = decryptFitnessData(jsonData, mnemonic_phrase);
    }

    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    
    // Create a link element
    const link = document.createElement('a');

    // Set link attributes
    link.href = window.URL.createObjectURL(blob);
    link.download = username + '.json';

    // Trigger the download
    link.click();
    // Clean up
    window.URL.revokeObjectURL(link.href);
}

