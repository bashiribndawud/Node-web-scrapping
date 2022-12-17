const puppeteer = require("puppeteer");
const fs = require('fs')


const data = {
    list : []
}



async function main(skill){
  // this launches chromium
  const browser = await puppeteer.launch({ headless: false });
  // this one a new tab
  const page = await browser.newPage();

  // https://ng.indeed.com/jobs?q={skill}&l=Nigeria&vjk=b63eff4a16d5ff20
  //   https://ng.indeed.com/jobs?q={skill}&l=Nigeria&vjk=455606d79d42c8b2

  await page.goto(
    `https://ng.indeed.com/jobs?q=${skill}&l=Nigeria`,{
        timeout: 0,
        waitUntil: 'networkidle0', 
    }
  );

//   const pdf = page.pdf({
//     path: "",
//     format: "A4"
//   })

//   const screenshot = page.screenshot({
//     path: "",
//     fullPage: true
//   })

  const jobData = await page.evaluate(async (data) => {
    
    const items = document.querySelectorAll('td.resultContent');
    items.forEach((item, index) =>{
        const title = item.querySelector('h2.jobTitle > a')?.innerText
        const link = item.querySelector('h2.jobTitle >a')?.href;
        const salary = item.querySelector(
          "div.metadata.salary-snippet-container > div.attribute_snippet"
        )?.innerHTML;
        const companyName = item.querySelector('span.companyName');

        if(salary === null){
            salary = "not defined"
        }

        data.list.push({
            title,
            salary,
            companyName,
            link
        })
    });
    return data;
  }, data)

  let response = await jobData;
  let json = JSON.stringify(jobData, null, 2)
  fs.writeFile('job.json', json, 'utf-8', () => {
    console.log('written in job.json')
  })
  
  // this closes the browser
  browser.close();
  return response;
}

module.exports = main