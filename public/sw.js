self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log(data);
  console.log("Notification Received");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://res.cloudinary.com/df2gu30lb/image/upload/v1709795888/logo-tripcode_hoo2vp.png",
  });
});
