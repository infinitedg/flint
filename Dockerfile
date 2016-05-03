FROM meteorhacks/meteord:onbuild

ENV MONGO_URL mongodb://farpoint:voyager1@localhost:27017/flint
ENV ROOT_URL http://voyager-server.local
ENV VIRTUAL_HOST voyager-server.local

EXPOSE 80