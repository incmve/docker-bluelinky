build:
	docker build -t wranglatang/docker-bluelinky .
run:
	docker run -p 8080:8080 -v "${PWD}:/config" wranglatang/docker-bluelinky:latest
