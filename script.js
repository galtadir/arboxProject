const readXlsxFile = require("read-excel-file/node");


//The function get the file path and the club id
const upload = async (path, clubId) => {


    try {
        //load the file
        let rows = await readXlsxFile(path)
        let titles = rows[0]
        //save in dictionary the index for each title
        let titelsIndexs = {}
        for (let i = 0; i < titles.length; i++) {
            titelsIndexs[titles[i]] = i;
        }

        //set to save and check if theres duplicate emails in the file
        let emailsMemory = new Set()

        let emails = " ( "
        for (let i = 1; i < rows.length - 1; i++) {
            let currentEmail = rows[i][titelsIndexs['email']]
            //if is duplicate email throw exception
            if (emailsMemory.has(currentEmail)) {
                throw `Duplicate Email : ${currentEmail}!!`;
            }
            emailsMemory.add(currentEmail);
            emails += `'${currentEmail}', `
        }
        currentEmail = rows[rows.length - 1][titelsIndexs['email']]
        if (emailsMemory.has(currentEmail)) {
            throw `Duplicate Email : ${currentEmail}!!`;
        }
        emails += `'${currentEmail} )'`

        //query that return true if one of the email is already in the db
        let emailsQuery = `SELECT COUNT( * ) > 0 AS bool From users where email in ${emails}`
        console.log(emailsQuery)
        console.log()
        console.log()


        //for each row two queries for insert to db
        for (let i = 1; i < rows.length; i++) {
            var sqlQuery1 = `INSERT INTO users (id, first_name,last_name,phone,email,joined_at,club_id) VALUES (((SELECT MAX(id) + 1) FROM users),${rows[i][titelsIndexs['first_name']]} ,${rows[i][titelsIndexs['last_name']]},${rows[i][titelsIndexs['phone']]},${rows[i][titelsIndexs['email']]},${rows[i][titelsIndexs['joined_at']]},${clubId})`;
            var sqlQuery2 = `INSERT INTO memberships (id, user_id,start_date,end_date,membership_name) VALUES (((SELECT MAX(id) + 1) FROM memberships),((SELECT MAX(id)) FROM users) ,${rows[i][titelsIndexs['membershp_start_date']]},${rows[i][titelsIndexs['membership_end_date']]},${rows[i][titelsIndexs['membership_name']]})`;
            console.log(sqlQuery1)
            console.log()
            console.log(sqlQuery2)
            console.log()
            console.log()
        }

    } catch (e) {
        console.log(e)
    }

}
upload("C:\\Users\\Gal\\Downloads\\jimalaya.xlsx", 2400)



