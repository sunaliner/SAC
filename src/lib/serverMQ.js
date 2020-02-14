const redis = require("redis");

function start(mmcs_id) {
  client = redis.createClient();

  // debug mode
  redis.debug_mode = true;

  client.on("ready", function() {
    client.subscribe(REDIS_KEY_BROADCAST);
    client.subscribe(REDIS_KEY_NOTIFY);
  });

  client.on("error", function(err) {
    console.log("serverMQ:Error:", err);
  });

  client
    .on("subscribe", function(channel, count) {
      console.log("serverMQ:subscribe:", channel, count);
    })
    .on("message", function(channel, msg) {
      console.log("serverMQ:message:", channel, msg);

      try {
        msg = JSON.parse(msg);
      } catch (e) {}

      // TODO
      switch (channel) {
        case REDIS_KEY_BROADCAST:
          console.log(REDIS_KEY_BROADCAST + ":", msg);

          break;

        case REDIS_KEY_NOTIFY:
          // If you need to send regular commands to Redis while in pub/sub mode,
          // just open another connection
          //
          console.log(REDIS_KEY_NOTIFY + ":", msg);

          _handleMQ();

          break;
      }
    });
}

exports.start = redis.start;
exports.print = redis.print;
export default client;
