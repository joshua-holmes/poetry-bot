docker buildx build --platform linux/arm64 -t joshuapholmes/poetry-bot:latest-arm64 --push .
docker buildx build --platform linux/amd64 -t joshuapholmes/poetry-bot:latest-amd64 --push .
