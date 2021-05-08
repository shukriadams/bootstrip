# simulates github action. cwd must be this folder
export USERNAME=<USERNAME> \
    && export PASSWORD=<PASSWORD> \
    && export HOST=<HOST> \
    && export CLOUDFLARE_EMAIL=<CLOUDFLARE_EMAIL> \
    && export CLOUDFLARE_ZONE=<CLOUDFLARE_ZONE> \
    && export CLOUDFLARE_KEY=<CLOUDFLARE_KEY> \
    && sh ./build.sh 
