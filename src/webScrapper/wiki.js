
export function fetchContentFromWiki(title) {    
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${title}&origin=*`;
    return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const pageId = Object.keys(data.query.pages)[0]; 
        const extractHtml = data.query.pages[pageId].extract; 
        return extractTextFromHTML(extractHtml); 
    })
    .catch(error => {
        console.error('Error fetching Wikipedia page:', error);
        throw error;
    });
}


function extractTextFromHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body.textContent.trim();
    return textContent;
}