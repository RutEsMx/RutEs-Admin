const NotificationItem = ({ data }) => {
  const { notification, createdAt } = data;
  const dateFormat = new Date(createdAt._seconds * 1000).toLocaleTimeString(
    "es-MX",
    { hour: "2-digit", minute: "2-digit" },
  );
  return (
    <>
      <div className="divider m-0"></div>
      <div className="grid grid-cols-6 text-sm">
        <div className="flex justify-center items-center">
          <label>{dateFormat}</label>
        </div>
        <div className="col-span-5 flex flex-col">
          <label className="font-bold">{notification.title}</label>
          <label>{notification.body}</label>
        </div>
      </div>
    </>
  );
};

const NotificationList = ({ data, className }) => {
  return (
    <div className={`overflow-auto ${className}`}>
      {data?.map((notification) => (
        <NotificationItem data={notification} key={notification?.id} />
      ))}
    </div>
  );
};

export default NotificationList;
