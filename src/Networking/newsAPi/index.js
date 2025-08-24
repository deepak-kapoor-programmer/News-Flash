const apikey = "a2a124d4b006486eb5418207c706c2ec";
// const apikey = "cb6d0462dc43418496699cbfd4917b61";

export const FetchNews = async (keyword = "india", date = null, useTopHeadlines = false) => {
    // const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apikey}`;

    // let url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apikey}`
    let url;

    // if (date) {
    //     url = `https://newsapi.org/v2/everything?q=india&from=${date}&to=${date}&sortBy=publishedAt&apiKey=${apikey}`;
    // } else {
    //     url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apikey}`;
    // }
    try {

        if (useTopHeadlines) {
            // Top headlines (default home view)
            // console.log("headline");
            url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apikey}`;
        } else if (date) {
            // console.log("date");
            url = `https://newsapi.org/v2/everything?q=${keyword}&from=${date}&to=${date}&sortBy=popularity&apiKey=${apikey}`;
        } else {
            // console.log("keywords");
            url = `https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=${apikey}`;
        }
        // console.log("url  ", url);

        const response = await fetch(url);
        console.log("Api worked..");
        
        const data = await response.json();
        // console.log("hello fardeen in index",data)
        return ({
            status: "success",
            result: data
        });
    }
    catch (error) {
        console.log("error is ", error);
        return ({
            status: "failed",
            result: error
        });
    }
}

