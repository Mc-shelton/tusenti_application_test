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
clone the repo from github
navigate to the root of the project

run in the terminal 
	docker compose -f docker-compose.yml build
# to run server
	docker-compose up app

# to run test
 docker-compose up test-app

# to retry runs for app and tes,
first close instances by pressing 'ctrl'+'c' then run
   docker compose down --volumes
then corresponding commands
