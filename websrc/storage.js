

// Generate a JSON file

function generateJSONFile(data) {
    const content = JSON.stringify(data);
    const blob = new Blob([content], { type: "application/json" });
    const file = new File([blob], "example.json");
    
    return file
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

export async function downloadFitnessData(cid, username) {
    let jsonData = await getFitnessData(cid);

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