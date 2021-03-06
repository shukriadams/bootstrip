TAG=$(git describe --abbrev=0 --tags)
HASH=$(git rev-parse --short HEAD)

mkdir -p ./../web
echo "{ \"tag\": \"$TAG\", \"hash\": \"$HASH\" }" > ./../web/version.json