import http from 'node:http' 
import path from 'node:path'

const PORT = 5500

const __dirname = import.meta.dirname

const server = http.createServer((req, res) => {
   res.statusCode = 200
   res.setHeader ('Content-Type', 'text/html')
   res.end ('<html><h1>Test</h1></html>')

   const absPathToResource = path.join (__dirname,'public', 'index.html')

   console.log (pathToResource)

   console.log ('absolute:', absPathToResource)

   testpath()

})

server.listen(PORT, () => console.log(`server running on PORT: ${PORT}`))