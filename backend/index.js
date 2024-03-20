const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 3304;

app.use(bodyParser.json());
// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "QWERT!@#$%",
    database: "landmarkreporter"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the process on connection error
    } else {
        console.log('Connected to MySQL');
    }
});
app.use(cors({
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true
}))



app.post('/addUser', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            id,
            fullName,
            dofb,
            emails,
            phoneCode,
            phoneNumber,
            passwords,
            location
        } = req.body;

        const fullnumber = phoneCode + phoneNumber;
        const currentDate = new Date().toISOString(); // Get current date in ISO format
        const role=0;
        const sql = `INSERT INTO tbl_user (full_name, dob, email,phone_code, phone_number, password, date_added,userlocation,role) 
                    VALUES (?, ?, ?, ?, ?, ?,?,?,?)`;

        const result = await query(sql, [fullName, dofb, emails,phoneCode, phoneNumber, passwords, currentDate,location,role]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/updateUser', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            id,
            fullName,
            dofb,
            emails,
            phoneCode,
            phoneNumber,
            passwords,
            location
        } = req.body;

        const fullnumber = phoneCode + phoneNumber;
        const currentDate = new Date().toISOString(); // Get current date in ISO format
        const role=0;
       
                    const sql = `UPDATE tbl_user 
                    SET full_name = ?, dob = ?, email = ?, phone_code = ?, phone_number = ?, password = ?, 
                         date_added = ?, userlocation = ?
                    WHERE id = ?`;
        const result = await query(sql, [fullName, dofb, emails,phoneCode, phoneNumber, passwords, currentDate,location,id]);

        console.log('Record updated successfully');
        res.status(200).json({ ok: true, message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Perform a query to check if the email and password match a user in the database
    const query = 'SELECT * FROM tbl_user WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: results[0] });
        }

        const user = results[0];
        console.log(user)
        // Compare hashed password with provided password
        if (user.password !== password) {
            return res.status(401).json({ message: results[0] });
        }

        // Valid login credentials
        console.log(user.id);
        res.json({ message: 'Login successful', user });
    });
});
app.get('/getLandmarkData', async (req, res) => {
    try {
        const landmarkQuery = `
            SELECT 
                a.id AS landmarkId,
                a.name AS landmarkName,
                a.location AS addedFrom,
                a.image AS images,
                b.id AS commentId,
                b.comment,
                c.full_name AS addedBy,
                d.full_name AS commenter
            FROM 
                tbl_landmark AS a
                LEFT JOIN tbl_comments AS b ON a.id = b.landmark_id
                LEFT JOIN tbl_user AS c ON a.added_by = c.id
                LEFT JOIN tbl_user AS d ON b.added_by = d.id
            ORDER BY 
                a.id, b.id;
        `;

        const landmarkData = await query(landmarkQuery);

        if (landmarkData.length === 0) {
            return res.status(404).json({ ok: false, message: 'No Landmark data Found' });
        }


        // Group comments by landmark ID
        const groupedData = landmarkData.reduce((acc, item) => {
            const { landmarkId, landmarkName, addedFrom, images, addedBy } = item;
            if (!acc[landmarkId]) {
                acc[landmarkId] = { 
                    landmarkId, 
                    landmarkName, 
                    addedFrom, 
                    images, 
                    addedBy, 
                    comments: [] 
                };
            }
            if (item.commentId) {
                acc[landmarkId].comments.push({
                    commentId: item.commentId,
                    comment: item.comment,
                    commenter: item.commenter
                });
            }
            return acc;
        }, {});

        const result = Object.values(groupedData);
        //console.log(result)
        res.status(200).json({ ok: true, landmarkData: result });
    } catch (error) {
        console.error('Error fetching Landmark data:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.get('/getLandmarkFilterData', async (req, res) => {
    const landmarkID = req.query.landmarkID;
    let landmarkQuery=''
    console.log('getLandmarkFilterData')
    console.log(landmarkID)
    try {
        if(landmarkID!='' && landmarkID!=null && landmarkID!=''){
         landmarkQuery = `
            SELECT 
                a.id AS landmarkId,
                a.name AS landmarkName,
                a.location AS addedFrom,
                a.image AS images,
                b.id AS commentId,
                b.comment,
                c.full_name AS addedBy,
                d.full_name AS commenter
            FROM 
                tbl_landmark AS a
                LEFT JOIN tbl_comments AS b ON a.id = b.landmark_id
                LEFT JOIN tbl_user AS c ON a.added_by = c.id
                LEFT JOIN tbl_user AS d ON b.added_by = d.id
                where a.name  LIKE '%${landmarkID}%' 
            ORDER BY 
                a.id, b.id;
        `;
        }
        else {
             landmarkQuery = `
            SELECT 
                a.id AS landmarkId,
                a.name AS landmarkName,
                a.location AS addedFrom,
                a.image AS images,
                b.id AS commentId,
                b.comment,
                c.full_name AS addedBy,
                d.full_name AS commenter
            FROM 
                tbl_landmark AS a
                LEFT JOIN tbl_comments AS b ON a.id = b.landmark_id
                LEFT JOIN tbl_user AS c ON a.added_by = c.id
                LEFT JOIN tbl_user AS d ON b.added_by = d.id
            ORDER BY 
                a.id, b.id;
        `;
        }
        console.log(landmarkQuery)
        const landmarkData = await query(landmarkQuery);

        if (landmarkData.length === 0) {
            return res.status(404).json({ ok: false, message: 'No Landmark data Found' });
        }


        // Group comments by landmark ID
        const groupedData = landmarkData.reduce((acc, item) => {
            const { landmarkId, landmarkName, addedFrom, images, addedBy } = item;
            if (!acc[landmarkId]) {
                acc[landmarkId] = { 
                    landmarkId, 
                    landmarkName, 
                    addedFrom, 
                    images, 
                    addedBy, 
                    comments: [] 
                };
            }
            if (item.commentId) {
                acc[landmarkId].comments.push({
                    commentId: item.commentId,
                    comment: item.comment,
                    commenter: item.commenter
                });
            }
            return acc;
        }, {});

        const result = Object.values(groupedData);
        console.log(result)
        res.status(200).json({ ok: true, landmarkData: result });
    } catch (error) {
        console.error('Error fetching Landmark data:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.get('/getLandMarkNames', async (req, res) => {
    try {
        // Query to fetch distinct landmark names
        const landmarkQuery = `SELECT DISTINCT name FROM tbl_landmark`;

        const landmarkNames = await query(landmarkQuery);

        if (landmarkNames.length === 0) {
            return res.status(404).json({ ok: false, message: 'No Landmark Names Found' });
        }
console.log(landmarkNames)
        res.status(200).json({ ok: true, landmarkNames: landmarkNames });
    } catch (error) {
        console.error('Error fetching Landmark names:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/addComment', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const { itemId, newComment, user, location } = req.body;
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        // Prepare the SQL query to add new comment of the selected item
        const sql = `INSERT INTO tbl_comments (comment, added_by, landmark_id, date_added) 
                    VALUES (?, ?, ?, ?)`;

        const result = await query(sql, [newComment, user, itemId, currentDate, location]);

        console.log('Comment added successfully');
        res.status(200).json({ ok: true, message: 'comment added successfully' });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/addLandmark', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            fullName,
            landmark,
            addedBy,          
            location
        } = req.body;
        const imagesJSON = JSON.stringify(landmark)
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const sql = `INSERT INTO tbl_landmark (name, image, added_by,date_added, location) 
                    VALUES ( ?, ?,?,?,?)`;

        const result = await query(sql, [fullName, imagesJSON, addedBy,currentDate, location]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/deleteComment', async (req, res) => {
    try {
        const { commentID } = req.body;
        console.log(commentID)
        const sql = `
            DELETE FROM tbl_comments
            WHERE id = ?
        `;

        const result = await query(sql, [commentID]);

        if (result.affectedRows > 0) {
            console.log(`Comment with id ${commentID} deleted successfully`);
            res.status(200).json({ ok: true, message: 'comment deleted successfully' });
        } else {
            console.error(`Comment with id ${commentID} not found`);
            res.status(404).json({ ok: false, message: 'comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
