import NotificationItem from "./NotificationItem";

const NotificationList = ({ data, className }) => {
  return (
    <div className={`overflow-auto ${className}`}>
      <div className="divide-y-2 grid grid-cols-1">
        {data?.map((notification) => (
          <NotificationItem data={notification} key={notification?.id} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
