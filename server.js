function loadProxy() {
    const url = document.getElementById('urlInput').value;
    const proxyFrame = document.getElementById('proxyFrame');

    if (url) {
        fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
            headers: {
                'Origin': 'https://yourdomain.com', // Replace with your domain
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            // Display the fetched content inside iframe
            proxyFrame.srcdoc = html;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch the requested URL!');
        });
    } else {
        alert("Please enter a valid URL!");
    }
}
