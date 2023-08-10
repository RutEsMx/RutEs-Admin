
const removeCookies = async () => {
  const url = `${process.env.NEXT_PUBLIC_URL_API}api/cookies`
  const response = await fetch(url, {
    method: 'DELETE',
  })
  const data = await response.json()
  return data
}

const getCookies = async (jwt) => {
  const url = `${process.env.NEXT_PUBLIC_URL_API}api/cookies`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jwt }),
  })
  const data = await response.json()
  return data
}

export { removeCookies, getCookies }