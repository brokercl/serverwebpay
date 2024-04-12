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

        // Construir formulario HTML
        const form = `
            <div style="text-align: center;">
                <h2>¡Listo para pagar!</h2>
                <p>Por favor, haz clic en el botón para proceder al pago.</p>
                <p>Monto a pagar: <strong>$${amount}</strong></p>
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
       res.sendFile(__dirname + '/public/response.html');
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
