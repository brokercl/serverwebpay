const { Router} = require('express');
const router = Router();
module.exports = router;

const transbank = require('transbank-sdk').WebpayPlus; // ES5

transbank.configureForIntegration(
commerceCode = '597055555532',
apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
)

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
router.get('/create-transaction', (req, res) => {
  res.sendFile(__dirname + '/public/createTransaction.html');
});

// Route to create a transaction
router.post('/create-transaction', async (req, res) => {
    try {
      // Crea una transacción de ejemplo
      const transaction = await ( new transbank.Transaction()).create(
        buy_order = "ordenCompra12345678",
        session_id = "sesion1234557545",
        amount = req.body.amount,
        // return_url = "http://www.comercio.cl/webpay/retorno"
        return_url = "http://127.0.0.1:3000/transbank-response"
      );

        // Extract token and URL from the transaction response
        const { token, url } = transaction;

        const formattedAmount = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP'
      }).format(amount);


        // Construir formulario HTML
        const form = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dark Mode Toggle</title>
        </head>
        <body style="background-color: LightSlateGray">
        <div style="text-align: center;">
            <h2>¡Listo para pagar! <button onclick="toggleTheme()">🌞</button></h2>
            <p>Por favor, haz clic en el botón para proceder al pago.</p>
            <p>Monto a pagar: <strong>${formattedAmount}</strong></p>
            <form action="${url}" method="POST">
                <p>URL de Pago: <strong>${url}</strong></p>
                <p>Token de Transacción: <strong>${token}</strong></p>
                <input type="hidden" name="token_ws" value="${token}"/>
                <button type="submit" style="background-color: #4CAF50; /* Green */
                                            border: none;
                                            color: white;
                                            padding: 15px 32px;
                                            text-align: center;
                                            text-decoration: none;
                                            display: inline-block;
                                            font-size: 16px;
                                            margin: 4px 2px;
                                            transition-duration: 0.4s;
                                            cursor: pointer;
                                            border-radius: 12px;">
                    Pagar Ahora
                </button>
            </form>
        </div>
        <script>
            function toggleTheme() {
                const body = document.querySelector('body');
                const themeToggle = document.querySelector('button');
        
                if (body.style.backgroundColor === "rgb(240, 240, 240)") {
                    body.style.backgroundColor = "LightSlateGray";
                    themeToggle.textContent = "🌜";
                    document.querySelectorAll('p, h2, strong').forEach(element => {
                        element.style.color = "#fff"; // Set text color to white for readability
                    });
                } else {
                    body.style.backgroundColor = "#f0f0f0";
                    themeToggle.textContent = "🌞";
                    document.querySelectorAll('p, h2, strong').forEach(element => {
                        element.style.color = "LightSlateGray"; // Set text color to black for readability
                    });
                }
            }
        </script>
        </body>
        </html>
                    `;

        // Enviar el formulario como respuesta
        res.send(form);
    } catch (error) {
      console.error('Error al crear transacción:', error);
      res.status(500).json({ error: 'Error al crear transacción' });
    }
  });

// Define the transaction response route
router.get('/transbank-response', async (req, res) => {
  try {
      // Aquí debes procesar la respuesta de Transbank
      const token_ws = req.query.token_ws; // Obtén el token de la transacción desde los parámetros de la solicitud

      // Realiza el commit de la transacción utilizando el SDK de Transbank
      // Asegúrate de importar y crear una instancia adecuada del SDK de Transbank
      const commitResponse = await ( new transbank.Transaction()).commit(token_ws);

    // Verificar que response_code sea igual a cero
    if (commitResponse.response_code === 0) {
       // Renderizar la plantilla HTML con la respuesta de Transbank

        // Extract token and URL from the transaction response
        const {
          vci,
          amount,
          status,
          buy_order,
          session_id,
          card_detail,
          accounting_date,
          transaction_date,
          authorization_code,
          payment_type_code,
          response_code,
          installments_number
        } = commitResponse;

        const formattedAmount = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP'
      }).format(amount);

        // Construir formulario HTML
        const formCommitResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ciistone</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #808080;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            position: relative;
        }
        .transaction-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #FAEBD7;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .theme-toggle {
          position: relative;
          top: 10px;
          right: 10px;
          background-color: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
      }
      h1, h2 {
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          background-color: #FAEBD7;
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
          text-align: left;
        }
        .status-authorized {
          color: green;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 15px 25px;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          transition: background-color 0.3s;
      }
          button:hover {
              background-color: #45a049;
          }
    </style>
  <script>
  function redirectToInitTransaction() {
      window.location.href = '/';
  }

  function toggleTheme() {
      const body = document.querySelector('body');
      const themeToggle = document.querySelector('.theme-toggle');

      if (body.style.backgroundColor === "rgb(240, 240, 240)") {
          body.style.backgroundColor = "#000";
          themeToggle.textContent = "🌜";
      } else {
          body.style.backgroundColor = "#f0f0f0";
          themeToggle.textContent = "🌞";
      }
  }
</script>
          </head>
        <body>
            <div class="transaction-container">
        <button onclick="toggleTheme()" style="float: right;">🌞</button>
        <h1>Transacción Exitosa</h1>
        <h2>Detalles de la Transacción</h2>
          <table>
            <tr>
              <th>Ítem</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Compañía:</td>
              <td>${vci}</td>
            </tr>
            <tr>
              <td>Monto:</td>
              <td>${formattedAmount}</td>
            </tr>
            <tr>
              <td>Estado:</td>
              <td class="status-authorized">${status}</td>
            </tr>
            <tr>
              <td>Orden de Compra:</td>
              <td>${buy_order}</td>
            </tr>
            <tr>
              <td>Identificador de Sesión:</td>
              <td>${session_id}</td>
            </tr>
            <tr>
              <td>Número de Tarjeta:</td>
              <td>X${card_detail}</td>
            </tr>
            <tr>
              <td>Fecha Contable:</td>
              <td>${accounting_date}</td>
            </tr>
            <tr>
              <td>Fecha de Transacción:</td>
              <td>${transaction_date}</td>
            </tr>
            <tr>
              <td>Código de Autorización:</td>
              <td>${authorization_code}</td>
            </tr>
            <tr>
              <td>Tipo de Pago:</td>
              <td>${payment_type_code}</td>
            </tr>
            <tr>
              <td>Código de Respuesta:</td>
              <td>${response_code}</td>
            </tr>
            <tr>
              <td>Número de Cuotas:</td>
              <td>${installments_number}</td>
            </tr>
          </table>
          <div style="text-align:center;">
            <button onclick="redirectToInitTransaction()">Init Transaction</button>
          </div>
          </div>
        </body>
        </html>
  `;

                // Enviar el archivo HTML modificado al cliente
                res.send(formCommitResponse);
              } else {
      // Si response_code no es cero, enviar un mensaje de error al cliente
      res.status(400).json({ error: 'Error al confirmar la transacción' });
    }
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso de confirmación
    console.error('Error al confirmar la transacción:', error);
    res.status(500).json({ error: 'Error al confirmar la transacción' });
  }
});
