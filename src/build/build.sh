# fail on errors
set -e 

repo="shukriadams/bootstrip"

# ensure current revision is tagged
TAG=$(git describe --abbrev=0 --tags)
if [ -z "$TAG" ]; then
    echo "ERROR : tag not set."
    exit 1
fi

# write current tag+commit hash to data file so this can be embedded into headers
sh ./writeHash.sh

cd ../..

# force clean web folder
rm -rf src/web

# bind src folder in build container and build the stuff
docker run \
    -v $(pwd):/tmp/bootstrip shukriadams/node12build:0.0.2 \
    sh -c "cd /tmp/bootstrip/src && yarn --no-bin-links && npm run build"

# upload everything in src/web to demo website
docker run \
    -e $HOST \
    -e $USERNAME \
    -e $PASSWORD \
    -v $(pwd):/tmp/bootstrip shukriadams/node12build:0.0.2 sh -c "cd /tmp/bootstrip/src/web && rsync --recursive --ignore-times --compress --delete --progress --rsh="\""sshpass -p ${PASSWORD} ssh -o StrictHostKeyChecking=no -l ${USERNAME}"\"" ./*  ${USERNAME}@${HOST}:/srv/bootstrip/"


# upload release artefacts to github if GH_TOKEN env var specified
if [ ! -z $GH_TOKEN ]; then

    echo "uploading to github"

    GH_REPO="https://api.github.com/repos/$repo"
    GH_TAGS="$GH_REPO/releases/tags/$TAG"
    AUTH="Authorization: token $GH_TOKEN"
    WGET_ARGS="--content-disposition --auth-no-challenge --no-cookie"
    CURL_ARGS="-LJO#"

    # Validate token.
    curl -o /dev/null -sH "$GH_TOKEN" $GH_REPO || { echo "Error : token validation failed";  exit 1; }

    # Read asset tags.
    response=$(curl -sH "$GH_TOKEN" $GH_TAGS)

    # Get ID of the asset based on given filename.
    eval $(echo "$response" | grep -m 1 "id.:" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
    [ "$id" ] || { echo "Error : Failed to get release id for tag: $TAG"; echo "$response" | awk 'length($0)<100' >&2; exit 1; }

    curl --data-binary @"./src/web/css/bootstrip.css" -H "Authorization: token $GH_TOKEN" -H "Content-Type: application/octet-stream" https://uploads.github.com/repos/$repo/releases/$id/assets?name=bootstrip.css
    curl --data-binary @"./src/web/css/bootstrip-theme-default.css" -H "Authorization: token $GH_TOKEN" -H "Content-Type: application/octet-stream" https://uploads.github.com/repos/$repo/releases/$id/assets?name=bootstrip-theme-default.css
    curl --data-binary @"./src/web/css/bootstrip-theme-darkmoon.css" -H "Authorization: token $GH_TOKEN" -H "Content-Type: application/octet-stream" https://uploads.github.com/repos/$repo/releases/$id/assets?name=bootstrip-theme-darkmoon.css
    curl --data-binary @"./src/web/js/bootstrip.js" -H "Authorization: token $GH_TOKEN" -H "Content-Type: application/octet-stream" https://uploads.github.com/repos/$repo/releases/$id/assets?name=bootstrip.js

    echo "assets uploaded"
fi

# purge cache on cloudlare
curl \
    -X POST  \
    -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
    -H "X-Auth-Key: ${CLOUDFLARE_KEY}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' \
    "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/purge_cache"