# garageJS
Login and Control panel built with HTML, vanilla Javascript, and a NodeJS API using ExpressJS. The API will send you a message each time the garage opens or closes.

## API
Handles authentication using JWT and python script to control relays.

The relays are connected to garage door/relay switch and a light switch if you wish.

 ### Environment Variables(Required)
 TO_NUMBER = Phone number to text when opened

 FROM_NUMBER = Phone number from when sending text message

 DATABASE = MongoDB database connection string

 TOKEN_SECRET = JWT secret for token signing

 TWILIO_AUTH_TOKEN = Twilio authentication token

 TWILIO_SID = Twilio SID

 ## CLIENT
 There are only two pages: Login(/login) and Home(/home). Login page logs the user in while the Home page is the control panel.

