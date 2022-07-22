import axios from 'axios' //Fetch JSON 
import cheerio from 'cheerio'
import express from 'express'
import dotenv from 'dotenv';


dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

//burda web scrape ile veri api haline gelecek!!
const getData = async (url = 'https://www.spotrac.com/epl/rankings/') => {
    //
    let { data:html }  = await axios.get(url,{
        headers : {
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        }
    }) 
    const $ = cheerio.load(html) //document == html
    let names = $('#main > div.rankings > div > table > tbody > tr > td.rank-name.player.noborderright > h3 ').text().split('  ') // ['ronaldo','debryne
    let salary = $('#main > div.rankings > div > table > tbody > tr > td.rank-value > span').text().trim().split('£') //[]
    console.log('salary',names.length)    
    console.log('salary',salary.length)

    return names.reduce((acc,cur,i) => {
        acc.push({name : cur,salary : salary[i+1]+'£'}) //{name : 'ronaldo' : salary:2000000}
        return acc
    },[])
}

// localhost/5000?apid=a123123 router
app.get('/apid' , (req,res) => {
    if(req.query.id != 1231232133){
        res.status(500).json({err : 'invalid key'}) 
    }
    else res.status(200).json({  apid : req.query.id })
})

app.get('/' ,async (req,res) => {
    let data = await getData()
    res.json({...data})
})
// initialize server
app.listen(PORT,() => {
    console.log(`Server is listening ${PORT}`)
})
