const sendPassword = async (email, context, subject, path) => {
  const toEmail = email;

  const body = {
    subject,
    context,
    toEmail,
    path,
  };

  const url = `${process.env.NEXT_PUBLIC_URL_API}api/mail`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export { sendPassword };
