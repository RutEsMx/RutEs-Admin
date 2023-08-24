
const NotificationItem = ({ notification }) => {
  const dateFormat = new Date(notification.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  return (
    <>
      <div className="divider m-0"></div> 
      <div className="grid grid-cols-6 text-sm">
        <div className="flex justify-center items-center">
          <label>{dateFormat}</label>
        </div>
        <div className="col-span-5 flex flex-col">
          <label className="font-bold">{notification.title}</label>
          <label>{notification.message}</label>
        </div>
      </div>
    </>
  );
}

const NotificationList = ({ notifications }) => {
  return (
    <div className="overflow-auto h-32">
      {notifications?.map((notification) => (
        <NotificationItem notification={notification} key={notification?.id}/>
      ))}
    </div>
  );
}

export default NotificationList;