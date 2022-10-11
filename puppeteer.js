const puppeteer = require('puppeteer');
// const prompt = require('prompt-sync')();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./UsedCar.db');
// db.run("CREATE TABLE CarInfo (name TEXT,make TEXT,model TEXT,year INT, km INT, drivetrain TEXT, price INT)");

const recreate_table = () => {
    db.exec("DROP TABLE IF EXISTS CarInfo;");
    db.run("CREATE TABLE CarInfo (name TEXT,make TEXT,model TEXT,year INT, km INT, drivetrain TEXT, price INT)");
}

const scrape = async (body, post, minYear, maxPrice) => {
    recreate_table();

// const body = '1'
// const post = 'k1n0b6'
// const minYear = '2016'
// const maxPrice = 40000

// Ask user input the filter conditon
// const body = prompt('What is your body type(1.Coupe 2. Sedan 3. Suv 4. Truck 5. Hatchback 6. Wagon )?');
// const post = prompt('What is your postal code?');
// const minYear = prompt('What is the min year of your car?');
// const maxPrice = Number(prompt('What is your budget?'));
const priceHigh = (maxPrice).toString();
const priceLow = (maxPrice-5000).toString();


// (async () => {
    // launch browser
    const browser = await puppeteer.launch({
        headless: false
    });
    //open a new page
    const page = await browser.newPage();
    //Go to autotrader website
    await page.goto('https://www.autotrader.ca/');
    //wait for location element loaded
    await page.waitForSelector('#locationAddress')
    await page.type('#locationAddress', post); //input address of user
    const uesd = await page.evaluate(() => {
        const q = document.querySelector('#basicSearch > div > div.row.searchTypeContainer > div > div.checkboxDesktop > div > div:nth-child(1) > label');
        q.click();
    }); // remove new cars

    const result = await page.evaluate(() => {
        const a = document.querySelector('#SearchButton');
        console.log(a)
        a.click();
    }); // start search

    await page.waitForSelector('#filterBtn')
    await page.click('#filterBtn')
    await page.waitForTimeout(2000);
    await page.click('#filterBtn')
    await page.click('#filterBtn')
    // input more filter conditions


    await page.click('#filterBtn')
    const location = await page.evaluate(() => {
        document.querySelector('#faceted-parent-Location > a:nth-child(1)').click()
    });
    await page.select('#proximity', '100')
    const location_apply = await page.evaluate(() => {
        document.querySelector('#applyLocation').click()
    });


    // select minyear
    await page.click('#filterBtn')
    const year = await page.evaluate(() => {
        document.querySelector('#faceted-parent-Year > a').click()
    });
    await page.select('#yearLow', minYear)
    const year_apply = await page.evaluate(() => {
        document.querySelector('#applyYear').click()
    });

    // set max pirce
    await page.click('#filterBtn')
    const price = await page.evaluate(() => {
        document.querySelector('#faceted-parent-Price > a').click()
    });
    await page.type('#rfPriceHigh', priceHigh)
    await page.type('#rfPriceLow', priceLow)
    const price_apply = await page.evaluate(() => {
            document.querySelector('#applyPrice').click()
        }

    );

    await page.waitForTimeout(2000); //wait for 1 second, increase stable
    await page.waitForSelector('#sortBy')
    await page.waitForSelector('#pageSize')
    await page.select("#sortBy", "CreatedDateDesc") //sort by date(New to old)
    await page.select("#pageSize", "50") // set page size to 50
     // select type of body
    switch (body) {
        case '1':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_1_label').click()
                var numOfCars = document.querySelector('#bs_1_label').innerText.substring((document.querySelector('#bs_1_label').innerText.indexOf('(')+1),document.querySelector('#bs_1_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
        case '2':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_5_label').click()
                var numOfCars = document.querySelector('#bs_5_label').innerText.substring((document.querySelector('#bs_5_label').innerText.indexOf('(')+1),document.querySelector('#bs_5_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
        case '3':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_6_label').click()
                var numOfCars = document.querySelector('#bs_6_label').innerText.substring((document.querySelector('#bs_6_label').innerText.indexOf('(')+1),document.querySelector('#bs_6_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
        case '4':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_7_label').click()
                var numOfCars = document.querySelector('#bs_7_label').innerText.substring((document.querySelector('#bs_7_label').innerText.indexOf('(')+1),document.querySelector('#bs_7_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
        case '5':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_2_label').click()
                var numOfCars = document.querySelector('#bs_2_label').innerText.substring((document.querySelector('#bs_2_label').innerText.indexOf('(')+1),document.querySelector('#bs_2_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
        case '6':
            var carAmount = await page.evaluate(() => {
                document.querySelector('#faceted-parent-BodyType > a').click()
                document.querySelector('#bs_8_label').click()
                var numOfCars = document.querySelector('#bs_8_label').innerText.substring((document.querySelector('#bs_8_label').innerText.indexOf('(')+1),document.querySelector('#bs_8_label').innerText.indexOf(')'))
                document.querySelector('#applyBodyStyles').click()
                return numOfCars
            });
            break;
    }
    console.log("!!!!!!!!!!!!!!!!!")
    console.log(carAmount)
    console.log("!!!!!!!!!!!!!!!!!")
    //if (carAmount > 100){
    //    carAmount = 3
    //}
    console.log(carAmount)

    var pageNum = 2
    //iterate each car
    for (i = 0; i < 100; i++) {
        carAmount--
        console.log(carAmount)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log('i is')
        console.log(i);
        await page.waitForTimeout(2000);

        //enter into current car page
        var detailed_car = await page.evaluate((i) => {
            var b = document.querySelectorAll('div.col-xs-12.result-item-inner.organic > div.col-xs-6.detail-center-area > div > div > h2 > a');
            console.log("i is ", i)
            b[i].click();
            return b
        }, i);
        await page.waitForSelector('#spec-value-0')

        //collect mileage of current car
        const mileage = await page.evaluate(() => {
            var km = document.querySelector('#spec-value-0').innerText
            return km
        });

        //collect year of current car
        const year = await page.evaluate(() => {
            var tempYear = document.querySelector('#heroTitleWrapper > p.hero-title').innerText.substring(0, 4)
            return tempYear
        });

        //collect name of current car
        const name = await page.evaluate(() => {
            var tempName = document.querySelector('#heroTitleWrapper > p.hero-title').innerText.substring(4, )
            return tempName
        });
       var make = ''
       var model = ''
       for (z = 1; z < 10; z++){
           if(name.substring(z,z+1) == ' '){
               break;
           }
           else{
               make += name.substring(z,z+1)
           }
        }

        for (y = make.length+2; y < 20; y++){
           if(name.substring(y,y+1) == ' '){
               break;
           }
           else{
               model += name.substring(y,y+1)
           }
        }

        //collect price of current car
        const price = await page.evaluate(() => {
            var tempPrice = document.querySelector('#heroWrapperDescription > div.vdp-hero-price-badge > div > div.hero-price-wrapper > div.col-xs-12.hero-price-container.no-margin.no-padding > p.hero-price').innerText
            return tempPrice
        });

        //collect drivetrain of current car
        const drive = await page.evaluate(() => {
            var tempDrive = 'Unknown'
            if (document.querySelector('#spec-key-3') != null && document.querySelector('#spec-key-3').innerText == 'Drivetrain') {

                tempDrive = document.querySelector('#spec-value-3').innerText
            } else if (document.querySelector('#spec-key-4') != null && document.querySelector('#spec-key-4').innerText == 'Drivetrain') {
                tempDrive = document.querySelector('#spec-value-4').innerText
            } else if (document.querySelector('#spec-key-5') != null && document.querySelector('#spec-key-5').innerText == 'Drivetrain') {
                tempDrive = document.querySelector('#spec-value-5').innerText
            } else if (document.querySelector('#spec-key-6') != null && document.querySelector('#spec-key-6').innerText == 'Drivetrain') {
                tempDrive = document.querySelector('#spec-value-6').innerText
            } else if (document.querySelector('#spec-key-7') != null && document.querySelector('#spec-key-7').innerText == 'Drivetrain') {
                tempDrive = document.querySelector('#spec-value-7').innerText
            }
            return tempDrive
        });

        // write data into table
        db.serialize(function() {
            var stmt = db.prepare("INSERT INTO CarInfo VALUES (?,?,?,?,?,?,?)");
            stmt.run(name, make, model, year, mileage, drive, price);
            stmt.finalize();
        });

        //Go back car list
        await page.goBack()

        console.log('Go back successful')
        if (i == 49 && pageNum ==3 ){
            await browser.close();
            break
        }
        else if(i == 49){
            pageNum++
            await page.waitForTimeout(2000);
            await page.evaluate((pageNum) => {
            document.getElementsByClassName('page-item')[pageNum].children[0].click()

        },pageNum);
            i = 0


        }
        else if(carAmount == 0){
            await browser.close();
            break
        }

    }

    //db.close();
// })();
};

module.exports = {
    scrape,
}
