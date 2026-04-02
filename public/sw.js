self.addEventListener("push", event => {
  let data = {};
  
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
      icon: "/logo.png"
    })
  );
});

