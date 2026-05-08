const axios = require("../notification_app_be/node_modules/axios");

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoaW1hbjA0MTFzaW5naEBnbWFpbC5jb20iLCJleHAiOjE3NzgyMzkwNjYsImlhdCI6MTc3ODIzODE2NiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY4ZmZlYjM4LTQ2NGEtNDNiNy1hNDgzLWNhNjdmYWRlYjhlMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIiwic3ViIjoiOGVhMzIwMzQtYjNkYS00MDI5LWJjYzItMzI1OTZlNjg3MThhIn0sImVtYWlsIjoiaGltYW4wNDExc2luZ2hAZ21haWwuY29tIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIiwicm9sbE5vIjoiOTkyMzEwMzE3NSIsImFjY2Vzc0NvZGUiOiJNZHByaEUiLCJjbGllbnRJRCI6IjhlYTMyMDM0LWIzZGEtNDAyOS1iY2MyLTMyNTk2ZTY4NzE4YSIsImNsaWVudFNlY3JldCI6InRkQXh4YWFEVlpYWkRZQ0MifQ.LhoFtTEQRTX_SKN-EQ9wpF6-_F7NG5UzF5q9txZ9SJA";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    console.log(
      "\nNotifications fetched successfully\n"
    );

    const notifications =
      response.data.notifications || [];

    if (notifications.length === 0) {
      console.log("No notifications found");
      return;
    }

    /*
      Sort notifications by:
      1. Priority
      2. Latest timestamp
    */

    const sortedNotifications =
      notifications.sort((a, b) => {
        const priorityDifference =
          priorityMap[b.Type] -
          priorityMap[a.Type];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      });

    /*
      Get top 10 notifications
    */

    const topNotifications =
      sortedNotifications.slice(0, 10);

    console.log(
      "\n===== TOP PRIORITY NOTIFICATIONS =====\n"
    );

    topNotifications.forEach(
      (notification, index) => {
        console.log(
          `${index + 1}. [${notification.Type}]`
        );

        console.log(
          `Message : ${notification.Message}`
        );

        console.log(
          `Time    : ${notification.Timestamp}`
        );

        console.log(
          "-----------------------------------"
        );
      }
    );
  } catch (error) {
    console.log(
      "\nError while fetching notifications\n"
    );

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

fetchNotifications();