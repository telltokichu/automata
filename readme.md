**To run docker**

docker run \
 --rm \
 -p 3000:3000 \
 -e "MAX_CONCURRENT_SESSIONS=5" \
 browserless/chrome:latest
