## Running the app locally
Clone this repository to your machine. Navigate to the root (where package.json is) and do the following:


Install dependencies
```
npm install
```

Create .env file
```
touch .env
```

Add variables to .env
```
MONGODB_URI={mongodb uri for the database}
BACK_PORT=6969
SECRET={some string here}
TEST_MONGODB_URI={mongodb uri for tests}
```

start the backend
```
npm start
```

Now head to http://localhost:3000/ and you can play locally