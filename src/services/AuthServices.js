import { generatePassword, validateEmail } from "@/utils"
import { createDocument, getDocumentById, getDocuments, updateDocument } from "@/firebase/crud"

const signUp = async (email) => {
  const password = generatePassword()

  try {
    if(validateEmail(email)) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email, 
          password: password,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      
      if(response.ok) {
        data.result.password = password
        return data
      }
      if (data.error) {
        throw new Error(data.error)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export {
  signUp,
}
