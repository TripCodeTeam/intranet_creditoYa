self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log(data);
  console.log("Notification Received");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://res.cloudinary.com/dvquomppa/image/upload/v1716227392/credito_ya/twwyldy5hmbwf1mppf6b.png",
  });
});
