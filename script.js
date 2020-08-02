
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const errorDisplay = document.getElementById("error");


function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
    if(!loader.hidden){
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

//API Grabbing quote
let counter = 0;
async function getQuote() {
    showLoadingSpinner();
    errorDisplay.hidden = true;
    const proxyURL = "https://pacific-beyond-71706.herokuapp.com/";//Our own server to use for a header for API
    const apiURL = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
    try {
        const response = await fetch(proxyURL + apiURL); //adding the proxy header
        const data = await response.json();
        
        // default parameter in case no Author is displayed
        if(data.quoteAuthor === "") { 
            authorText.innerText = "Unknown";
        } else {
            quoteText.innerText = data.quoteText;
        }
        //checking quote length to lower font size for larger quotes
        if (data.quoteText.length > 80){
            quoteText.classList.add("long-quote")
        } else {
            quoteText.classList.remove("long-quote")
        }
        authorText.innerText = data.quoteAuthor;
        //stop loader and show quote
        hideLoadingSpinner();
    } catch (error){
        counter++;
        if(counter < 10){
            getQuote(); //in case there is any error with a quote from api just rerun the async fn
        } else{
            errorDisplay.hidden = false; // So it doesn't get stuck in I-loop
        }
        
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterURL = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterURL, "_blank") // opens window with url in new window
}

newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);


// Run at start
getQuote();
