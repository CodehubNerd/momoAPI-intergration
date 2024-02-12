

fetch('https://sandbox.momodeveloper.mtn.com/collection/token/', {
        method: 'POST',
        // Request headers
        headers: {
            'Authorization': 'Basic NmY5OGVkMTgtOTY5MC00YWFjLWFmYTYtNjkxMjY3ZGJjZTBlOmU5NjNiMGE5Y2M2YTRjY2NiMmE2NjlkNjE5YmU5MWVk',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '36a9cea744d74f268f28dc01085bc3be',}
    })
    .then(response => {
        console.log(response.status);
        console.log(response.text());
    })
    .catch(err => console.error(err));