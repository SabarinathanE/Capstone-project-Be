Package:
1) cors
2) dotenv
3) express
4) mongodb
5) mongoose
6) nodemon
7) bcrypt
8) jsonwebtoken
9) nodemailer

1) To Activate your account, please clone my git to your local
2) I cant have accese to sent mail from gmail.
3) So after cloned my git, please install necessary packages.
4) After that Go to Mailers Folder inside NodeMailer.js
5) Before that Go to Ethereal Email website and create random mail id and Password.
6) Copy both and paste in the NodeMailer file at user and pass respectively.
7) then go to Routes then inside route.
8) inside Wherever u find the email section in from: section
9) there U have to replace this ethereal email.
10) Thats it ur good to go.
11) then test the website

12) /register :
finding if user already registered with the emailid
encrypting user password
creating object with user details
adding user to the db
composing mail
creating transport to send mail
sending mail to activate account

/login :
checking is user email is registered
validating password with email
checking if account is active or not
token is generated and passed as response
if account is not active
composing mail
creating transport to send mail
sending mail to activate account

/forgot :
checking user email is registered or not
creating expiry token
adding token to the database
composing mail
creating transport to send mail
sending mail to reset password

/reset :
finding user
verifying token
encrypting user password
updating password

/activation/:id :
finding user and updating account status
activating account and updating it in the database

/addUrl :
checking if url already exists
creating object of data details
adding url to database

/shortUrl :
finding url
creating randomstring
passing randomString as params
adding short url
finding url to send response

/getUrl/:string :
finding long url using string passed in params
increasing shortened url count
sending response with the longurl

/getUrl :
finding all shortened urls
sending all the shortened urls as response

/count :
getting count of number of urls created
sending the response with the urls created count
