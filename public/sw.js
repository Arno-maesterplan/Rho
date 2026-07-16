// Service worker voor push-notificaties
self.addEventListener("push", (event) => {
  let data = { title: "Rho 💛", body: "Er is iets nieuws!", url: "/" };
  try {
    data = { ...data, ...event.data.json() };
  } catch (e) {
    // gebruik defaults
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((lijst) => {
      for (const client of lijst) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
