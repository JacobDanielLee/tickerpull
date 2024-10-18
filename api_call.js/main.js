

//New Note: We will most likely need an input before checking the CIK against the website and loading all stock data for ut
    //console.log("This loads the data")
    //Find https://www.sec.gov./files/company_tickers.json  and save as link?
    //const ciklink = 

//This function returns a dataframe that has tickers as the keys and cik as the values. To map Tickers to CIK numbers
async function FetchCik() {   
    const url = "https://www.sec.gov./files/company_tickers.json";
    const response = await fetch(url);
    const data = await response.json();
    const tickers = Object.values(data).map(entry => ({ticker: entry.ticker, cik: entry.cik_str}));
    const df = new dfd.DataFrame(tickers);
    return df;
}

//This function will take the entered ticker, find the corresponding CIK, and save it down. 
async function cikNum(tickers, tickerDF) {
    const cikList = [];
    tickers.forEach(ticker => {
        const match = tickerDF.query(df => df['ticker'].eq(ticker));
        if (match.shape[0]>0) {
            cikList.push(match.iloc({rows: [0]}).cik)
        }
    });
    return cikList;
}

//Takes the CIKs and creates respective dataframes for each to then be passed into append data that populates the page
async function fetchData(cikList) {
    const dataframes = [];
    for (const cik of cikList) {
        const url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK'+ cik + '.json';
        const response = await fetch(url);
        const data = await response.json();
        const df = new dfd.Dataframe(data);
        dataframes.push(df);
    }

    for (const d of dataframes) {
        appendData(d);
    }
}

//This function attempts to display all the relevant data in the dataframe and move it to HTML

function appendData(dataDf) {
    //Retrieves the most recent date (Today)
    const mrqEnd = new Date().getTime();

    // Find the closest date to the target
    let closestData = null;
    let closestDiff = Infinity;

    //Array of data that needs to be populated. This will represent what we are searching for in the DF
    missingData = ["WeightedAverageNumberOfDilutedSharesOutstanding"];
    
    //Represents map that will have keys = datatype and values = data
    const refMap = new Map();

    for (const v of missingData) {
        //Retrieve shares data from Dataframe
        //The ? is an optional handling chain that returns undefined in case it does not find v in the data
        const variable = dataDF.facts.dei[v]?.units?.shares;

        //Loop through data toi find share with closest date
        variable.forEach(share=> {
            const sDate = new Date(share.end).getTime();
            const diff = Math.abs(mrqEnd - sDate);

            //If the difference is closer than the closest difference, set it to that difference
            if (diff < closestDiff) {
                closestDiff = diff;
                closestData = share;
            }
        });

        //Makes variable set to closest data
        if (closestData) {
            refMap.set(v, closestData.val);
        } else {
            console.error("No data found for the closest date");
        }
    }

    const dWASHY3 = document.getElementsByID('dWASHY3');
    dWASHY3.innerHTML = refMap["WeightedAverageNumberOfDilutedSharesOutstanding"];

}
