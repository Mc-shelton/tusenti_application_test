# SET UP DOCUMENTATION

# prerequisites,
- node
- typescript,
- docker
- docker compose
- postgresql :
 	user:postgres
 	password: Shelton.?

# to set up server


# to run server
 docker compose -f docker-compose.yml up --build

# to run test
docker compose -f docker-compose.test.yml up --build

# to retry runs for app and tes,
first close instances by pressing 'ctrl'+'c' then run
   docker compose down --volumes
then corresponding commands

docker build -t mch
docker build -t mcsheltonomondi/tusenti-app:latest -f Dockerfile .