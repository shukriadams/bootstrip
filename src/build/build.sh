# fail on errors
set -e 

# write current tag+commit hash to data file so this can be embedded into headers
sh ./writeHash.sh

cd ..

# bound src folder in build container and build the stuff
docker run -v $(pwd):/tmp/bootstrip shukriadams/node12build:0.0.2 sh -c "cd /tmp/bootstrip && yarn && npm run build"

# upload content to static webhost
docker run -e $HOST -e $USERNAME -e $PASSWORD -v $(pwd):/tmp/bootstrip shukriadams/node12build:0.0.2 sh -c "cd /tmp/bootstrip/src/web && rsync --recursive --ignore-times --times --compress --delete --progress --rsh="\""sshpass -p ${PASSWORD} ssh -o StrictHostKeyChecking=no -l ${USERNAME}"\"" ./*  ${USERNAME}@${HOST}:/srv/bootstrip/"

# upload release artefacts to github

# purge cache on cloudlare
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_APP}/purge_cache" \
    -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
    -H "X-Auth-Key: ${CLOUDFLARE_KEY}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'