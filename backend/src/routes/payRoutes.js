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
        return_url = "http://www.comercio.cl/webpay/retorno"
      );
  

        // Extract token and URL from the transaction response
        const { token, url } = transaction;

        // Construir formulario HTML
        const form = `
            <form action="${url}" method="POST">
                <input type="hidden" name="token_ws" value="${token}"/>
                <input type="submit" value="Pagar"/>
            </form>
        `;

        // Enviar el formulario como respuesta
        res.send(form);
    } catch (error) {
      console.error('Error al crear transacción:', error);
      res.status(500).json({ error: 'Error al crear transacción' });
    }
  });

  // Define the transaction response route
  router.get('/transaction-response', (req, res) => {
  // Your transaction response handling logic here
});
