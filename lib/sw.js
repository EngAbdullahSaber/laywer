// Listen for messages from client
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "QUEUE_UPLOAD":
      event.waitUntil(
        saveToQueue(payload).then(() => {
          event.ports[0]?.postMessage({ success: true });
        })
      );
      break;

    case "REMOVE_UPLOAD":
      event.waitUntil(removeFromQueue(payload.id));
      break;

    case "GET_UPLOADS":
      event.waitUntil(
        getPendingUploads().then((uploads) => {
          event.ports[0]?.postMessage({ uploads });
        })
      );
      break;
  }
});
