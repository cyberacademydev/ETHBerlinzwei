# Cybaca frontend
### Run :
Install all dependencies 

    npm install

Run app

    yarn start

### Docker :

Build container:

    docker build --rm -t cybaca:latest .

Run container

    docker run --rm  -p 3000:3000 --name cybaca cybaca:latest

For run as demon add

    -d

Read logs from container

    docker logs cybaca
