const express = require('express');
const app = express();
const port = 3000; 

<Route path="/user-login" element={<UserLogin />} />

app.get('/', (req, res) => {
  res.send('Buenas tardes')
})
 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


