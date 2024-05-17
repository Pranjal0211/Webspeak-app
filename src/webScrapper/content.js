import { fetchContentFromWiki } from './wiki.js';

export const getContent = async(urlInput) => {
    const url = new URL(urlInput);
    if(url.hostname.includes('wikipedia.org')) {
        return fetchContentFromWiki(url.pathname.split('/wiki/')[1]);
    }
    else {
        return GenericFetchMethod(urlInput);
    }
}


const GenericFetchMethod = async(urlInput) => {
    const url = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(urlInput)}`;
    try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
    
        let html;
        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            html = data.contents;
        } else {
            html = await res.text();
        }
    
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
    
        const article = tempDiv.querySelector('article');
        const text = article ? article.textContent || article.innerText || '' : tempDiv.innerText.trim();
    
        return text;
    } catch(err) {
        console.error(err);
        return 'Issue with finding article !! Error: '
    }
}