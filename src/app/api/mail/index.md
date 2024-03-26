<!-- Documentar Email -->

# Email

## Enviar Email

Para enviar un email

```
URL: /api/mail

method: POST

body: {
  "subject": "string",
  "context": "object",
  "toEmail": "string",
  "path": "string"
}
```

### Request

| Campo   | Tipo   | Descripción                 |
| ------- | ------ | --------------------------- |
| subject | string | Asunto del email            |
| context | object | Contexto del email          |
| toEmail | string | Email del destinatario      |
| path    | string | Ruta del template del email |

### Path del template

#### Template existente

**"sendPassword/index"**

- Enviar contraseña al usuario cuando se crear una cuenta de padre o tutor.

**"sendPasswordUsers/index"**

- Enviar contraseña al usuario cuando se crear una cuenta de asistente.

**"updatePasswordUsers/index"**

- Enviar contraseña al usuario cuando se actualiza la contraseña.
